// Disposable PostgreSQL acceptance only: no ports, network, host volumes, Auth server or email.
import { spawn, spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, unlinkSync, rmdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import assert from 'node:assert/strict';

const args = process.argv.slice(2);
if (args.length === 1 && args[0] === '--help') {
  console.log('Usage: node scripts/acceptance/notification-worker-postgres.mjs --source-ref <exact-40-character-reviewed-commit>');
  process.exit(0);
}
if (args.length !== 2 || args[0] !== '--source-ref' || !/^[0-9a-f]{40}$/.test(args[1])) {
  console.error('An exact reviewed source commit is required; use --help.');
  process.exit(1);
}
const sourceRef = args[1];
const image = 'public.ecr.aws/supabase/postgres:17.6.1.165';
const container = `nihonest-j1-acceptance-${process.pid}`;
const files = [];
const sessions = [];
let directory;
let started = false;
let assertions = 0;
const evidence = {};
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
function command(program, argv, allowFailure = false) {
  const result = spawnSync(program, argv, { encoding: 'utf8', timeout: 15_000 });
  if (!allowFailure && result.status !== 0) throw Error(`${program} failed: ${result.stderr || result.error || result.stdout}`);
  return result;
}
const docker = (argv, allowFailure) => command('docker', argv, allowFailure);
const git = (argv) => command('git', argv).stdout.trim();
function check(value, message) { assert.ok(value, message); assertions++; }
function equal(actual, expected) { assert.deepEqual(actual, expected); assertions++; }
function sql(query) {
  return docker(['exec', container, 'psql', '-X', '-U', 'postgres', '-v', 'ON_ERROR_STOP=1', '-Atq', '-c', query]).stdout.trim();
}
function apply(text, name) {
  const file = join(directory, name);
  if (!files.includes(file)) files.push(file);
  writeFileSync(file, text);
  docker(['cp', file, `${container}:/tmp/${name}`]);
  return docker(['exec', container, 'psql', '-X', '-U', 'postgres', '-v', 'ON_ERROR_STOP=1', '-1', '-Atq', '-f', `/tmp/${name}`]).stdout;
}
class Session {
  constructor(name) {
    this.name = name;
    this.output = '';
    this.errors = '';
    this.sequence = 0;
    this.child = spawn('docker', ['exec', '-i', container, 'psql', '-X', '-U', 'postgres', '-Atq', '-v', 'ON_ERROR_STOP=1', '-v', 'VERBOSITY=verbose'], { stdio: ['pipe', 'pipe', 'pipe'] });
    this.child.stdout.on('data', chunk => { this.output += chunk; this.flush(); });
    this.child.stderr.on('data', chunk => { this.errors += chunk; });
    this.child.on('error', error => this.fail(error));
    this.child.on('close', code => this.fail(Error(`Session ${name} exited ${code}: ${this.errors}`)));
    sessions.push(this);
  }
  fail(error) {
    this.closed = true;
    if (this.pending) { clearTimeout(this.pending.timer); this.pending.reject(error); this.pending = undefined; }
  }
  flush() {
    if (!this.pending) return;
    const marker = `${this.pending.marker}\n`;
    const offset = this.output.indexOf(marker);
    if (offset < 0) return;
    const output = this.output.slice(0, offset).trim();
    this.output = this.output.slice(offset + marker.length);
    const pending = this.pending;
    this.pending = undefined;
    clearTimeout(pending.timer);
    pending.resolve(output);
  }
  query(text) {
    if (this.pending || this.closed) return Promise.reject(Error(`Session ${this.name} is unavailable`));
    return new Promise((resolve, reject) => {
      const marker = `RECEIPT_${this.name}_${++this.sequence}`;
      const timer = setTimeout(() => this.fail(Error(`Session ${this.name} timed out`)), 12_000);
      this.pending = { marker, timer, resolve, reject };
      this.child.stdin.write(`${text}\n\\echo ${marker}\n`);
    });
  }
  close() { this.child.stdin.end(); }
}
const id = i => `92100000-0000-4000-8000-${String(i).padStart(12, '0')}`;
const row = i => JSON.parse(sql(`select to_jsonb(t) from public.notification_deliveries t where id='${id(i)}'`));
const claim = "select row_to_json(t) from public.claim_email_notification_deliveries(p_limit=>1,p_max_attempts=>5,p_lease_seconds=>300) t;";

async function postLockExpiry(negativeControl) {
  const a = new Session(negativeControl ? 'control_a' : 'expiry_a');
  const b = new Session(negativeControl ? 'control_b' : 'expiry_b');
  const token = row(1).claim_token;
  sql(`update public.notification_deliveries set claim_expires_at=clock_timestamp()+interval '4 seconds' where id='${id(1)}'`);
  const before = row(1);
  const aPid = Number(await a.query(`begin; select pg_backend_pid(); select id from public.notification_deliveries where id='${id(1)}' for update;` ).then(text => text.split('\n')[0]));
  const bPid = Number(await b.query('select pg_backend_pid();'));
  check(aPid !== bPid, 'independent PostgreSQL backend PIDs');
  const callStarted = await b.query("select clock_timestamp(); set statement_timeout='10s'; set role service_role;");
  check(Date.parse(callStarted) < Date.parse(before.claim_expires_at), 'finalization starts with a valid lease');
  const pending = b.query(`select to_jsonb(public.finalize_email_notification_delivery_now('${id(1)}','${token}','suppressed'));`)
    .then(output => ({ output }), error => ({ error }));
  let blocked;
  for (let attempt = 0; attempt < 20; attempt++) {
    const value = sql(`select row_to_json(t) from (select wait_event_type,query_start,pg_blocking_pids(pid) as blockers from pg_stat_activity where pid=${bPid}) t`);
    blocked = value ? JSON.parse(value) : undefined;
    if (blocked?.wait_event_type === 'Lock' && blocked.blockers.includes(aPid)) break;
    await delay(100);
  }
  check(blocked?.wait_event_type === 'Lock' && blocked.blockers.includes(aPid), 'finalizer actually waits on A row lock');
  check(Date.parse(blocked.query_start) < Date.parse(before.claim_expires_at), 'blocked query began before lease expiry');
  let releasedAfterExpiry = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    if (sql(`select clock_timestamp() > claim_expires_at from public.notification_deliveries where id='${id(1)}'`) === 't') { releasedAfterExpiry = true; break; }
    await delay(100);
  }
  check(releasedAfterExpiry, 'database time passes lease expiry before lock release');
  const releasedAt = await a.query('select clock_timestamp(); commit;');
  check(Date.parse(releasedAt) > Date.parse(before.claim_expires_at), 'lock release timestamp is after expiry');
  const result = await pending;
  if (negativeControl) {
    check(!result.error, 'transaction-time negative control incorrectly finalizes expired work');
    equal(row(1).state, 'suppressed');
  } else {
    check(result.error && /P0002/.test(result.error.message), 'post-lock expiry raises P0002');
    equal(row(1), before);
  }
  a.close(); b.close();
  return { backendA: aPid, backendB: bPid, callStarted, queryStarted: blocked.query_start, leaseExpiredAt: before.claim_expires_at, releasedAt };
}

async function main() {
  equal(git(['rev-parse', sourceRef]), sourceRef);
  // --pull=never prevents network/download surprises; failure never touches an existing stack.
  docker(['run', '--detach', '--rm', '--pull=never', '--network', 'none', '--name', container, '-e', 'POSTGRES_PASSWORD=isolated-acceptance-fixture', image]);
  started = true;
  directory = mkdtempSync(join(tmpdir(), 'nihonest-j1-acceptance-'));
  let ready = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    const logs = docker(['logs', container], true);
    if (/\[1\] LOG:  database system is ready to accept connections/.test(logs.stdout + logs.stderr)
      && docker(['exec', container, 'pg_isready', '-U', 'postgres'], true).status === 0) { ready = true; break; }
    await delay(500);
  }
  check(ready, 'final PostgreSQL server ready');
  evidence.postgres = sql('show server_version;');
  evidence.migrations = git(['ls-tree', '-r', '--name-only', sourceRef, '--', 'supabase/migrations']).split('\n').filter(name => name.endsWith('.sql')).sort();
  for (const name of evidence.migrations) apply(git(['show', `${sourceRef}:${name}`]), name.split('/').at(-1));
  sql(`insert into auth.users(id,email) values('90100000-0000-4000-8000-000000000001','concurrency@example.test');
    insert into public.notification_events(id,user_id,event_type,deduplication_key,payload)
    select ('91100000-0000-4000-8000-'||lpad(i::text,12,'0'))::uuid,'90100000-0000-4000-8000-000000000001','reminder-due','concurrency-'||i,'{"title":"Fixture"}' from generate_series(1,4) i;
    insert into public.notification_deliveries(id,event_id,user_id,channel,state,attempt_count,available_at,last_attempted_at,claim_token,claim_expires_at,last_error)
    select ('92100000-0000-4000-8000-'||lpad(i::text,12,'0'))::uuid,('91100000-0000-4000-8000-'||lpad(i::text,12,'0'))::uuid,
    '90100000-0000-4000-8000-000000000001','email',case when i<=2 then 'pending' when i=3 then 'failed' else 'processing' end,
    case when i<=2 then 0 else 5 end,clock_timestamp()-interval '1 minute',case when i>2 then clock_timestamp()-interval '2 minutes' end,
    case when i=4 then gen_random_uuid() end,case when i=4 then clock_timestamp()-interval '1 minute' end,case when i=3 then 'Fixture failure' end from generate_series(1,4) i;`);
  const a = new Session('claim_a');
  const b = new Session('claim_b');
  evidence.claimBackends = [Number(await a.query('select pg_backend_pid();')), Number(await b.query('select pg_backend_pid();'))];
  check(evidence.claimBackends[0] !== evidence.claimBackends[1], 'competing claims use independent backends');
  const first = JSON.parse(await a.query(`begin; set local role service_role; ${claim}`));
  const startedB = performance.now();
  const second = JSON.parse(await b.query(`begin; set local statement_timeout='2s'; set local role service_role; ${claim} commit;`));
  evidence.competingClaimMilliseconds = Math.round(performance.now() - startedB);
  check(first.id !== second.id, 'B claims different work while A still holds its transaction');
  equal(first.attempt_count, 1); equal(second.attempt_count, 1);
  check(first.claim_token !== second.claim_token, 'independent claim tokens');
  await a.query('commit;');
  equal(row(1).attempt_count, 1); equal(row(2).attempt_count, 1);
  equal(row(1).claim_token, first.claim_token); equal(row(2).claim_token, second.claim_token);
  const exhaustedBefore = [row(3), row(4)];
  equal(JSON.parse(sql('select public.inspect_email_notification_delivery_backlog(5)')), { exhausted_failed: 1, exhausted_expired_processing: 1 });
  equal(await b.query(`set role service_role; ${claim}`), '');
  equal([row(3), row(4)], exhaustedBefore);

  const old = row(1);
  sql(`update public.notification_deliveries set claim_expires_at=clock_timestamp()-interval '1 second' where id='${id(1)}'`);
  const reclaimed = JSON.parse(await b.query(claim));
  equal(reclaimed.id, id(1)); equal(reclaimed.attempt_count, 2);
  check(reclaimed.claim_token !== old.claim_token, 'reclaim replaces original token');
  const reclaimedSnapshot = row(1);
  await a.query(`do $$ begin perform public.finalize_email_notification_delivery_now('${id(1)}','${old.claim_token}','suppressed');
    raise exception 'Old token unexpectedly accepted'; exception when sqlstate 'P0002' then null; end $$;`);
  equal(row(1), reclaimedSnapshot);
  a.close(); b.close();

  evidence.postLockExpiry = await postLockExpiry(false);
  const authority = git(['show', `${sourceRef}:supabase/migrations/20260929000100_add_notification_worker_authority.sql`]);
  const weakened = authority.replace('completed_at := pg_catalog.clock_timestamp();', 'completed_at := pg_catalog.transaction_timestamp();');
  check(weakened !== authority, 'negative control replaces only completion clock');
  try {
    apply(weakened, 'authority-negative-control.sql');
    evidence.negativeControl = await postLockExpiry(true);
  } finally { apply(authority, 'authority-restored.sql'); }
  equal([row(3), row(4)], exhaustedBefore);
  console.log(JSON.stringify({ status: 'passed', sourceRef, assertions, ...evidence }, null, 2));
}
main().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(() => {
  for (const session of sessions) { session.close(); session.child.kill(); }
  if (started) {
    const stopped = docker(['stop', container], true);
    if (stopped.status !== 0) { console.error('Disposable container cleanup failed.'); process.exitCode = 1; }
  }
  // Remove only individually tracked temporary files; no recursive or computed-tree deletion.
  for (const file of files) unlinkSync(file);
  if (directory) rmdirSync(directory);
});
