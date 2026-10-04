// Disposable operator-procedure acceptance. No deployment URL, credentials, shared stack or provider.
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, unlinkSync, rmdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash, randomUUID } from 'node:crypto';
import assert from 'node:assert/strict';

const args = process.argv.slice(2);
if (args.length === 1 && args[0] === '--help') {
  console.log('Usage: node scripts/acceptance/notification-worker-operator.mjs --source-ref <exact-40-character-reviewed-commit>');
  console.log('Creates and removes an owned network-disabled PostgreSQL fixture. Local image required; no pull.');
  process.exit(0);
}
if (args.length !== 2 || args[0] !== '--source-ref' || !/^[0-9a-f]{40}$/.test(args[1])) {
  console.error('An exact reviewed source commit is required; use --help.');
  process.exit(1);
}
const sourceRef = args[1];
const cwd = fileURLToPath(new URL('../../', import.meta.url));
const image = 'public.ecr.aws/supabase/postgres:17.6.1.165';
const ownership = randomUUID();
const container = `nihonest-j1-operator-${process.pid}-${ownership.slice(0, 8)}`;
const files = [];
let directory;
let containerId;
let createAttempted = false;
let assertions = 0;
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
function command(program, argv, allowFailure = false) {
  const result = spawnSync(program, argv, { cwd, encoding: 'utf8', timeout: 30_000 });
  if (!allowFailure && result.status !== 0) throw Error(`${program} failed: ${result.stderr || result.error || result.stdout}`);
  return result;
}
const docker = (argv, allowFailure) => command('docker', argv, allowFailure);
const git = (argv) => command('git', argv).stdout;
const equal = (actual, expected) => { assert.deepEqual(actual, expected); assertions++; };
// psql ON_ERROR_STOP exits 3 for a script SQL error; a Docker/timeout failure is not a valid rejection.
const rejected = result => { assert.equal(result.status, 3, result.stdout + result.stderr); assertions++; };
function sql(query) {
  return docker(['exec', containerId, 'psql', '-X', '-U', 'postgres', '-v', 'ON_ERROR_STOP=1', '-Atq', '-c', query]).stdout.trim();
}
function copy(text, name) {
  const file = join(directory, name);
  files.push(file);
  writeFileSync(file, text, 'utf8');
  docker(['cp', file, `${containerId}:/tmp/${name}`]);
}
function op(id, commit, reference = 'fixture-incident') {
  const argv = ['exec', containerId, 'psql', '-X', '-U', 'postgres', '-Atq'];
  if (id !== undefined) argv.push('-v', `delivery_id=${id}`);
  if (commit !== undefined) argv.push('-v', `commit_resolution=${commit}`);
  if (reference !== null) argv.push('-v', `resolution_reference=${reference}`);
  argv.push('-f', '/tmp/resolve-exhausted-email-delivery.sql');
  return docker(argv, true);
}
const id = index => `92100000-0000-4000-8000-${String(index).padStart(12, '0')}`;
const snapshot = () => sql('select jsonb_agg(to_jsonb(t) order by id) from public.notification_deliveries t');
const row = index => JSON.parse(sql(`select to_jsonb(t) from public.notification_deliveries t where id='${id(index)}'`));

async function main() {
  // Resolve/read all source before Docker. Neither a tag, tree nor dirty working-copy SQL is accepted.
  assert.equal(git(['rev-parse', `${sourceRef}^{commit}`]).trim(), sourceRef);
  const migrationNames = git(['ls-tree', '-r', '--name-only', sourceRef, '--', 'supabase/migrations'])
    .trim().split('\n').filter(name => /^supabase\/migrations\/[0-9]+_[a-z0-9_]+\.sql$/.test(name)).sort();
  assert(migrationNames.length > 0, 'Source has no migrations.');
  const migrations = migrationNames.map(name => ({ name, text: git(['show', `${sourceRef}:${name}`]) }));
  const procedure = git(['show', `${sourceRef}:scripts/sql/resolve-exhausted-email-delivery.sql`]);
  const sha256 = text => createHash('sha256').update(text).digest('hex');
  directory = mkdtempSync(join(tmpdir(), 'nihonest-j1-operator-'));
  createAttempted = true;
  containerId = docker(['create', '--pull=never', '--network', 'none', '--name', container,
    '--label', `nihonest.operator-acceptance=${ownership}`, '-e', 'POSTGRES_PASSWORD=isolated-acceptance-fixture', image]).stdout.trim();
  assert(/^[0-9a-f]{64}$/.test(containerId), 'Expected an owned container ID.');
  const configuration = JSON.parse(docker(['inspect', containerId]).stdout)[0];
  assert.equal(configuration.Config.Labels['nihonest.operator-acceptance'], ownership);
  assert.equal(configuration.HostConfig.NetworkMode, 'none');
  assert(!configuration.HostConfig.Binds?.length && !Object.keys(configuration.HostConfig.PortBindings ?? {}).length,
    'Fixture must have no host binds or published ports.');
  docker(['start', containerId]);
  let ready = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    const logs = docker(['logs', containerId], true);
    if (/\[1\] LOG:  database system is ready to accept connections/.test(logs.stdout + logs.stderr)
      && docker(['exec', containerId, 'pg_isready', '-U', 'postgres'], true).status === 0) { ready = true; break; }
    await delay(500);
  }
  assert(ready, 'Final PostgreSQL server did not finish initialization.');
  const postgres = sql('show server_version');
  for (const { name, text } of migrations) {
    const basename = name.split('/').at(-1);
    copy(text, basename);
    docker(['exec', containerId, 'psql', '-X', '-U', 'postgres', '-v', 'ON_ERROR_STOP=1', '-1', '-Atq', '-f', `/tmp/${basename}`]);
  }
  copy(procedure, 'resolve-exhausted-email-delivery.sql');
  // Explicit synthetic rows, independent of pgTAP fixture layout. No Auth server/email is involved.
  sql(`insert into auth.users(id,email) values('90100000-0000-4000-8000-000000000001','operator@example.test');
    insert into public.notification_events(id,user_id,event_type,deduplication_key,payload)
    select ('91100000-0000-4000-8000-'||lpad(i::text,12,'0'))::uuid,'90100000-0000-4000-8000-000000000001',
      'reminder-due','operator-'||i,'{"title":"Fixture"}' from generate_series(1,7) i;
    insert into public.notification_deliveries(id,event_id,user_id,channel,state,attempt_count,available_at,last_attempted_at,
      claim_token,claim_expires_at,last_error,sent_at,provider_message_id)
    select ('92100000-0000-4000-8000-'||lpad(i::text,12,'0'))::uuid,('91100000-0000-4000-8000-'||lpad(i::text,12,'0'))::uuid,
      '90100000-0000-4000-8000-000000000001','email',case when i<=2 then 'failed' when i=7 then 'sent' else 'processing' end,
      case when i in (1,3,4,7) then 5 when i in (2,5) then 4 else 1 end,
      clock_timestamp()-interval '1 minute',clock_timestamp()-interval '2 minutes',
      case when i between 3 and 6 then gen_random_uuid() end,
      case when i in (3,5) then clock_timestamp()-interval '1 minute' when i between 3 and 6 then clock_timestamp()+interval '1 hour' end,
      case when i<=2 then 'Fixture failure' end,case when i=7 then clock_timestamp() end,case when i=7 then 'fixture-sent' end
    from generate_series(1,7) i;`);
  const before = snapshot();
  equal(op(id(1)).status, 0); equal(snapshot(), before);
  for (const [deliveryId, flag, reference] of [
    [id(1), 'true', null], [id(1), 'true', '   '], [undefined, 'true', 'fixture-incident'], [id(1), 'yes', 'fixture-incident'],
    ['not-a-uuid', 'true', 'fixture-incident'], [id(1), 'true', 'x'.repeat(81)],
  ]) { rejected(op(deliveryId, flag, reference)); equal(snapshot(), before); }
  equal(op(id(1), 'false').status, 0); equal(snapshot(), before);
  for (const index of [2, 4, 5, 6, 7, 99]) { rejected(op(id(index), 'true')); equal(snapshot(), before); }
  for (const index of [1, 3]) {
    const prior = row(index);
    const unaffected = JSON.parse(snapshot()).filter(delivery => delivery.id !== id(index));
    equal(op(id(index), 'true').status, 0);
    const after = row(index);
    equal(after.state, 'suppressed');
    for (const key of ['attempt_count', 'last_attempted_at', 'available_at', 'event_id', 'user_id']) equal(after[key], prior[key]);
    for (const key of ['claim_token', 'claim_expires_at', 'last_error', 'sent_at', 'provider_message_id']) equal(after[key], null);
    equal(JSON.parse(snapshot()).filter(delivery => delivery.id !== id(index)), unaffected);
    rejected(op(id(index), 'true'));
    equal(row(index), after);
  }
  equal(JSON.parse(sql('select public.inspect_email_notification_delivery_backlog(5)')), { exhausted_failed: 0, exhausted_expired_processing: 0 });
  return { status: 'passed', sourceRef, assertions, postgres, procedureChecksum: sha256(procedure),
    migrations: migrations.map(({ name, text }) => ({ name, checksum: sha256(text) })) };
}

let evidence;
try { evidence = await main(); }
catch (error) { console.error(error.message); process.exitCode = 1; }
finally {
  // Check ownership even after a failed create/start. Never remove a pre-existing or foreign container.
  if (createAttempted) {
    const inspection = docker(['inspect', container], true);
    if (inspection.status === 0) {
      const owned = JSON.parse(inspection.stdout)[0];
      if (owned.Config.Labels?.['nihonest.operator-acceptance'] !== ownership
        || docker(['rm', '--force', '--volumes', owned.Id], true).status !== 0) {
        console.error('Owned fixture cleanup failed; no foreign container was removed.'); process.exitCode = 1;
      }
    } else if (!/No such (?:object|container)/i.test(inspection.stderr)) {
      console.error('Unable to verify fixture cleanup.'); process.exitCode = 1;
    }
  }
  // No recursive deletion: remove only the exact files created by this process and its empty temp directory.
  try { for (const file of files) unlinkSync(file); if (directory) rmdirSync(directory); }
  catch { console.error('Fixture temporary-file cleanup failed.'); process.exitCode = 1; }
}
if (evidence && !process.exitCode) console.log(JSON.stringify({ ...evidence, cleanup: 'removed' }, null, 2));
