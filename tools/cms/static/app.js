const summary = document.querySelector("#summary");
const list = document.querySelector("#article-list");
const detail = document.querySelector("#article-detail");
const failures = document.querySelector("#failures");
const resultCount = document.querySelector("#result-count");
const search = document.querySelector("#search");
const statusFilter = document.querySelector("#status-filter");
const kindFilter = document.querySelector("#kind-filter");
const groupFilter = document.querySelector("#group-filter");
const sortOrder = document.querySelector("#sort-order");
const websiteOrigin = "http://127.0.0.1:3000";
let articles = [];
// The content list as currently filtered and sorted; the review queue steps through it.
let currentMatches = [];
let selectedId = null;
let selectedKind = "article";
let sessionToken = null;
let hasUnsavedChanges = false;
let cancelEditorPreview = () => {};
let referenceRecords = [];
let selectedReference = null;
let localGuidanceLocations = [];
let localGuidanceGuides = [];
let localGuidanceFailures = [];
let selectedLocalGuidanceId = null;
let localGuidanceDetailRecord = null;
let localGuidanceUnsaved = false;
let lastGitReport = null;
let lastHandoff = null;
let recoveryDraftCount = 0;
let catalogFailureCount = 0;
let dataRefreshedAt = null;

const referenceSearch = document.querySelector("#reference-search");
const referenceKind = document.querySelector("#reference-kind");
const referenceList = document.querySelector("#reference-list");
const referenceCount = document.querySelector("#reference-count");
const referenceDetail = document.querySelector("#reference-detail");
const localGuidanceLocation = document.querySelector("#local-guidance-location");
const localGuidanceSearch = document.querySelector("#local-guidance-search");
const localGuidanceList = document.querySelector("#local-guidance-list");
const localGuidanceCount = document.querySelector("#local-guidance-count");
const localGuidanceFailuresPanel = document.querySelector("#local-guidance-failures");
const localGuidanceDetail = document.querySelector("#local-guidance-detail");
const localGuidanceMatrix = document.querySelector("#local-guidance-matrix");

function el(tag, text, className) {
  const node = document.createElement(tag);
  node.textContent = text;
  if (className) node.className = className;
  return node;
}

const helpText = {
  articleBody: "The English MDX body shown on the article page. Use the formatting buttons for headings, emphasis, lists, quotes, links, and approved shared components. Review the preview before saving.",
  updatedAt: "Date of this factual content change. Keep it at or after the previous update date; use the date the change is made, not the review date.",
  linkText: "Words readers will see and activate. Describe the destination without relying on surrounding text.",
  linkUrl: "A site path beginning with / or an HTTP(S) URL. Check that it opens the intended page.",
  component: "An approved interactive component inserted into the article at the cursor. Inspect it in the full website view.",
  status: "Draft is incomplete; Editorial review awaits human approval. Archived removes a retired item from current guidance where available. Saving status does not approve content.",
  reviewDate: "The date you personally completed this substantive review. It must be no earlier than the content update date and cannot be in the future.",
  changeNote: "Describe the exact claims, qualifications, links, sources, and related content you checked or changed. Make this specific enough for another editor to understand the decision.",
  validation: "List only checks you actually performed, one per line: for example, official source comparison, link inspection, preview review, or a named command and result.",
  sourceReviews: "Optional IDs of already resolved source-review records connected to this content, one per line. These are review record IDs, not source IDs or URLs.",
  approvalNote: "Write your explicit editorial decision for the exact revision shown above, including any limits or follow-up needed. This note is stored in the immutable approval record.",
  approvalCheck: "Check only after reviewing the complete current content, metadata, evidence, and relevant preview yourself. Submitting creates a human approval record for this exact revision.",
  question: "The reader-facing FAQ question. Keep it specific to the answer and understandable without the category label.",
  faqSummary: "A concise answer to the FAQ, with key conditions and caveats. Maximum 320 characters. Supporting detail belongs in linked guidance.",
  residenceSummary: "A short introduction to this residence status. Explain its broad scope without implying automatic eligibility.",
  purpose: "What this residence status is intended to cover. Distinguish its purpose from examples and individual eligibility decisions.",
  typicalActivities: "Typical activities associated with the status, one per line. Describe the category accurately; do not promise that any individual activity is permitted.",
  examples: "Illustrative official examples, one per line. Keep examples separate from legal conditions and do not present them as an exhaustive list.",
  considerations: "Practical points a reader must verify against current official requirements, one per line. Include important limits and case-specific checks.",
  englishName: "The English label readers see for this glossary term. Keep it aligned with the Japanese term and established site terminology.",
  shortDefinition: "A brief plain-language definition used in glossary lists and the page introduction. Preserve important qualifications.",
  detailedExplanation: "The main explanation of what the term means and any important distinctions or limits.",
  commonContext: "Where a reader is likely to encounter this term, such as forms, procedures, or official notices.",
};

function helpDisclosure(title, help) {
  const disclosure = document.createElement("details");
  disclosure.className = "field-help";
  const trigger = el("summary", "?");
  trigger.setAttribute("aria-label", `Help for ${title}`);
  disclosure.append(trigger, el("div", help, "field-help-panel"));
  return disclosure;
}

function labeledField(title, id, help) {
  const row = document.createElement("div");
  row.className = "field-label-row";
  const label = el("label", title);
  label.htmlFor = id;
  row.append(label, helpDisclosure(title, help));
  return row;
}

function approvalField(text) {
  const row = document.createElement("div");
  row.className = "field-label-row approval-row";
  const label = el("label", text, "approval-check");
  const check = document.createElement("input");
  check.type = "checkbox";
  check.required = true;
  label.prepend(check);
  row.append(label, helpDisclosure("Approval confirmation", helpText.approvalCheck));
  return { row, check };
}

/**
 * Article writes regenerate src/data/generated/article-metadata.ts. When that fails the canonical save still
 * stands; this banner says so, offers the repair, and comes back after a reload until the module is current.
 */
function renderGeneratedMetadata(state) {
  const notice = document.querySelector("#generated-metadata");
  if (!notice) return;
  if (!state || (state.status !== "stale" && state.status !== "unavailable")) {
    notice.hidden = true;
    notice.replaceChildren();
    return;
  }
  const reason = state.lastFailure || state.message;
  const summaryText = state.status === "unavailable"
    ? `Generated article metadata could not be checked${reason ? `: ${reason}` : "."}`
    : `Article changes are saved, but src/data/generated/article-metadata.ts is out of date${reason ? ` because regeneration failed: ${reason}` : "."} A production build refuses stale metadata.`;
  const repair = el("button", "Regenerate article metadata");
  repair.type = "button";
  const result = el("p", "", "hint");
  repair.addEventListener("click", async () => {
    repair.disabled = true;
    result.textContent = "Regenerating article metadata…";
    try {
      const response = await mutate("/api/generated-metadata/refresh", "POST", {});
      renderGeneratedMetadata(response.state);
    } catch (error) {
      result.textContent = error.message;
      result.className = "error";
      repair.disabled = false;
    }
  });
  notice.replaceChildren(el("p", summaryText, "check-warning"),
    el("p", "Regenerate it here, or run npm run content:metadata, then review and commit the change.", "hint"), repair, result);
  notice.hidden = false;
}

/** Shows the banner immediately from an article write's response; refresh() then rechecks the files. */
function noteGeneratedMetadata(writeResult) {
  if (writeResult?.generatedMetadata?.status === "failed") {
    renderGeneratedMetadata({ status: "stale", lastFailure: writeResult.generatedMetadata.message });
  }
}

async function refreshGeneratedMetadata() {
  try { renderGeneratedMetadata(await json("/api/generated-metadata")); }
  catch { /* Advisory only: a failed check never blocks editing. */ }
}

async function json(path) {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) throw new Error(`Request failed (${response.status}).`);
  return response.json();
}

async function mutate(path, method, payload) {
  if (!sessionToken) sessionToken = (await json("/api/session")).token;
  const response = await fetch(path, {
    method,
    headers: { "Content-Type": "application/json", "X-CMS-Token": sessionToken },
    body: JSON.stringify(payload),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || `Request failed (${response.status}).`);
  return result;
}

function recoveryPath(kind, id) {
  return `/api/recovery/drafts/${encodeURIComponent(kind)}/${encodeURIComponent(id)}`;
}

function recordRevision(record) {
  return record.kind === "article" ? record.summary.revision : record.revision;
}

function recoveryPanel(record, loadDraft) {
  const panel = document.createElement("section");
  panel.className = "recovery-panel";
  panel.setAttribute("aria-label", "Local recovery draft");
  panel.append(el("h3", "Local recovery draft"), el("p", "Checking for a saved recovery draft…", "hint"));
  const route = recoveryPath(record.kind, record.metadata?.id || record.id);
  let snapshot = null;
  let timer;
  let chain = Promise.resolve();
  let version = 0;
  let persistedVersion = 0;
  let cleared = false;
  let loaded = false;
  let authorized = false;
  let pendingWrite = false;
  let currentContent = () => null;
  let savedListener = () => {};
  const revision = recordRevision(record);
  const sourceRevision = record.kind === "article" ? undefined : record.source.sourceRevision;
  const canLoad = record.kind === "article"
    ? record.metadata.status === "draft" || record.metadata.status === "needs-review"
    : Boolean(record.editableFields?.length);
  const snapshotRecord = () => ({
    expectedRecordRevision: revision,
    ...(sourceRevision ? { expectedSourceRevision: sourceRevision } : {}),
    content: currentContent(),
  });
  function render() {
    // With no draft the panel is a one-line note; a saved draft expands it with the comparison and actions.
    panel.classList.toggle("empty", !snapshot);
    if (!snapshot) {
      panel.replaceChildren(el("p", "No saved recovery draft for this record. While you edit, unsaved edits are kept as a local recovery draft until you save.", "hint"));
      return;
    }
    panel.replaceChildren(el("h3", "Local recovery draft"));
    const matches = snapshot.expectedRecordRevision === revision &&
      (record.kind === "article" || snapshot.expectedSourceRevision === sourceRevision);
    panel.append(el("p", `Kept ${snapshot.capturedAt ? formatTime(snapshot.capturedAt) : "locally"}. ${matches ? "Its base revision matches the current record." : "Its base revision is stale; review both versions and copy changes manually."}`, matches ? "hint" : "check-warning"));
    if (!authorized) panel.append(el("p", "This saved draft is protected. Load it or discard it before the CMS can autosave newer edits for this record.", "hint"));
    const current = el("details", "");
    current.append(el("summary", "Current canonical source"), el("pre", JSON.stringify(record.kind === "article" ? { body: record.body, updatedAt: record.metadata.updatedAt } : record.value, null, 2)));
    const recovered = el("details", "");
    recovered.append(el("summary", "Recovered source"), el("pre", JSON.stringify(snapshot.content, null, 2)));
    panel.append(current, recovered);
    const actions = document.createElement("div");
    actions.className = "recovery-actions";
    const load = el("button", "Load draft into editor");
    load.type = "button";
    load.disabled = !matches || !canLoad;
    load.addEventListener("click", () => {
      if (!matches) return;
      authorized = true;
      loadDraft(snapshot.content);
      hasUnsavedChanges = true;
    });
    const discard = el("button", "Discard recovery draft");
    discard.type = "button";
    discard.addEventListener("click", async () => {
      if (!window.confirm("Permanently discard this local recovery draft?")) return;
      clearTimeout(timer);
      cleared = true;
      version += 1;
      try {
        await chain;
        const response = await mutate(route, "DELETE", { draftRevision: snapshot.draftRevision });
        if (response.deleted) {
          snapshot = null;
          authorized = true;
          cleared = false;
          render();
          refreshRecoveryList();
          refreshActivity();
          if (pendingWrite) queueWrite();
        } else {
          snapshot = await json(route);
          cleared = false;
          render();
          panel.append(el("p", "The recovery draft changed elsewhere and was not discarded. Review the current saved version.", "check-warning"));
        }
      } catch (error) {
        cleared = false;
        panel.append(el("p", error.message, "error"));
      }
    });
    actions.append(load, discard);
    panel.append(actions);
  }
  function queueWrite() {
    if (cleared) return;
    if (!loaded || !authorized) { pendingWrite = true; return; }
    pendingWrite = false;
    const ownVersion = ++version;
    const payload = snapshotRecord();
    clearTimeout(timer);
    timer = setTimeout(() => {
      chain = chain.then(async () => {
        if (cleared || ownVersion !== version) return;
        const saved = await mutate(route, "PUT", { ...payload, ...(snapshot ? { previousDraftRevision: snapshot.draftRevision } : {}) });
        snapshot = saved;
        persistedVersion = ownVersion;
        savedListener(saved);
        if (!cleared) {
          render();
          refreshRecoveryList();
          refreshActivity();
        }
      }).catch((error) => {
        panel.querySelector(".recovery-error")?.remove();
        panel.append(el("p", `Could not save recovery draft: ${error.message}`, "error recovery-error"));
      });
    }, 500);
  }
  async function flush() {
    clearTimeout(timer);
    if (!loaded) throw new Error("Recovery state is unavailable. Reload this record before saving.");
    if (!authorized) throw new Error("A recovery draft is already saved for this record. Load or discard it before saving newer edits.");
    if (!cleared && loaded && authorized && version !== persistedVersion) {
      const ownVersion = version;
      const payload = snapshotRecord();
      chain = chain.then(async () => {
        if (cleared || ownVersion !== version) return;
        snapshot = await mutate(route, "PUT", { ...payload, ...(snapshot ? { previousDraftRevision: snapshot.draftRevision } : {}) });
        persistedVersion = ownVersion;
        render();
        refreshRecoveryList();
        refreshActivity();
      });
    }
    await chain;
    return snapshot;
  }
  async function clearAfterSave(savedVersion) {
    if (!authorized || version === 0 || version !== savedVersion || persistedVersion !== savedVersion || !snapshot) return;
    clearTimeout(timer);
    cleared = true;
    version += 1;
    await chain;
    try {
      const response = await mutate(route, "DELETE", { draftRevision: snapshot.draftRevision });
      if (response.deleted) {
        snapshot = null;
        render();
        refreshRecoveryList();
        refreshActivity();
      } else {
        snapshot = await json(route);
        cleared = false;
        render();
        panel.append(el("p", "The canonical save succeeded, but a newer recovery draft was preserved.", "check-warning"));
      }
    } catch (error) {
      cleared = false;
      panel.append(el("p", `The canonical save succeeded, but the recovery draft remains: ${error.message}`, "check-warning"));
    }
  }
  json(route).then((existing) => {
    snapshot = existing;
    loaded = true;
    authorized = !existing;
    render();
    if (!existing && pendingWrite) queueWrite();
  }).catch((error) => panel.replaceChildren(el("h3", "Local recovery draft"), el("p", error.message, "error")));
  return {
    element: panel,
    schedule: queueWrite,
    flush,
    version: () => version,
    clearAfterSave,
    setCurrentContent: (getContent) => { currentContent = getContent; },
    onSaved: (listener) => { savedListener = listener; },
    dispose: () => { clearTimeout(timer); cleared = true; version += 1; },
  };
}

async function refreshRecoveryList() {
  const container = document.querySelector("#recovery-drafts");
  if (!container) return;
  try {
    const snapshots = await json("/api/recovery/drafts");
    recoveryDraftCount = snapshots.length;
    renderOverview();
    if (!snapshots.length) { container.replaceChildren(el("p", "No recovery drafts.")); return; }
    const list = document.createElement("ul");
    for (const snapshot of snapshots) {
      const item = document.createElement("li");
      const known = articles.find((record) => record.kind === snapshot.kind && record.id === snapshot.id);
      const button = el("button", `${kindLabel(snapshot.kind)}: ${known?.title || snapshot.id} · kept ${snapshot.capturedAt ? formatTime(snapshot.capturedAt) : "locally"}`, "link-button");
      button.type = "button";
      button.addEventListener("click", () => selectRecord(snapshot.kind, snapshot.id));
      item.append(button);
      list.append(item);
    }
    container.replaceChildren(list);
  } catch (error) { container.replaceChildren(el("p", error.message, "error")); }
}

const activityActions = {
  session: "CMS session", draft: "Recovery draft kept", "article-body": "Article body saved", "article-status": "Article status changed",
  "article-review": "Approval recorded", "record-content": "Content saved", "record-status": "Status changed",
  "record-review": "Approval recorded", "local-guidance-content": "Municipality guidance saved", "record-create": "Record created",
  "check-start": "Check started", "check-finish": "Check finished", "check-cancel": "Check canceled",
};

function activitySentence(event) {
  const check = event.checkId ? checkReport?.definitions.find((item) => item.id === event.checkId)?.label || event.checkId : "";
  if (event.kind === "session") return event.outcome === "started" ? "CMS session started" : `CMS session ${event.outcome}`;
  if (event.kind === "check-finish") return `${check} ${({ succeeded: "passed", warning: "finished with review findings", failed: "failed", canceled: "was canceled" })[event.outcome] || event.outcome}`;
  if (event.kind === "check-start") return `${check} started`;
  if (event.kind === "check-cancel") return `${check} canceled`;
  const action = activityActions[event.kind] || event.kind;
  const outcome = ({ succeeded: "", failed: " (failed)", conflict: " (conflict: the file changed; reload it)", canceled: " (canceled)", warning: " (with warnings)", started: " (started)" })[event.outcome] ?? ` (${event.outcome})`;
  return `${action}${outcome}`;
}

async function refreshActivity() {
  const container = document.querySelector("#activity-events");
  if (!container) return;
  try {
    const { events } = await json("/api/activity");
    if (!events.length) { container.replaceChildren(el("p", "No activity recorded yet. Saves, approvals, checks, and recovery drafts appear here.", "hint")); return; }
    const days = new Map();
    let previous = null;
    for (const event of events.slice().reverse().slice(0, 150)) {
      const when = new Date(event.occurredAt || event.at);
      const day = Number.isNaN(when.getTime()) ? "Unknown date" : when.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
      if (!days.has(day)) { days.set(day, document.createElement("ol")); previous = null; }
      const sentence = activitySentence(event);
      // Repeated identical events (autosaved drafts, restarts) collapse into one line with a count.
      if (previous && previous.sentence === sentence && previous.recordId === event.recordId) {
        previous.count += 1;
        previous.counter.textContent = ` ×${previous.count}`;
        continue;
      }
      const item = document.createElement("li");
      const time = document.createElement("time");
      time.dateTime = event.occurredAt || event.at;
      time.textContent = Number.isNaN(when.getTime()) ? "" : when.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
      item.append(time, document.createTextNode(` ${sentence}`));
      if (event.recordKind && event.recordId) {
        const known = articles.find((record) => record.kind === event.recordKind && record.id === event.recordId);
        const open = el("button", known?.title || event.recordId, "link-button");
        open.type = "button";
        open.addEventListener("click", () => selectRecord(event.recordKind, event.recordId));
        item.append(document.createTextNode(": "), open);
      }
      const counter = el("span", "", "activity-count");
      item.append(counter);
      days.get(day).append(item);
      previous = { sentence, recordId: event.recordId, count: 1, counter };
    }
    container.replaceChildren(...[...days].flatMap(([day, list]) => [el("h3", day), list]));
  } catch (error) { container.replaceChildren(el("p", error.message, "error")); }
}

// Long lists render a page at a time so the workspace stays responsive; counts always cover every match.
const listPageSize = 200;
let contentListLimit = listPageSize;
let referenceListLimit = listPageSize;

function showMoreItem(remaining, onClick) {
  const item = document.createElement("li");
  item.className = "show-more";
  const button = el("button", `Show ${Math.min(remaining, listPageSize)} more (${remaining} not shown)`);
  button.type = "button";
  button.addEventListener("click", onClick);
  item.append(button);
  return item;
}

function formatTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value || "Unknown time");
  return date.toLocaleString(undefined, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function plural(count, one, many) {
  return `${count} ${count === 1 ? one : many}`;
}

// Today's times as "07:17"; other days with the date.
function shortTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value || "");
  const sameDay = date.toDateString() === new Date().toDateString();
  return sameDay ? date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
    : date.toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function setNavCount(name, count, meaning) {
  const badge = document.querySelector(`[data-count="${name}"]`);
  if (!badge) return;
  badge.replaceChildren(...(count ? [document.createTextNode(String(count)), el("span", ` ${meaning}`, "visually-hidden")] : []));
  badge.title = count ? `${count} ${meaning}` : "";
  badge.hidden = !count;
}

// The editorial-review queue, oldest review first, opened at its first record.
function startReviewQueue() {
  setContentFilters({ status: "needs-review", order: "oldest-review" });
  const first = currentMatches[0];
  if (!first) return false;
  selectRecord(first.kind, first.id);
  return true;
}

// Overview counts are shortcuts to the list or page they count.
function summaryLink(text, page, action) {
  const link = el("a", text, "summary-link");
  link.href = `#/${page}`;
  link.addEventListener("click", (event) => {
    event.preventDefault();
    action?.();
    setRoute(page);
    showPage(page, { focus: page !== "overview" });
  });
  return link;
}

function setContentFilters({ kind = "", status = "", group = "", order = "" }) {
  kindFilter.value = kind; statusFilter.value = status; search.value = "";
  renderGroupFilter();
  groupFilter.value = group;
  if (sortOrder) sortOrder.value = order;
  resetContentList();
}

function attentionItem(text, page, action) {
  const item = document.createElement("li");
  const link = el("a", text);
  link.href = `#/${page}`;
  link.addEventListener("click", (event) => {
    event.preventDefault();
    if (action?.() === "handled") return;
    setRoute(page);
    showPage(page, { focus: true });
  });
  item.append(link);
  return item;
}

// The overview answers "what needs attention" from the current checkout; each item opens the page that resolves it.
function renderOverview() {
  const attention = document.querySelector("#attention");
  if (!attention) return;
  const items = [];
  const needsReview = articles.filter((item) => item.status === "needs-review").length;
  const drafts = articles.filter((item) => item.status === "draft").length;
  if (needsReview) {
    items.push(attentionItem(`Start reviewing: ${needsReview} ${needsReview === 1 ? "record is" : "records are"} in editorial review, oldest review first`, "content",
      () => (startReviewQueue() ? "handled" : undefined)));
  }
  if (drafts) items.push(attentionItem(`${drafts} ${drafts === 1 ? "record is a draft" : "records are drafts"}`, "content", () => setContentFilters({ status: "draft" })));
  const stale = lastHandoff ? lastHandoff.items.filter((item) => item.state === "stale").length : 0;
  const missing = lastHandoff ? lastHandoff.items.filter((item) => item.state === "missing").length : 0;
  if (stale || missing) items.push(attentionItem(`${stale} stale and ${missing} missing Japanese artifacts`, "translations"));
  if (catalogFailureCount) items.push(attentionItem(`${plural(catalogFailureCount, "file", "files")} could not be read (listed below)`, "overview"));
  const git = lastGitReport;
  // Data modules are loaded when the CMS starts; an outside change to one needs a restart, not just Refresh.
  const moduleChanges = git ? git.otherChanges.filter((path) => /^src\/.+\.tsx?$/.test(path)) : [];
  if (moduleChanges.length) items.push(attentionItem(`${plural(moduleChanges.length, "data module", "data modules")} changed outside the CMS after it started. Restart the CMS to load ${moduleChanges.length === 1 ? "it" : "them"}`, "changes"));
  if (git) {
    if (git.currentBranch !== git.identity.branch || git.currentCommit !== git.identity.startCommit) {
      items.push(attentionItem("The branch or commit changed after the CMS started. Restart it before saving", "changes"));
    }
    if (git.cmsChanges.length) items.push(attentionItem(`${plural(git.cmsChanges.length, "file", "files")} changed by this CMS session; review the ${git.cmsChanges.length === 1 ? "diff" : "diffs"} before committing`, "changes"));
    if (git.identity.dirtyAtStart.length) items.push(attentionItem(`${plural(git.identity.dirtyAtStart.length, "file", "files")} already had uncommitted changes; the CMS will not write ${git.identity.dirtyAtStart.length === 1 ? "it" : "them"}`, "changes"));
    if (git.otherChanges.length) items.push(attentionItem(`${plural(git.otherChanges.length, "file", "files")} changed outside the CMS during this session`, "changes"));
  }
  if (recoveryDraftCount) items.push(attentionItem(`${recoveryDraftCount} unsaved recovery ${recoveryDraftCount === 1 ? "draft" : "drafts"}: open one to load or discard it`, "changes"));
  attention.replaceChildren(...(items.length ? items : [el("li", "Nothing needs attention in the loaded catalogs.")]));
  setNavCount("content", needsReview, "in editorial review");
  setNavCount("translations", stale + missing, "stale or missing");
  setNavCount("changes", git ? git.cmsChanges.length : 0, "changed by this session");
  const freshness = document.querySelector("#data-freshness");
  if (freshness) {
    const started = git ? shortTime(git.identity.startedAt) : null;
    freshness.classList.toggle("restart-needed", moduleChanges.length > 0);
    freshness.textContent = moduleChanges.length
      ? `Restart needed: ${plural(moduleChanges.length, "data module", "data modules")} changed after ${started}`
      : [started ? `Started ${started}` : "", dataRefreshedAt ? `refreshed ${shortTime(dataRefreshedAt)}` : ""].filter(Boolean).join(" · ") || "Loading…";
    freshness.title = "Refresh rereads canonical files. Restart the CMS after changes made outside it to TypeScript data modules or translation registries.";
  }
}

// Why a record matches the search: "" for a title match, a short explanation otherwise, or null for no match.
function matchReason(record, query) {
  if (record.title.toLocaleLowerCase().includes(query)) return "";
  if (record.id.toLocaleLowerCase().includes(query)) return `Matched ID: ${record.id}`;
  const group = (record.groups || []).find((item) => item.replaceAll("-", " ").toLocaleLowerCase().includes(query) || item.includes(query));
  if (group) return `Matched category or topic: ${group.replaceAll("-", " ")}`;
  return null;
}

function renderList() {
  const query = search.value.trim().toLocaleLowerCase();
  const selectedStatus = statusFilter.value;
  const selectedKindFilter = kindFilter.value;
  const selectedGroup = groupFilter.value;
  const matches = articles.filter((article) =>
    (!selectedKindFilter || article.kind === selectedKindFilter) &&
    (!selectedGroup || (article.groups || []).some((group) => `${article.kind}:${group}` === selectedGroup)) &&
    (!selectedStatus || article.status === selectedStatus) &&
    (!query || matchReason(article, query) !== null));
  if (listComparators[sortOrder?.value]) matches.sort(listComparators[sortOrder.value]);
  currentMatches = matches;
  list.replaceChildren();
  resultCount.textContent = `${matches.length} of ${articles.length} records`;
  const selectedIndex = matches.findIndex((article) => article.id === selectedId && article.kind === selectedKind);
  const shown = matches.slice(0, Math.max(contentListLimit, selectedIndex + 1));
  for (const article of shown) {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("aria-current", String(article.id === selectedId && article.kind === selectedKind));
    const meta = el("small", "", "row-meta");
    meta.append(el("span", statusLabel(article.status), `chip status-${article.status}`),
      document.createTextNode([kindLabel(article.kind), article.translation ? `Japanese ${article.translation}` : "",
        article.lastReviewedAt ? `reviewed ${formatDate(article.lastReviewedAt)}` : ""].filter(Boolean).join(" · ")));
    button.append(el("strong", article.title), meta);
    const reason = query ? matchReason(article, query) : "";
    if (reason) button.append(el("small", reason, "match-reason"));
    button.addEventListener("click", () => selectRecord(article.kind, article.id));
    item.append(button);
    list.append(item);
  }
  if (matches.length > shown.length) list.append(showMoreItem(matches.length - shown.length, () => { contentListLimit += listPageSize; renderList(); }));
}

const importanceRank = { critical: 0, important: 1, recommended: 2, informational: 3 };
const byTitle = (a, b) => a.title.localeCompare(b.title, "en");
// Records without a date sort first in date orders: a record never reviewed is the oldest review of all.
const byDate = (key) => (a, b) => (a[key] || "").localeCompare(b[key] || "") || byTitle(a, b);
const listComparators = {
  title: byTitle,
  "oldest-review": byDate("lastReviewedAt"),
  "oldest-update": byDate("updatedAt"),
  importance: (a, b) => (importanceRank[a.importance] ?? 4) - (importanceRank[b.importance] ?? 4) || byTitle(a, b),
};

// Dates in the data are ISO days (2026-10-17); the interface shows them as "17 Oct 2026".
function formatDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || "");
  if (!match) return value ? formatTime(value) : "not recorded";
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
}

function renderGroupFilter() {
  const previous = groupFilter.value;
  const options = new Map();
  for (const record of articles) {
    if (kindFilter.value && record.kind !== kindFilter.value) continue;
    for (const group of record.groups || []) {
      const key = `${record.kind}:${group}`;
      const name = group.replaceAll("-", " ");
      options.set(key, kindFilter.value ? name : `${record.kind.replaceAll("-", " ")} · ${name}`);
    }
  }
  const all = document.createElement("option");
  all.value = "";
  all.textContent = "All categories and topics";
  groupFilter.replaceChildren(all);
  for (const [value, label] of [...options].sort((a, b) => a[1].localeCompare(b[1], "en"))) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    groupFilter.append(option);
  }
  groupFilter.value = options.has(previous) ? previous : "";
}

function field(dl, name, value) {
  dl.append(el("dt", name), el("dd", value));
}

function referenceKindLabel(kind) {
  return ({ source: "Official source", journey: "Guided journey", "article-group": "Article group", "annotated-document": "Annotated document" })[kind] || kind.replaceAll("-", " ");
}

function renderReferenceList() {
  if (!referenceList) return;
  const query = referenceSearch.value.trim().toLocaleLowerCase();
  const kind = referenceKind.value;
  const matches = referenceRecords.filter((record) => (!kind || record.kind === kind) &&
    (!query || `${record.title} ${record.id}`.toLocaleLowerCase().includes(query)));
  referenceCount.textContent = `${matches.length} of ${referenceRecords.length} reference records`;
  referenceList.replaceChildren();
  const selectedIndex = matches.findIndex((record) => selectedReference?.kind === record.kind && selectedReference?.id === record.id);
  const shown = matches.slice(0, Math.max(referenceListLimit, selectedIndex + 1));
  for (const record of shown) {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("aria-current", String(selectedReference?.kind === record.kind && selectedReference?.id === record.id));
    button.append(el("strong", record.title), el("small", `${referenceKindLabel(record.kind)} · ${record.id}`));
    button.addEventListener("click", () => selectReference(record.kind, record.id));
    item.append(button);
    referenceList.append(item);
  }
  if (matches.length > shown.length) referenceList.append(showMoreItem(matches.length - shown.length, () => { referenceListLimit += listPageSize; renderReferenceList(); }));
}

function referenceLinkButton(articleId, title = articleId) {
  const knownArticle = articles.find((item) => item.kind === "article" && item.id === articleId);
  const label = knownArticle?.title || title;
  const button = el("button", knownArticle ? `Open article: ${label} (${articleId})` : `Article not in CMS catalog: ${articleId}`);
  button.type = "button";
  button.className = "reference-article-link";
  button.disabled = !knownArticle;
  if (!knownArticle) button.title = "This referenced article is not available in the editable article catalog.";
  if (!knownArticle) return button;
  button.addEventListener("click", async () => {
    await selectRecord("article", articleId);
    document.querySelector(".workspace")?.scrollIntoView?.({ behavior: "smooth", block: "start" });
    document.querySelector("#detail-heading")?.focus?.();
  });
  return button;
}

function referenceArticleList(articleIds) {
  const list = document.createElement("ul");
  list.className = "reference-article-list";
  for (const id of articleIds || []) {
    const item = document.createElement("li");
    item.append(referenceLinkButton(id));
    list.append(item);
  }
  return list;
}

function referenceFacts(value, entries) {
  const dl = document.createElement("dl");
  for (const [label, item] of entries) {
    if (item !== undefined && item !== null && item !== "") field(dl, label, Array.isArray(item) ? item.join(", ") : String(item));
  }
  return dl;
}

function appendSourceReferenceDetails(container, record, value) {
  container.append(referenceFacts(value, [
    ["Organization", value.organization],
    ["Authority level", value.authorityLevel],
    ["Language", value.language],
    ["Last checked", value.lastCheckedAt],
    ["Last substantively reviewed", value.lastReviewedAt],
    ["Check method", value.checkMethod],
  ]));
  const link = document.createElement("a");
  link.href = value.url;
  link.textContent = value.url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  const links = document.createElement("p");
  links.append(el("strong", "Official link: "), link);
  container.append(links);
  if (record.dependents?.length) {
    container.append(el("h4", "Content using this source"));
    const ul = document.createElement("ul");
    for (const dependent of record.dependents) {
      const li = document.createElement("li");
      li.textContent = `${dependent.kind}: ${dependent.id}`;
      ul.append(li);
    }
    container.append(ul);
  }
}

function appendGroupDetails(container, value) {
  container.append(el("p", value.description || ""));
  container.append(el("h4", "Member articles"), referenceArticleList(value.articleIds));
}

function appendJourneyDetails(container, value) {
  container.append(el("p", value.description || ""));
  if (value.introduction) container.append(el("p", value.introduction));
  if (value.routes?.length) {
    container.append(el("h4", "Routes"));
    const routes = document.createElement("ul");
    for (const route of value.routes) {
      const item = document.createElement("li");
      item.append(el("strong", route.title), el("p", route.description || ""), referenceLinkButton(route.articleId));
      routes.append(item);
    }
    container.append(routes);
  }
  container.append(el("h4", "Phases and steps"));
  for (const phase of value.phases || []) {
    const section = document.createElement("section");
    section.className = "reference-nested";
    section.append(el("h5", phase.title));
    if (phase.description) section.append(el("p", phase.description));
    const steps = document.createElement("ol");
    for (const step of phase.steps || []) {
      const item = document.createElement("li");
      if (step.type === "article") {
        item.append(referenceLinkButton(step.articleId));
        const qualifiers = [step.requiredness, step.conditionLabel, step.routeIds?.length ? `Routes: ${step.routeIds.join(", ")}` : ""].filter(Boolean);
        if (qualifiers.length) item.append(el("span", ` · ${qualifiers.join(" · ")}`, "hint"));
      } else item.textContent = "Choose a route";
      steps.append(item);
    }
    section.append(steps);
    container.append(section);
  }
}

function appendDocumentVersion(container, version) {
  const section = document.createElement("section");
  section.className = "reference-nested document-version";
  section.append(el("h5", `${version.label} (${version.id})`));
  section.append(referenceFacts(version, [
    ["Lifecycle", version.lifecycle], ["Review status", version.reviewStatus],
    ["Valid from", version.validFrom], ["Valid through", version.validThrough], ["Last checked", version.lastCheckedAt],
    ["Official source IDs", version.sourceIds], ["Notice", version.notice],
  ]));
  if (version.officialVisuals?.length) {
    section.append(el("h6", "Official visuals"));
    for (const visual of version.officialVisuals) {
      const visualDetails = document.createElement("div");
      visualDetails.className = "reference-visual";
      visualDetails.append(el("strong", visual.id), el("p", visual.caption || visual.alt || ""),
        referenceFacts(visual, [["Alt text", visual.alt], ["Presentation", visual.presentation], ["Image source ID", visual.sourceId], ["Rights source ID", visual.rightsSourceId], ["Modification note", visual.modificationNote]]));
      const visualLink = document.createElement("a");
      visualLink.href = visual.assetUrl;
      visualLink.textContent = "Open official visual";
      visualLink.target = "_blank";
      visualLink.rel = "noopener noreferrer";
      visualDetails.append(visualLink);
      section.append(visualDetails);
    }
  }
  for (const documentSection of version.sections || []) {
    const content = document.createElement("section");
    content.className = "reference-document-section";
    content.append(el("h6", documentSection.label));
    for (const item of documentSection.fields || []) {
      const fieldBlock = document.createElement("article");
      fieldBlock.append(el("h6", `${item.number}. ${item.label} (${item.japaneseLabel})`), referenceFacts(item, [
        ["Example", item.exampleValue], ["Explanation", item.explanation], ["Caution", item.caution],
      ]));
      content.append(fieldBlock);
    }
    section.append(content);
  }
  container.append(section);
}

function appendDocumentDetails(container, value) {
  container.append(referenceFacts(value, [
    ["Japanese name", value.japaneseName], ["Issuer", value.issuer], ["Jurisdiction", value.jurisdiction],
    ["Description", value.description], ["Related glossary terms", value.glossaryTermIds],
  ]));
  container.append(referenceLinkButton(value.articleId));
  if (value.jurisdictionVariants?.length) {
    container.append(el("h4", "Jurisdiction variants"));
    for (const variant of value.jurisdictionVariants) {
      const section = document.createElement("section");
      section.className = "reference-nested";
      section.append(el("h5", `${variant.label} (${variant.id})`), referenceFacts(variant, [["Geography ID", variant.geographyId], ["Issuer", variant.issuer], ["Jurisdiction", variant.jurisdiction]]));
      for (const version of variant.versions || []) appendDocumentVersion(section, version);
      container.append(section);
    }
  }
  if (value.versions?.length) {
    container.append(el("h4", "Versions"));
    for (const version of value.versions) appendDocumentVersion(container, version);
  }
}

function renderReferenceDetail(record) {
  const value = record.value || {};
  const heading = el("h4", record.title);
  const badge = el("span", "Inspect only · editing is not supported here", "badge reference-readonly");
  const registry = document.createElement("p");
  registry.append(el("strong", "Registration point: "), el("code", record.registryPath));
  const body = document.createElement("div");
  body.className = "reference-record-body";
  if (record.kind === "source") appendSourceReferenceDetails(body, record, value);
  else if (record.kind === "article-group") appendGroupDetails(body, value);
  else if (record.kind === "journey") appendJourneyDetails(body, value);
  else if (record.kind === "annotated-document") appendDocumentDetails(body, value);
  const raw = document.createElement("details");
  raw.className = "reference-raw-data";
  raw.append(el("summary", "Full registered record data (JSON)"), el("pre", JSON.stringify(value, null, 2)));
  body.append(raw);
  referenceDetail.replaceChildren(heading, badge, registry, body);
}

async function selectReference(kind, id, options = {}) {
  selectedReference = { kind, id };
  if (!options.keepPage) showPage("sources");
  renderReferenceList();
  referenceDetail.replaceChildren(el("p", "Loading reference record…"));
  try {
    const record = await json(`/api/reference/${encodeURIComponent(kind)}/${encodeURIComponent(id)}`);
    if (selectedReference?.kind !== kind || selectedReference?.id !== id) return;
    renderReferenceDetail(record);
  } catch (error) {
    referenceDetail.replaceChildren(el("p", error.message, "error"));
  }
}

async function refreshReferences() {
  if (!referenceList) return;
  try {
    const result = await json("/api/reference");
    referenceRecords = result.records || [];
    renderReferenceList();
    if (selectedReference) await selectReference(selectedReference.kind, selectedReference.id, { keepPage: true });
  } catch (error) {
    referenceRecords = [];
    renderReferenceList();
    referenceDetail.replaceChildren(el("p", `Reference catalogs could not be loaded: ${error.message}`, "error"));
  }
}

function selectedLocalGuidanceLocation() {
  return localGuidanceLocations.find((location) => location.id === localGuidanceLocation?.value);
}

function localGuidanceTranslationLabel(state) {
  return ({ current: "Japanese artifact current", stale: "Japanese artifact stale", missing: "Japanese artifact missing" })[state] || `Japanese artifact state: ${state || "unknown"}`;
}

function localGuidanceGeneratorLabel(generator) {
  return ({
    "codex-drafted": "Codex drafted; awaiting Claude check",
    "codex-drafted-claude-reviewed": "Codex drafted; Claude checked",
    "claude-code-claude-reviewed": "Claude generated; Claude checked",
  })[generator] || (generator ? `Generator provenance: ${generator}` : "Generator provenance unavailable");
}

function renderLocalGuidanceList() {
  if (!localGuidanceList) return;
  const location = selectedLocalGuidanceLocation();
  const query = localGuidanceSearch.value.trim().toLocaleLowerCase();
  const supplements = (location?.supplements || []).filter((supplement) =>
    !query || `${supplement.title} ${supplement.id} ${supplement.articleId}`.toLocaleLowerCase().includes(query));
  localGuidanceCount.textContent = location
    ? `${supplements.length} of ${location.supplements.length} guides${localGuidanceFailures.length ? ` · ${localGuidanceFailures.length} catalog issues` : ""}`
    : `Select a location${localGuidanceFailures.length ? ` · ${localGuidanceFailures.length} catalog issues` : ""}`;
  localGuidanceList.replaceChildren();
  for (const supplement of supplements) {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("aria-current", String(selectedLocalGuidanceId === supplement.id));
    const meta = el("small", "", "row-meta");
    const state = supplement.translation || "missing";
    meta.append(el("span", `Japanese ${state}`, `chip translation-${state}`),
      document.createTextNode(supplement.generator === "codex-drafted" ? "Codex draft awaiting a check" : ""));
    button.append(el("strong", supplement.title), meta);
    button.addEventListener("click", () => selectLocalGuidance(supplement.id));
    item.append(button);
    localGuidanceList.append(item);
  }
  if (location && supplements.length === 0) localGuidanceList.append(el("li", "No guides match this filter."));
}

function localGuidanceGuideIdentity(guide) {
  const value = typeof guide === "string" ? { id: guide } : guide || {};
  return { id: value.id || value.articleId || "unknown-guide", articleId: value.articleId || value.id || "unknown-guide" };
}

function openLocalGuidanceMatrixCell(location, supplement) {
  if (localGuidanceUnsaved && !window.confirm("Discard unsaved municipality guidance changes?")) return;
  localGuidanceUnsaved = false;
  // The chosen guide opens below; folding the matrix brings it into view.
  document.querySelector(".local-guidance-matrix-disclosure")?.removeAttribute("open");
  localGuidanceLocation.value = location.id;
  localGuidanceLocation.dispatchEvent(new Event("change", { bubbles: true }));
  selectLocalGuidance(supplement.id);
  document.querySelector("#local-guidance-detail-heading")?.focus?.();
}

// A supplement needs attention when its Japanese is not current or a Codex draft still awaits Claude's check.
function localGuidanceNeedsAttention(supplement) {
  return (supplement.translation || "missing") !== "current" || supplement.generator === "codex-drafted";
}

function renderLocalGuidanceMatrix(guides) {
  if (!localGuidanceMatrix) return;
  const issuesOnly = document.querySelector("#local-guidance-issues-only")?.checked;
  const all = localGuidanceLocations.flatMap((location) => location.supplements);
  const counts = { current: 0, stale: 0, missing: 0 };
  for (const supplement of all) counts[supplement.translation || "missing"] = (counts[supplement.translation || "missing"] || 0) + 1;
  const drafts = all.filter((supplement) => supplement.generator === "codex-drafted").length;
  const summaryLine = document.querySelector("#local-guidance-matrix-summary");
  if (summaryLine) summaryLine.textContent = `${all.length} ${all.length === 1 ? "supplement" : "supplements"} in ${localGuidanceLocations.length} ${localGuidanceLocations.length === 1 ? "location" : "locations"}: ${counts.current} current, ${counts.stale} stale, ${counts.missing} missing Japanese; ${drafts} Codex ${drafts === 1 ? "draft" : "drafts"} awaiting a check.`;
  const table = document.createElement("table");
  table.className = "local-guidance-matrix-table";
  const caption = document.createElement("caption");
  caption.textContent = "Municipality local-guidance supplements by location and article guide";
  table.append(caption);
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  const locationHead = el("th", "Location");
  locationHead.scope = "col";
  headerRow.append(locationHead);
  const guideRefs = (guides || []).map(localGuidanceGuideIdentity);
  for (const guide of guideRefs) {
    const header = document.createElement("th");
    header.scope = "col";
    const article = articles.find((record) => record.kind === "article" && record.id === guide.articleId);
    header.textContent = article?.title || guide.id;
    header.title = guide.id;
    headerRow.append(header);
  }
  thead.append(headerRow);
  table.append(thead);
  const tbody = document.createElement("tbody");
  const shownLocations = issuesOnly ? localGuidanceLocations.filter((location) => location.supplements.some(localGuidanceNeedsAttention)) : localGuidanceLocations;
  for (const location of shownLocations) {
    const row = document.createElement("tr");
    const rowHeader = el("th", location.name);
    rowHeader.scope = "row";
    row.append(rowHeader);
    for (const guide of guideRefs) {
      const cell = document.createElement("td");
      const supplement = location.supplements.find((entry) => entry.articleId === guide.articleId || entry.id === guide.id);
      if (!supplement) {
        cell.append(el("span", "—", "matrix-unavailable"));
        cell.setAttribute("aria-label", "No municipality supplement");
      } else {
        const state = supplement.translation || "missing";
        const draft = supplement.generator === "codex-drafted";
        const button = el("button", `${({ current: "Current", stale: "Stale", missing: "Missing" })[state] || state}${draft ? " · Codex draft" : ""}`);
        button.type = "button";
        button.className = `local-guidance-matrix-cell matrix-${state}${draft ? " matrix-draft" : ""}`;
        button.tabIndex = -1;
        const article = articles.find((record) => record.kind === "article" && record.id === guide.articleId);
        const guideTitle = article?.title || guide.id;
        button.setAttribute("aria-label", `Open ${location.name} supplement for ${guideTitle}; Japanese artifact ${state}${draft ? "; Codex draft awaiting Claude check" : ""}`);
        button.addEventListener("click", () => openLocalGuidanceMatrixCell(location, supplement));
        cell.append(button);
      }
      row.append(cell);
    }
    tbody.append(row);
  }
  table.append(tbody);
  // One cell is in the tab order; arrow keys, Home, and End move between cells (a roving tab stop).
  const cells = [...tbody.querySelectorAll(".local-guidance-matrix-cell")];
  if (cells[0]) cells[0].tabIndex = 0;
  tbody.addEventListener("keydown", (event) => {
    const current = event.target.closest?.(".local-guidance-matrix-cell");
    if (!current) return;
    const cell = current.closest("td");
    const row = cell.parentElement;
    const rows = [...tbody.rows];
    const column = [...row.cells].indexOf(cell);
    const rowIndex = rows.indexOf(row);
    const buttonAt = (r, c) => rows[r]?.cells[c]?.querySelector(".local-guidance-matrix-cell");
    const scan = (r, c, dr, dc) => { for (let i = r + dr, j = c + dc; rows[i] && rows[i].cells[j]; i += dr, j += dc) { const found = buttonAt(i, j); if (found) return found; } return null; };
    const target = event.key === "ArrowRight" ? scan(rowIndex, column, 0, 1) : event.key === "ArrowLeft" ? scan(rowIndex, column, 0, -1)
      : event.key === "ArrowDown" ? scan(rowIndex, column, 1, 0) : event.key === "ArrowUp" ? scan(rowIndex, column, -1, 0)
        : event.key === "Home" ? row.querySelector(".local-guidance-matrix-cell") : event.key === "End" ? [...row.querySelectorAll(".local-guidance-matrix-cell")].pop() : null;
    if (!target) return;
    event.preventDefault();
    for (const button of cells) button.tabIndex = -1;
    target.tabIndex = 0;
    target.focus();
  });
  if (issuesOnly && !shownLocations.length) {
    localGuidanceMatrix.replaceChildren(el("p", "Every location's guides have current Japanese and no unchecked Codex drafts.", "success"));
    return;
  }
  if (!localGuidanceLocations.length || !guideRefs.length) {
    localGuidanceMatrix.replaceChildren(table, el("p", "No location and guide coverage is currently registered.", "hint"));
  } else localGuidanceMatrix.replaceChildren(table);
}

function localGuidanceRelatedInfo(record) {
  const container = document.createElement("div");
  container.className = "local-guidance-related-info";
  const sourceIds = new Set(record.value.sourceIds || []);
  container.append(el("h4", "Official sources"));
  const sourceList = document.createElement("ul");
  sourceList.className = "local-guidance-related";
  for (const source of record.sources || []) {
    if (!sourceIds.has(source.id)) continue;
    const item = document.createElement("li");
    item.append(el("strong", `${source.title} (${source.id})`));
    const metadata = [source.language, source.lastCheckedAt ? `last checked ${source.lastCheckedAt}` : "", source.lastReviewedAt ? `reviewed ${source.lastReviewedAt}` : ""].filter(Boolean).join(" · ");
    if (metadata) item.append(el("div", metadata, "hint"));
    if (source.url && /^https?:\/\//i.test(source.url)) {
      const link = document.createElement("a");
      link.href = source.url; link.textContent = "Open official source"; link.target = "_blank"; link.rel = "noopener noreferrer";
      item.append(link);
    }
    sourceList.append(item);
  }
  if (!sourceList.children.length) sourceList.append(el("li", "No registered source details were returned."));
  container.append(sourceList);
  container.append(el("h4", "Recheck items"));
  const recheckList = document.createElement("ul");
  recheckList.className = "local-guidance-related";
  const items = (record.recheck || []).filter((item) => !item.records?.length || item.records.includes(record.id));
  for (const item of items) {
    const li = document.createElement("li");
    const label = item.kind === "dated" ? `${item.from}: ${item.change} — ${item.action}`
      : item.kind === "tax-year" ? `Tax-year recheck: ${item.statement}`
        : item.kind === "old-source" ? `Recheck old source (${item.date}): ${item.source}`
          : item.kind === "gap" ? `Information gap: ${item.gap}` : JSON.stringify(item);
    li.append(el("span", label));
    if (item.records?.length) li.append(el("small", ` · Records: ${item.records.join(", ")}`, "hint"));
    recheckList.append(li);
  }
  if (!recheckList.children.length) recheckList.append(el("li", "No location recheck item names this guide."));
  container.append(recheckList);
  return container;
}

function appendLocalGuidanceField(form, labelText, key, value, options = {}) {
  const id = `local-guidance-${key}`;
  const wrapper = document.createElement("div");
  const labelRow = document.createElement("div");
  labelRow.className = "field-label-row";
  const label = el("label", labelText);
  label.htmlFor = id;
  const help = ({
    title: "The municipality-specific heading shown with the national guide.",
    summary: "A concise summary of the local procedure supported by the cited official pages.",
    applicability: "When and where this local procedure applies, including address or ward dependencies.",
    responsibleBody: "The municipality or other public body responsible for this procedure.",
    receivingOffice: "The office or counter that receives the procedure. Leave empty when the sources do not identify one.",
    sourceFormatNote: "Explain the source language or format and whether this English summary is an official translation.",
  })[key];
  labelRow.append(label, helpDisclosure(labelText, help));
  const input = document.createElement(options.multiline ? "textarea" : "input");
  input.id = id;
  input.dataset.field = key;
  if (!options.multiline) input.type = "text";
  input.value = value || "";
  input.placeholder = options.optional ? "Optional" : "";
  if (options.optional) input.dataset.optional = "true";
  wrapper.append(labelRow, input);
  form.append(wrapper);
  return input;
}

function localGuidanceFieldsFromEditor(editor) {
  const fields = {};
  for (const input of editor.querySelectorAll("[data-field]")) {
    const key = input.dataset.field;
    if (key === "actions") {
      fields.actions = [...editor.querySelectorAll(".local-guidance-actions-editor")].map((section) => ({
        title: section.querySelector('[data-action-field="title"]').value.trim(),
        description: section.querySelector('[data-action-field="description"]').value.trim(),
      }));
    } else {
      const value = input.value.trim();
      if (input.dataset.optional === "true" && !value) continue;
      fields[key] = value;
    }
  }
  return fields;
}

function localGuidanceChangedFields(editor, original) {
  const edited = localGuidanceFieldsFromEditor(editor);
  const changed = {};
  for (const key of ["title", "summary", "applicability", "responsibleBody", "receivingOffice", "sourceFormatNote", "actions"]) {
    const oldValue = original[key];
    const newValue = edited[key];
    if (newValue === undefined && oldValue === undefined) continue;
    if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) changed[key] = newValue ?? "";
  }
  return changed;
}

function appendActionEditor(editor, action, index) {
  const section = document.createElement("section");
  section.className = "local-guidance-actions-editor";
  section.append(el("h5", `Action ${index + 1}`));
  const fields = document.createElement("div");
  fields.className = "local-guidance-action-fields";
  const titleRow = document.createElement("div");
  titleRow.className = "field-label-row";
  const titleLabel = el("label", "Action title");
  const titleId = `local-guidance-action-${index}-title`;
  titleLabel.htmlFor = titleId;
  const title = document.createElement("input");
  title.id = titleId;
  title.type = "text"; title.value = action.title || ""; title.dataset.actionField = "title";
  titleRow.append(titleLabel, helpDisclosure(`Action ${index + 1} title`, "A short verb-led label for this local step. Keep the number and order of actions in the source workflow."));
  const descriptionRow = document.createElement("div");
  descriptionRow.className = "field-label-row";
  const descriptionLabel = el("label", "Action description");
  const descriptionId = `local-guidance-action-${index}-description`;
  descriptionLabel.htmlFor = descriptionId;
  const description = document.createElement("textarea");
  description.id = descriptionId;
  description.value = action.description || ""; description.dataset.actionField = "description";
  descriptionRow.append(descriptionLabel, helpDisclosure(`Action ${index + 1} description`, "Describe the municipality-specific step, documents, office, or route supported by the cited pages."));
  fields.append(titleRow, title, descriptionRow, description);
  section.append(fields);
  editor.append(section);
  return section;
}

function updateLocalGuidanceSaveState(editor) {
  const changed = localGuidanceChangedFields(editor, localGuidanceDetailRecord.value);
  localGuidanceUnsaved = Object.keys(changed).length > 0;
  const save = editor.querySelector("button[type='submit']");
  if (save) save.disabled = !localGuidanceUnsaved;
  const status = editor.querySelector("[role='status']");
  if (status) status.textContent = localGuidanceUnsaved ? "Unsaved English changes." : "No unsaved English changes.";
}

function renderLocalGuidanceDetail(record) {
  localGuidanceDetailRecord = record;
  const header = recordHeader({
    kind: `Municipality guidance · ${record.locationName}`,
    title: record.title,
    status: "needs-review",
    path: record.source?.path,
    extra: [
      el("span", localGuidanceTranslationLabel(record.translation), `badge ${record.translation === "current" ? "current" : record.translation === "stale" ? "stale" : ""}`.trim()),
      el("span", `Translation review state: ${record.translationReviewState || "not available"}`, "badge neutral"),
      el("span", localGuidanceGeneratorLabel(record.generator), "badge neutral local-guidance-generator"),
    ],
  });
  const facts = document.createElement("dl");
  field(facts, "Location", `${record.locationName} (${record.locationId})`);
  field(facts, "Article", record.articleId);
  field(facts, "Source file", record.source?.path || "Unavailable");
  field(facts, "Loaded revision", record.revision || "Unavailable");
  field(facts, "Source file revision", record.source?.sourceRevision || "Unavailable");
  const check = document.createElement("section");
  check.className = "local-guidance-check-command";
  check.append(el("h4", "Location check"));
  check.append(el("code", `npm run local-guidance -- check --location ${record.locationId} --links --evidence`));
  check.append(el("p", "Run this command to check the selected location. The CMS has not run it automatically.", "hint"));
  const articleLink = referenceLinkButton(record.articleId);
  const readOnly = document.createElement("p");
  readOnly.append(el("strong", "Review workflow: "), el("span", "Local guidance remains needs-review. This workspace does not change status, approval, or Japanese content."));
  const editor = document.createElement("form");
  editor.className = "local-guidance-editor";
  editor.noValidate = true;
  const value = record.value || {};
  appendLocalGuidanceField(editor, "Title", "title", value.title);
  appendLocalGuidanceField(editor, "Summary", "summary", value.summary, { multiline: true });
  appendLocalGuidanceField(editor, "Applicability", "applicability", value.applicability, { multiline: true });
  appendLocalGuidanceField(editor, "Responsible body", "responsibleBody", value.responsibleBody);
  appendLocalGuidanceField(editor, "Receiving office (optional)", "receivingOffice", value.receivingOffice, { multiline: true, optional: true });
  appendLocalGuidanceField(editor, "Source format note (optional)", "sourceFormatNote", value.sourceFormatNote, { multiline: true, optional: true });
  editor.append(el("h4", "Actions (fixed set)"));
  editor.append(el("p", "Edit action titles and descriptions here. Add or remove actions in the local guidance source workflow.", "hint"));
  const actionMarker = document.createElement("input");
  actionMarker.type = "hidden"; actionMarker.dataset.field = "actions";
  editor.append(actionMarker);
  for (const [index, action] of (value.actions || []).entries()) appendActionEditor(editor, action, index);
  const saveRow = document.createElement("div");
  saveRow.className = "local-guidance-save-row";
  const save = el("button", "Save English changes");
  save.type = "submit"; save.disabled = true; save.className = "primary";
  save.setAttribute("aria-keyshortcuts", "Control+S");
  const saveStatus = el("span", "No unsaved English changes.");
  saveStatus.setAttribute("role", "status");
  saveRow.append(save, saveStatus);
  editor.append(saveRow);
  editor.addEventListener("input", () => updateLocalGuidanceSaveState(editor));
  editor.addEventListener("submit", async (event) => {
    event.preventDefault();
    const fields = localGuidanceChangedFields(editor, record.value);
    if (!Object.keys(fields).length) return;
    save.disabled = true;
    saveStatus.textContent = "Saving English guidance…";
    try {
      const result = await mutate(`/api/local-guidance/${encodeURIComponent(record.id)}/content`, "PUT", {
        expectedRevision: record.revision,
        expectedSourceRevision: record.source?.sourceRevision,
        fields,
      });
      localGuidanceUnsaved = false;
      saveStatus.textContent = result.changed ? "Saved. Reloading guide and translation state…" : "No canonical changes were needed.";
      await refreshLocalGuidance();
      await refreshHandoff();
    } catch (error) {
      save.disabled = false;
      saveStatus.textContent = error.message;
      saveStatus.className = "error";
    }
  });
  const related = localGuidanceRelatedInfo(record);
  const editPanel = document.createElement("div");
  editPanel.append(readOnly, editor);
  const detailsPanel = document.createElement("div");
  const articleRow = el("p", "National guide: ");
  articleRow.append(articleLink);
  detailsPanel.append(facts, articleRow, check);
  localGuidanceDetail.replaceChildren(header, renderDetailTabs([
    ["edit", "Edit", editPanel],
    ["sources", "Sources & rechecks", related],
    ["details", "Details & checks", detailsPanel],
  ], "Guide sections", "guide"));
}

async function selectLocalGuidance(id, options = {}) {
  if (localGuidanceUnsaved && !options.discardUnsaved && !window.confirm("Discard unsaved municipality guidance changes?")) return;
  localGuidanceUnsaved = false;
  selectedLocalGuidanceId = id;
  if (!options.keepPage) {
    showPage("guidance");
    setRoute(`guidance/${encodeURIComponent(id)}`);
  }
  renderLocalGuidanceList();
  localGuidanceDetail.replaceChildren(el("p", "Loading guide…"));
  try {
    const record = await json(`/api/local-guidance/${encodeURIComponent(id)}`);
    if (selectedLocalGuidanceId !== id) return;
    renderLocalGuidanceDetail(record);
  } catch (error) {
    localGuidanceDetail.replaceChildren(el("p", error.message, "error"));
  }
}

function renderLocalGuidanceLocations() {
  const previous = localGuidanceLocation.value;
  const options = [el("option", "Choose a location")];
  options[0].value = "";
  const groups = new Map();
  for (const location of localGuidanceLocations) {
    const option = el("option", `${location.name} (${location.supplements.length} guides${location.supplements.some(localGuidanceNeedsAttention) ? ", needs attention" : ""})`);
    option.value = location.id;
    const group = location.prefectureName || "";
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push(option);
  }
  // Locations are grouped by prefecture when the catalog names them; otherwise the list stays flat.
  for (const [name, members] of groups) {
    if (!name) { options.push(...members); continue; }
    const optgroup = document.createElement("optgroup");
    optgroup.label = name;
    optgroup.append(...members);
    options.push(optgroup);
  }
  localGuidanceLocation.replaceChildren(...options);
  localGuidanceLocation.value = localGuidanceLocations.some((location) => location.id === previous) ? previous : "";
  localGuidanceFailuresPanel.replaceChildren(...localGuidanceFailures.map((failure) => el("p", `${failure.path}: ${failure.error}`, "error")));
  renderLocalGuidanceMatrix(localGuidanceGuides);
  renderLocalGuidanceList();
}

async function refreshLocalGuidance() {
  if (!localGuidanceList) return;
  try {
    const result = await json("/api/local-guidance");
    localGuidanceLocations = result.locations || [];
    localGuidanceGuides = result.guides || [];
    localGuidanceFailures = result.failures || [];
    renderLocalGuidanceLocations();
    if (selectedLocalGuidanceId) await selectLocalGuidance(selectedLocalGuidanceId, { keepPage: true });
  } catch (error) {
    localGuidanceDetail.replaceChildren(el("p", `Municipality guidance could not be loaded: ${error.message}`, "error"));
    localGuidanceCount.textContent = "Catalog unavailable";
  }
}

function renderInline(text) {
  const fragment = document.createDocumentFragment();
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\\?\((?:\/|https?:\/\/)[^)\s]+\))/g);
  for (const part of parts) {
    if (part.startsWith("**") && part.endsWith("**")) {
      const strong = document.createElement("strong");
      strong.append(renderInline(part.slice(2, -2)));
      fragment.append(strong);
    } else if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      const emphasis = document.createElement("em");
      emphasis.append(renderInline(part.slice(1, -1)));
      fragment.append(emphasis);
    } else {
      const link = part.match(/^\[([^\]]+)\]\\?\(((?:\/|https?:\/\/)[^)\s]+)\)$/);
      if (link) {
        const anchor = document.createElement("a");
        anchor.href = link[2].startsWith("/") ? `${websiteOrigin}${link[2]}` : link[2];
        anchor.textContent = link[1];
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
        fragment.append(anchor);
      } else fragment.append(document.createTextNode(part));
    }
  }
  return fragment;
}

const componentNames = {
  "residence-application-fees": "Residence application fees",
  "tax-residence-scope": "Tax residence scope table",
  "training-route-comparison": "Training route comparison table",
  "japan-prefecture-regions": "Japan prefecture regions",
  "japan-prefecture-finder": "Japan prefecture finder",
  "japan-prefecture-region-cards": "Japan prefecture region cards",
  "japan-region-map": "Japan region map",
  "japan-practical-basics": "Japan practical basics",
};

function sourceList(sources) {
  const list = document.createElement("ul");
  list.className = "source-list";
  for (const source of sources) {
    const item = document.createElement("li");
    if (source.url) {
      const link = document.createElement("a");
      link.href = source.url;
      link.textContent = source.title;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      item.append(link, el("span", ` · ${source.organization}`, "hint"));
    } else item.append(el("span", `Unknown source: ${source.id}`, "error"));
    list.append(item);
  }
  if (!sources.length) list.append(el("li", "No sources declared."));
  return list;
}

function renderArticleBlocks(blocks) {
  const body = document.createElement("div");
  body.className = "preview-body";
  for (const block of blocks) {
    let node;
    if (block.kind === "heading") {
      node = document.createElement(`h${block.level}`);
      node.append(renderInline(block.text));
    } else if (block.kind === "paragraph") {
      node = document.createElement("p");
      node.append(renderInline(block.text));
    } else if (block.kind === "blockquote") {
      node = document.createElement("blockquote");
      const paragraph = document.createElement("p");
      paragraph.append(renderInline(block.text));
      node.append(paragraph);
    } else if (block.kind === "ordered-list" || block.kind === "unordered-list") {
      node = document.createElement(block.kind === "ordered-list" ? "ol" : "ul");
      for (const text of block.items) {
        const item = document.createElement("li");
        item.append(renderInline(text));
        node.append(item);
      }
    } else {
      node = document.createElement("aside");
      node.className = "component-placeholder";
      node.append(el("strong", componentNames[block.component] || block.component),
        el("p", "Interactive component. Open the website view to inspect its full rendering."));
    }
    body.append(node);
  }
  return body;
}

function changeSummary(before, after) {
  const oldLines = before.replaceAll("\r\n", "\n").split("\n");
  const newLines = after.replaceAll("\r\n", "\n").split("\n");
  let start = 0;
  while (start < oldLines.length && start < newLines.length && oldLines[start] === newLines[start]) start += 1;
  if (start === oldLines.length && start === newLines.length) return "No body changes.";
  let oldEnd = oldLines.length;
  let newEnd = newLines.length;
  while (oldEnd > start && newEnd > start && oldLines[oldEnd - 1] === newLines[newEnd - 1]) {
    oldEnd -= 1;
    newEnd -= 1;
  }
  return [
    `Original lines ${start + 1}–${oldEnd}:`,
    ...oldLines.slice(start, oldEnd).map((line) => `- ${line}`),
    `Proposed lines ${start + 1}–${newEnd}:`,
    ...newLines.slice(start, newEnd).map((line) => `+ ${line}`),
  ].join("\n");
}

function articleView(article) {
  const { metadata, summary: record } = article;
  const preview = document.createElement("article");
  preview.className = "article-preview";
  const header = document.createElement("header");
  header.className = "preview-header";
  // Like the website, reviewed content shows no status pill.
  if (metadata.status !== "verified") header.append(el("span", statusLabel(metadata.status), "badge"));
  header.append(el("h3", metadata.title), el("p", metadata.description, "preview-description"));
  preview.append(header);
  let previewBody = renderArticleBlocks(article.blocks);
  preview.append(previewBody);
  const sourceSection = document.createElement("section");
  sourceSection.className = "preview-sources";
  sourceSection.append(el("h2", "Official sources"), sourceList(article.sources));
  preview.append(sourceSection);
  const websiteLink = document.createElement("a");
  websiteLink.href = `${websiteOrigin}/articles/${encodeURIComponent(metadata.slug)}`;
  websiteLink.target = "_blank";
  websiteLink.rel = "noopener noreferrer";
  websiteLink.textContent = "Open full website view";
  const note = el("p", "Formatted preview from the shared article blocks. Interactive components are shown as placeholders here; the full website view needs the web dev server running on port 3000.", "hint");
  const wrapper = document.createElement("div");
  const previewPanel = document.createElement("section");
  previewPanel.id = "cms-article-preview";
  previewPanel.className = "article-preview-panel";
  const previewStatus = el("p", "Preview reflects the loaded article.", "hint");
  previewStatus.setAttribute("role", "status");
  previewPanel.append(previewStatus, note, websiteLink, preview);
  const editable = metadata.status === "draft" || metadata.status === "needs-review";
  previewPanel.hidden = editable;
  if (editable) {
    const editor = document.createElement("section");
    editor.className = "article-editor";
    const label = labeledField("Article body (MDX source)", "article-body-editor", helpText.articleBody);
    const textarea = document.createElement("textarea");
    textarea.id = "article-body-editor";
    textarea.value = article.body;
    textarea.spellcheck = true;
    const modeBar = document.createElement("div");
    modeBar.className = "editor-mode-bar";
    const formattedModeButton = el("button", "Formatted editor");
    const sourceModeButton = el("button", "MDX source");
    for (const button of [formattedModeButton, sourceModeButton]) button.type = "button";
    modeBar.append(formattedModeButton, sourceModeButton);
    const formattedHost = document.createElement("div");
    formattedHost.className = "formatted-host";
    formattedHost.setAttribute("role", "region");
    formattedHost.setAttribute("aria-label", "Formatted article editor");
    formattedHost.tabIndex = 0;
    const formattedNotice = el("p", "Edit the formatted blocks directly. Components and unfamiliar syntax are locked; use MDX source for exact edits.", "hint");
    formattedHost.append(formattedNotice);
    let formattedMode = true;
    let activeBlockIndex = 0;
    let formattedLinkRange = null;
    let formattedSelectionRange = null;
    let invalidFormattedBlock = false;
    const toolbar = document.createElement("div");
    toolbar.className = "format-toolbar";
    toolbar.setAttribute("role", "toolbar");
    toolbar.setAttribute("aria-label", "Article formatting");
    function toolbarGroup(name) {
      const group = document.createElement("div");
      group.className = "toolbar-group";
      group.setAttribute("role", "group");
      group.setAttribute("aria-label", name);
      toolbar.append(group);
      return group;
    }
    const historyGroup = toolbarGroup("Edit history");
    const typographyGroup = toolbarGroup("Text style");
    const structureGroup = toolbarGroup("Blocks and links");
    const componentGroup = toolbarGroup("Shared article components");
    const blockType = document.createElement("select");
    blockType.setAttribute("aria-label", "Block type");
    for (const [value, name] of [["paragraph", "Paragraph"], ["heading-2", "Heading 2"], ["heading-3", "Heading 3"],
      ["unordered-list", "Bulleted list"], ["ordered-list", "Numbered list"], ["blockquote", "Quote"]]) {
      const option = el("option", name);
      option.value = value;
      blockType.append(option);
    }
    typographyGroup.append(blockType);
    function symbolButton(button, symbol, label) {
      button.append(el("span", symbol, "toolbar-symbol"), el("span", label, "toolbar-label"));
      return button;
    }
    function formatButton(group, symbol, label, title, action) {
      const button = symbolButton(document.createElement("button"), symbol, label);
      button.type = "button";
      button.title = title;
      button.setAttribute("aria-label", title);
      button.addEventListener("click", action);
      group.append(button);
      return button;
    }
    function replaceSelection(replacement, caretStart, caretEnd = caretStart) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      textarea.setRangeText(replacement, start, end, "end");
      if (!formattedMode) textarea.focus();
      if (caretStart !== undefined) textarea.setSelectionRange(start + caretStart, start + caretEnd);
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
    }
    function formatLines(transform) {
      const value = textarea.value;
      const start = value.lastIndexOf("\n", textarea.selectionStart - 1) + 1;
      const nextNewline = value.indexOf("\n", textarea.selectionEnd);
      const end = nextNewline < 0 ? value.length : nextNewline;
      const lines = value.slice(start, end).split("\n");
      if (lines.some((line) => /^\s*<[A-Z][A-Za-z0-9]*\s*\/?>\s*$/.test(line))) {
        message.textContent = "Shared component blocks cannot be formatted as prose.";
        message.className = "error";
        return;
      }
      const replacement = transform(lines).join("\n");
      textarea.setRangeText(replacement, start, end, "select");
      textarea.focus();
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
    }
    function prefixLines(prefix) {
      if (formattedMode) {
        const kind = prefix === "## " ? "heading-2" : prefix === "### " ? "heading-3"
          : prefix === "> " ? "blockquote" : typeof prefix === "function" ? "ordered-list" : "unordered-list";
        convertBlock(kind);
        return;
      }
      formatLines((lines) => lines.map((line, index) => {
        const plain = line.replace(/^(?:#{2,3}|>|[-*]|\d+[.)])\s+/, "");
        return `${typeof prefix === "function" ? prefix(index) : prefix}${plain}`;
      }));
    }
    function wrapSelection(marker) {
      if (formattedMode) {
        formatSelection(marker === "**" ? "strong" : "em");
        return;
      }
      const selection = textarea.value.slice(textarea.selectionStart, textarea.selectionEnd);
      replaceSelection(`${marker}${selection}${marker}`, marker.length, marker.length + selection.length);
    }
    function currentEditable() {
      return formattedHost.querySelector(`.formatted-block[data-block-index="${activeBlockIndex}"] [contenteditable="true"]`);
    }
    function activeBlockFromSelection() {
      const anchor = window.getSelection()?.anchorNode;
      const element = anchor?.nodeType === 1 ? anchor : anchor?.parentElement;
      const block = element?.closest(".formatted-block");
      if (block && formattedHost.contains(block)) activeBlockIndex = Number(block.dataset.blockIndex);
    }
    function rememberFormattedSelection() {
      const selection = window.getSelection();
      if (!selection?.rangeCount) return;
      const range = selection.getRangeAt(0);
      if (formattedHost.contains(range.commonAncestorContainer)) formattedSelectionRange = range.cloneRange();
    }
    function restoreFormattedSelection() {
      if (!formattedSelectionRange || !formattedHost.contains(formattedSelectionRange.commonAncestorContainer)) return;
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(formattedSelectionRange);
    }
    function currentChunk() {
      const chunk = window.CmsFormattedArticle.scan(textarea.value, article.componentTags)[activeBlockIndex];
      const block = formattedHost.querySelector(`.formatted-block[data-block-index="${activeBlockIndex}"]`);
      return chunk && block?.classList.contains("formatted-locked") ? { ...chunk, kind: "locked" } : chunk;
    }
    function replaceChunk(nextRaw, rerender = false) {
      const chunk = currentChunk();
      if (!chunk || chunk.kind === "locked") return;
      const beginning = chunk.raw.match(/^\n+/)?.[0] || "";
      const ending = chunk.raw.match(/\n+$/)?.[0] || "";
      textarea.value = `${textarea.value.slice(0, chunk.start)}${beginning}${nextRaw}${ending}${textarea.value.slice(chunk.end)}`;
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
      if (rerender) renderFormattedSurface(true);
    }
    function syncFormattedBlock(index) {
      activeBlockIndex = index;
      const chunk = currentChunk();
      const block = formattedHost.querySelector(`.formatted-block[data-block-index="${index}"]`);
      if (!chunk || !block || chunk.kind === "locked") return;
      const nextRaw = window.CmsFormattedArticle.sourceFor(chunk, block.firstElementChild);
      if (!nextRaw.trim() || /(?:^|\n)(?:- |\d+\. )$/.test(nextRaw)) {
        invalidFormattedBlock = true;
        validPreview = false;
        save.disabled = true;
        message.textContent = "Complete this block before saving or changing modes.";
        message.className = "error";
        return;
      }
      replaceChunk(nextRaw);
      invalidFormattedBlock = [...formattedHost.querySelectorAll('.formatted-block [contenteditable="true"]')]
        .some((editable) => !editable.textContent.trim());
      if (invalidFormattedBlock) {
        save.disabled = true;
        message.textContent = "Complete every formatted block before saving or changing modes.";
        message.className = "error";
      }
    }
    function renderFormattedSurface(focus = false) {
      const rendered = window.CmsFormattedArticle.render(textarea.value, article.componentTags, document);
      formattedHost.querySelector(".formatted-surface")?.remove();
      formattedHost.append(rendered.surface);
      invalidFormattedBlock = [...rendered.surface.querySelectorAll('[contenteditable="true"]')]
        .some((editable) => !editable.textContent.trim());
      if (focus) {
        const editable = currentEditable();
        editable?.focus();
        if (editable) {
          const range = document.createRange();
          range.selectNodeContents(editable);
          range.collapse(false);
          window.getSelection()?.removeAllRanges();
          window.getSelection()?.addRange(range);
        }
      }
      updateBlockType();
    }
    function updateBlockType() {
      const kind = currentChunk()?.kind;
      blockType.disabled = !formattedMode || !kind || kind === "locked";
      if (!blockType.disabled) blockType.value = kind;
      updateInlineStates();
    }
    function updateInlineStates() {
      const selection = window.getSelection();
      const editable = currentEditable();
      const parent = selection?.anchorNode?.nodeType === 1 ? selection.anchorNode : selection?.anchorNode?.parentElement;
      const within = formattedMode && editable && parent && editable.contains(parent);
      boldButton.setAttribute("aria-pressed", String(Boolean(within && parent.closest("strong, b"))));
      italicButton.setAttribute("aria-pressed", String(Boolean(within && parent.closest("em, i"))));
    }
    function convertBlock(kind) {
      activeBlockFromSelection();
      const chunk = currentChunk();
      const block = formattedHost.querySelector(`.formatted-block[data-block-index="${activeBlockIndex}"]`);
      const content = block?.firstElementChild;
      if (!chunk || chunk.kind === "locked" || !content) return;
      const source = window.CmsFormattedArticle;
      const items = chunk.items ? [...content.querySelectorAll(":scope > li")].map((item) => source.inlineSource(item).trim())
        : [source.inlineSource(content).trim()];
      const text = items.join(" ");
      const nextRaw = kind === "heading-2" ? `## ${text}` : kind === "heading-3" ? `### ${text}`
        : kind === "blockquote" ? `> ${text}` : kind === "unordered-list" ? items.map((item) => `- ${item}`).join("\n")
          : kind === "ordered-list" ? items.map((item, index) => `${index + 1}. ${item}`).join("\n") : text;
      replaceChunk(nextRaw, true);
    }
    function formatSelection(tag) {
      restoreFormattedSelection();
      activeBlockFromSelection();
      const selection = window.getSelection();
      if (!selection?.rangeCount) { message.textContent = "Select text inside a formatted block first."; return; }
      const editable = currentEditable();
      const range = selection.getRangeAt(0);
      if (!editable || !editable.contains(range.commonAncestorContainer)) { message.textContent = "Select text inside one editable block."; return; }
      const existing = selection.anchorNode?.parentElement?.closest(tag);
      if (existing && editable.contains(existing)) {
        existing.replaceWith(...existing.childNodes);
      } else if (!range.collapsed) {
        const mark = document.createElement(tag);
        mark.append(range.extractContents());
        range.insertNode(mark);
        range.selectNodeContents(mark);
        selection.removeAllRanges();
        selection.addRange(range);
      } else return;
      syncFormattedBlock(activeBlockIndex);
      rememberFormattedSelection();
    }
    blockType.addEventListener("change", () => convertBlock(blockType.value));
    formatButton(typographyGroup, "H₂", "Heading 2", "Heading level 2", () => prefixLines("## "));
    formatButton(typographyGroup, "H₃", "Heading 3", "Heading level 3", () => prefixLines("### "));
    const boldButton = formatButton(typographyGroup, "B", "Bold", "Bold (Ctrl+B)", () => wrapSelection("**"));
    const italicButton = formatButton(typographyGroup, "I", "Italic", "Italic (Ctrl+I)", () => wrapSelection("*"));
    formatButton(structureGroup, "•", "Bulleted list", "Bulleted list", () => prefixLines("- "));
    formatButton(structureGroup, "1.", "Numbered list", "Numbered list", () => prefixLines((index) => `${index + 1}. `));
    formatButton(structureGroup, "❝", "Quote", "Blockquote", () => prefixLines("> "));
    const linkForm = document.createElement("div");
    linkForm.className = "link-editor";
    linkForm.hidden = true;
    const linkTextLabel = labeledField("Link text", "article-link-text", helpText.linkText);
    const linkText = document.createElement("input");
    linkText.type = "text";
    linkText.id = "article-link-text";
    const linkUrlLabel = labeledField("Link destination (site path or https URL)", "article-link-url", helpText.linkUrl);
    const linkUrl = document.createElement("input");
    linkUrl.type = "url";
    linkUrl.id = "article-link-url";
    const applyLink = el("button", "Insert link");
    applyLink.type = "button";
    const cancelLink = el("button", "Cancel link");
    cancelLink.type = "button";
    const removeLink = el("button", "Remove link");
    removeLink.type = "button";
    removeLink.hidden = true;
    let linkSelection = { start: 0, end: 0 };
    let formattedAnchor = null;
    formatButton(structureGroup, "⌁", "Link", "Insert or change link", () => {
      if (formattedMode) {
        restoreFormattedSelection();
        activeBlockFromSelection();
        const selection = window.getSelection();
        const editable = currentEditable();
        if (!selection?.rangeCount || !editable || !editable.contains(selection.anchorNode)) return;
        formattedLinkRange = selection.getRangeAt(0).cloneRange();
        formattedAnchor = selection.anchorNode?.parentElement?.closest("a") || null;
        if (formattedAnchor && editable.contains(formattedAnchor)) {
          formattedLinkRange.selectNode(formattedAnchor);
          linkText.value = formattedAnchor.textContent;
          linkUrl.value = formattedAnchor.getAttribute("href") || "";
          removeLink.hidden = false;
        } else {
          linkText.value = selection.toString();
          linkUrl.value = "";
          removeLink.hidden = true;
        }
        linkForm.hidden = false;
        linkText.focus();
        return;
      }
      linkSelection = { start: textarea.selectionStart, end: textarea.selectionEnd };
      linkText.value = textarea.value.slice(linkSelection.start, linkSelection.end);
      linkUrl.value = "";
      linkForm.hidden = false;
      linkText.focus();
    });
    formatButton(structureGroup, "+", "Paragraph", "Add paragraph after current block", () => {
      if (!formattedMode) { replaceSelection("\n\nNew paragraph\n\n"); return; }
      const chunk = currentChunk();
      if (!chunk) return;
      const position = chunk.end + chunk.separator.length;
      const before = textarea.value.slice(0, position);
      const after = textarea.value.slice(position);
      textarea.value = `${before}${chunk.separator ? "" : "\n\n"}New paragraph${after ? "\n\n" : "\n"}${after}`;
      activeBlockIndex += 1;
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
      renderFormattedSurface(true);
    });
    applyLink.addEventListener("click", () => {
      const label = linkText.value.trim();
      const url = linkUrl.value.trim();
      if (!label || !/^(?:\/(?!\/)|https?:\/\/)[^\s)]+$/.test(url)) {
        message.textContent = "Enter link text and a site path or HTTP(S) URL without spaces.";
        message.className = "error";
        return;
      }
      if (formattedMode && formattedLinkRange) {
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.textContent = label;
        anchor.addEventListener("click", (event) => event.preventDefault());
        formattedLinkRange.deleteContents();
        formattedLinkRange.insertNode(anchor);
        syncFormattedBlock(activeBlockIndex);
        anchor.focus();
      } else {
        textarea.setSelectionRange(linkSelection.start, linkSelection.end);
        replaceSelection(`[${label}](${url})`);
      }
      linkForm.hidden = true;
    });
    removeLink.addEventListener("click", () => {
      if (!formattedMode || !formattedAnchor) return;
      formattedAnchor.replaceWith(document.createTextNode(formattedAnchor.textContent));
      syncFormattedBlock(activeBlockIndex);
      linkForm.hidden = true;
    });
    cancelLink.addEventListener("click", () => {
      linkForm.hidden = true;
      if (formattedMode) { currentEditable()?.focus(); restoreFormattedSelection(); }
      else textarea.focus();
    });
    const linkTextField = document.createElement("div");
    linkTextField.className = "link-field";
    linkTextField.append(linkTextLabel, linkText);
    const linkUrlField = document.createElement("div");
    linkUrlField.className = "link-field";
    linkUrlField.append(linkUrlLabel, linkUrl);
    linkForm.append(linkTextField, linkUrlField, applyLink, removeLink, cancelLink);
    const componentPicker = document.createElement("select");
    componentPicker.id = "article-component-picker";
    componentPicker.setAttribute("aria-label", "Shared article component");
    for (const kind of Object.keys(article.componentTags)) {
      const option = document.createElement("option");
      option.value = kind;
      option.textContent = componentNames[kind] || kind;
      componentPicker.append(option);
    }
    const insertComponent = symbolButton(document.createElement("button"), "+", "Insert component");
    insertComponent.type = "button";
    insertComponent.addEventListener("click", () => {
      const tag = article.componentTags[componentPicker.value];
      if (formattedMode) {
        const chunk = currentChunk();
        if (!chunk) return;
        const position = chunk.end + chunk.separator.length;
        const before = textarea.value.slice(0, position);
        const after = textarea.value.slice(position);
        textarea.value = `${before}${chunk.separator ? "" : "\n\n"}<${tag} />${after ? "\n\n" : "\n"}${after}`;
        activeBlockIndex += 1;
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
        renderFormattedSurface();
        return;
      }
      const before = textarea.value.slice(0, textarea.selectionStart);
      const after = textarea.value.slice(textarea.selectionEnd);
      const leading = before.endsWith("\n\n") || !before ? "" : before.endsWith("\n") ? "\n" : "\n\n";
      const trailing = after.startsWith("\n\n") || !after ? "" : after.startsWith("\n") ? "\n" : "\n\n";
      replaceSelection(`${leading}<${tag} />${trailing}`);
    });
    const componentLabel = el("label", "Shared article component");
    componentLabel.htmlFor = componentPicker.id;
    componentGroup.append(componentLabel, componentPicker, insertComponent,
      helpDisclosure("Shared article component", helpText.component));
    const history = [{ value: article.body, start: 0, end: 0 }];
    let historyIndex = 0;
    let restoring = false;
    const undo = formatButton(historyGroup, "↶", "Undo", "Undo edit (Ctrl+Z)", () => restoreHistory(-1));
    const redo = formatButton(historyGroup, "↷", "Redo", "Redo edit (Ctrl+Y)", () => restoreHistory(1));
    function updateHistoryButtons() {
      undo.disabled = historyIndex === 0;
      redo.disabled = historyIndex === history.length - 1;
    }
    function restoreHistory(direction) {
      const next = historyIndex + direction;
      if (next < 0 || next >= history.length) return;
      historyIndex = next;
      restoring = true;
      textarea.value = history[next].value;
      textarea.setSelectionRange(history[next].start, history[next].end);
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
      restoring = false;
      if (formattedMode) renderFormattedSurface(true);
      else textarea.focus();
      updateHistoryButtons();
    }
    updateHistoryButtons();
    textarea.addEventListener("keydown", (event) => {
      if (!(event.ctrlKey || event.metaKey)) return;
      const key = event.key.toLowerCase();
      if (key === "b" || key === "i") {
        event.preventDefault();
        wrapSelection(key === "b" ? "**" : "*");
      } else if (key === "z" || key === "y") {
        event.preventDefault();
        restoreHistory(key === "z" && !event.shiftKey ? -1 : 1);
      }
    });
    const dateLabel = labeledField("Updated date", "article-updated-date", helpText.updatedAt);
    const date = document.createElement("input");
    date.id = "article-updated-date";
    date.type = "date";
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    date.value = today > metadata.updatedAt ? today : metadata.updatedAt;
    date.min = metadata.updatedAt;
    const message = el("p", "Unsaved edits are kept as a local recovery draft. Save writes the article file.", "hint");
    message.setAttribute("role", "status");
    const diff = document.createElement("details");
    const diffBody = el("pre", "No body changes.");
    diff.append(el("summary", "Review body change"), diffBody);
    const generated = document.createElement("details");
    const generatedBody = el("pre", article.body);
    generated.append(el("summary", "Generated MDX for save"), generatedBody);
    const save = el("button", "Save article body");
    save.type = "button";
    save.className = "primary";
    save.setAttribute("aria-keyshortcuts", "Control+S");
    save.title = "Save article body (Ctrl+S)";
    save.disabled = true;
    const previewToggle = el("button", "Preview article");
    previewToggle.type = "button";
    previewToggle.setAttribute("aria-controls", previewPanel.id);
    previewToggle.setAttribute("aria-expanded", "false");
    const cancel = el("button", "Discard edits");
    cancel.type = "button";
    const actions = document.createElement("div");
    actions.className = "edit-actions";
    actions.append(previewToggle, save, cancel);
    const bar = actionBar(actions, message);
    editor.append(modeBar, toolbar, linkForm, formattedHost, label, textarea, dateLabel, date, diff, generated, bar.bar);
    wrapper.append(editor);
    function setEditorMode(next) {
      if (next === "source" && invalidFormattedBlock) {
        message.textContent = "Complete the current formatted block before switching modes.";
        message.className = "error";
        return;
      }
      formattedMode = next === "formatted";
      formattedHost.hidden = !formattedMode;
      label.hidden = formattedMode;
      textarea.hidden = formattedMode;
      formattedModeButton.setAttribute("aria-pressed", String(formattedMode));
      sourceModeButton.setAttribute("aria-pressed", String(!formattedMode));
      updateBlockType();
      if (formattedMode) renderFormattedSurface(true);
      else {
        textarea.focus();
        const position = currentChunk()?.start || 0;
        textarea.setSelectionRange(position, position);
      }
    }
    formattedModeButton.addEventListener("click", () => setEditorMode("formatted"));
    sourceModeButton.addEventListener("click", () => setEditorMode("source"));
    formattedHost.addEventListener("focusin", (event) => {
      const block = event.target.closest(".formatted-block");
      if (block) activeBlockIndex = Number(block.dataset.blockIndex);
      updateBlockType();
    });
    formattedHost.addEventListener("keyup", updateInlineStates);
    formattedHost.addEventListener("mouseup", updateInlineStates);
    formattedHost.addEventListener("keyup", rememberFormattedSelection);
    formattedHost.addEventListener("mouseup", rememberFormattedSelection);
    formattedHost.addEventListener("input", (event) => {
      const block = event.target.closest(".formatted-block");
      if (block) syncFormattedBlock(Number(block.dataset.blockIndex));
    });
    formattedHost.addEventListener("paste", (event) => {
      const editable = event.target.closest('[contenteditable="true"]');
      if (!editable) return;
      event.preventDefault();
      const plain = event.clipboardData?.getData("text/plain").replace(/\s+/g, " ") || "";
      const selection = window.getSelection();
      if (!selection?.rangeCount) return;
      const range = selection.getRangeAt(0);
      if (!editable.contains(range.commonAncestorContainer)) return;
      range.deleteContents();
      const text = document.createTextNode(plain);
      range.insertNode(text);
      range.setStartAfter(text);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      editable.dispatchEvent(new Event("input", { bubbles: true }));
    });
    formattedHost.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      const editable = event.target.closest('[contenteditable="true"]');
      if (!editable) return;
      event.preventDefault();
      if (editable.tagName === "LI") {
        const next = document.createElement("li");
        next.setAttribute("contenteditable", "true");
        next.textContent = "";
        editable.after(next);
        syncFormattedBlock(Number(editable.closest(".formatted-block").dataset.blockIndex));
        next.focus();
      } else structureGroup.querySelector('[aria-label="Add paragraph after current block"]')?.click();
    });
    setEditorMode("formatted");
    let previewTimer;
    let previewVersion = 0;
    let validPreview = true;
    cancelEditorPreview = () => {
      clearTimeout(previewTimer);
      previewVersion += 1;
    };
    function updateState() {
      const changed = textarea.value !== article.body;
      hasUnsavedChanges = changed;
      markRecordUnsaved(changed);
      bar.setState(changed ? "dirty" : "clean", changed ? "Unsaved edits" : "No unsaved edits");
      if (changed) recovery?.schedule();
      save.disabled = !changed || !validPreview || invalidFormattedBlock;
      diffBody.textContent = `${metadata.updatedAt === date.value ? "Update date unchanged." : `Update date: ${metadata.updatedAt} → ${date.value}`}\n\n${changeSummary(article.body, textarea.value)}`;
      generatedBody.textContent = textarea.value;
      diff.open = changed;
    }
    const recovery = recoveryPanel({ ...article, kind: "article" }, (content) => {
      sourceModeButton.click();
      textarea.value = content.body;
      date.value = content.updatedAt || metadata.updatedAt;
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
    });
    recovery.setCurrentContent(() => ({ body: textarea.value, updatedAt: date.value }));
    recovery.onSaved((snapshot) => { if (hasUnsavedChanges) bar.setState("dirty", ["Unsaved edits", draftTime(snapshot) && `recovery draft kept ${draftTime(snapshot)}`].filter(Boolean).join(" · ")); });
    cancelEditorPreview = () => { clearTimeout(previewTimer); previewVersion += 1; recovery.dispose(); };
    editor.prepend(recovery.element);
    previewToggle.addEventListener("click", () => {
      previewPanel.hidden = !previewPanel.hidden;
      previewToggle.textContent = previewPanel.hidden ? "Preview article" : "Hide preview";
      previewToggle.setAttribute("aria-expanded", String(!previewPanel.hidden));
    });
    textarea.addEventListener("input", () => {
      if (!restoring && textarea.value !== history[historyIndex].value) {
        history.splice(historyIndex + 1);
        history.push({ value: textarea.value, start: textarea.selectionStart, end: textarea.selectionEnd });
        if (history.length > 100) history.shift();
        historyIndex = history.length - 1;
        updateHistoryButtons();
      }
      validPreview = false;
      previewStatus.textContent = "Preview is updating; the article below may show an earlier version.";
      updateState();
      clearTimeout(previewTimer);
      const version = ++previewVersion;
      previewTimer = setTimeout(async () => {
        try {
          const result = await mutate(`/api/articles/${encodeURIComponent(metadata.id)}/preview`, "POST", { body: textarea.value });
          if (version !== previewVersion) return;
          const nextBody = renderArticleBlocks(result.blocks);
          previewBody.replaceWith(nextBody);
          previewBody = nextBody;
          validPreview = true;
          previewStatus.textContent = "Preview reflects the unsaved article body.";
          message.textContent = "Unsaved preview updated. Review the source change before saving.";
          message.className = "hint";
        } catch (error) {
          if (version !== previewVersion) return;
          previewStatus.textContent = "The current draft cannot be previewed. The article below shows the last valid version.";
          message.textContent = error.message;
          message.className = "error";
        }
        updateState();
      }, 300);
    });
    date.addEventListener("change", updateState);
    cancel.addEventListener("click", () => {
      if (hasUnsavedChanges && !window.confirm("Discard your unsaved edits to this article?")) return;
      clearTimeout(previewTimer);
      hasUnsavedChanges = false;
      selectArticle(metadata.id);
    });
    save.addEventListener("click", async () => {
      save.disabled = true;
      bar.setState("saving", "Saving…");
      message.textContent = "Saving article body…";
      try {
        await recovery.flush();
        const savedVersion = recovery.version();
        noteGeneratedMetadata(await mutate(`/api/articles/${encodeURIComponent(metadata.id)}/body`, "PUT", {
          expectedRevision: record.revision, body: textarea.value, updatedAt: date.value,
        }));
        hasUnsavedChanges = false;
        await recovery.clearAfterSave(savedVersion);
        await refresh();
      } catch (error) {
        message.textContent = error.message;
        message.className = "error";
        updateState();
        bar.setState("error", "Not saved");
      }
    });
  } else {
    wrapper.append(el("p", "Body editing is currently available only for draft and needs-review articles.", "hint"));
    const recovery = recoveryPanel({ ...article, kind: "article" }, () => {});
    cancelEditorPreview = () => recovery.dispose();
    wrapper.prepend(recovery.element);
  }
  wrapper.append(previewPanel);
  wrapper.dataset.revision = record.revision;
  return wrapper;
}

function linkedArticleList(items) {
  const list = document.createElement("ul");
  list.className = "linked-list";
  for (const item of items) {
    const row = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = item.title;
    button.addEventListener("click", () => selectArticle(item.id));
    row.append(el("span", item.type, "relationship-type"), button);
    list.append(row);
  }
  if (!items.length) list.append(el("li", "No linked articles."));
  return list;
}

function linkedArticlesView(article) {
  const section = document.createElement("div");
  section.append(el("h3", "Outgoing links"), linkedArticleList(article.outboundRelationships),
    el("h3", "Incoming links"), linkedArticleList(article.inboundRelationships));
  return section;
}

function sourcesView(article) {
  const section = document.createElement("div");
  section.append(el("p", "Official sources declared by this article. Reachability is separate from substantive editorial review.", "hint"));
  section.append(contentImpactPanel());
  for (const source of article.sources) {
    const card = document.createElement("section");
    card.className = "source-card";
    card.append(el("h3", source.title));
    const dl = document.createElement("dl");
    field(dl, "Source ID", source.id);
    field(dl, "Organization", source.organization || "Unknown");
    field(dl, "Authority", source.authorityLevel || "Unknown");
    field(dl, "Language", source.language || "Unknown");
    field(dl, "Last link check", source.lastCheckedAt || "Not recorded");
    field(dl, "Last human review", source.lastReviewedAt || "Not recorded");
    card.append(dl);
    if (source.url) {
      const link = document.createElement("a");
      link.href = source.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "Open official page";
      card.append(link);
    }
    section.append(card);
  }
  if (!article.sources.length) section.append(el("p", "No sources declared."));
  return section;
}

function fileDetailsView(article) {
  const { metadata, summary: record } = article;
  const section = document.createElement("div");
  section.append(el("p", "Repository identity and editorial metadata. These fields are read-only; change status or record approval in Review & approve.", "hint"));
  const dl = document.createElement("dl");
  for (const [name, value] of [
    ["ID", metadata.id], ["Slug", metadata.slug], ["File", record.path],
    ["Article source revision", record.revision], ["Editorial approval revision", record.editorialRevision || "Unavailable"], ["Status", metadata.status],
    ["Created", metadata.createdAt], ["Updated", metadata.updatedAt],
    ["Last human review", metadata.lastReviewedAt || "Not recorded"],
    ["Japanese translation", record.translation],
    ["Journey stages", metadata.journeyStageIds.join(", ")],
    ["Topics", metadata.topicIds.join(", ")],
    ["Audiences", metadata.audienceIds.join(", ") || "None"],
    ["Geographic scopes", metadata.geographicScopes.join(", ")],
    ["Importance", metadata.importance], ["Content type", metadata.contentType],
    ["Glossary terms", metadata.termIds.join(", ") || "None"],
    ["Residence statuses", metadata.residenceStatusIds.join(", ") || "None"],
  ]) field(dl, name, value);
  const raw = document.createElement("details");
  raw.append(el("summary", "View canonical MDX body"), el("pre", article.body));
  section.append(dl, raw);
  return section;
}

function structuredEditorialControls(record) {
  const section = document.createElement("section");
  section.className = "editorial-controls";
  section.append(el("h3", "Editorial status"));
  const statusLabel = labeledField("Change status", "record-status", helpText.status);
  const status = document.createElement("select");
  status.id = "record-status";
  const choices = [["draft", "Draft"], ["needs-review", "Editorial review"]];
  if (record.kind === "residence-status") choices.push(["archived", "Archived"]);
  for (const [value, label] of choices) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    status.append(option);
  }
  status.value = record.status === "verified" ? "needs-review" : record.status;
  const note = el("p", record.kind === "residence-status"
    ? "Residence statuses require a review-date field even before approval. Their date alone does not mean they have been reviewed. Historical approval records remain in Git."
    : "Changing status clears the current reviewed date. Historical approval records remain in Git.", "hint");
  const statusButton = el("button", "Save status");
  statusButton.type = "button";
  statusButton.disabled = record.status !== "verified";
  status.addEventListener("change", () => { statusButton.disabled = status.value === record.status; });
  const message = el("p", "", "hint");
  message.setAttribute("role", "status");
  statusButton.addEventListener("click", async () => {
    if (hasUnsavedChanges) { message.textContent = "Save or discard content edits first."; message.className = "error"; return; }
    statusButton.disabled = true;
    try {
      await mutate(`/api/records/${record.kind}/${encodeURIComponent(record.id)}/status`, "PUT", {
        expectedRevision: record.revision,
        expectedSourceRevision: record.source.sourceRevision,
        status: status.value,
      });
      await refresh();
      document.querySelector("#record-tab-review")?.click();
    } catch (error) { message.textContent = error.message; message.className = "error"; statusButton.disabled = false; }
  });
  section.append(statusLabel, status, note, statusButton, message);
  if (record.status !== "needs-review") return section;

  const { form, date } = approvalForm({
    intro: "Read the saved record, its sources, and the checks beside this form, then approve this exact revision. The CMS writes the verified state and an immutable approval record.",
    revision: record.revision,
    ids: { date: "structured-review-date", change: "structured-change-note", validation: "structured-validation", sources: "structured-source-reviews", approval: "structured-approval-note" },
    kindName: "record",
    onSubmit: async (payload) => {
      const next = nextInQueue();
      const saved = await mutate(`/api/records/${record.kind}/${encodeURIComponent(record.id)}/review`, "POST", {
        expectedRevision: record.revision, expectedSourceRevision: record.source.sourceRevision, ...payload,
      });
      await refresh();
      document.querySelector("#record-tab-review")?.click();
      approvalRecorded(document.querySelector("#structured-editorial"), saved.approvalRecord, next);
    },
  });
  if (record.updatedAt) date.min = record.updatedAt;
  section.append(form);
  return section;
}

function structuredPreview(record, value, status) {
  const preview = document.createElement("article");
  preview.className = `article-preview structured-preview ${record.kind}-preview`;
  const header = document.createElement("header");
  header.className = "preview-header";
  if (status !== "verified") header.append(el("span", statusLabel(status), "badge"));
  if (record.kind === "faq") {
    header.append(el("p", "FAQ", "preview-eyebrow"), el("h3", value.question),
      el("p", value.summary, "preview-description"));
  } else if (record.kind === "residence-status") {
    header.append(el("p", "Residence status", "preview-eyebrow"),
      el("h3", value.englishName || record.title),
      el("p", value.japaneseName || "", "preview-secondary"),
      el("p", value.summary, "preview-description"));
  } else {
    header.append(el("p", "Glossary", "preview-eyebrow"),
      el("h3", value.japanese || record.title),
      el("p", [value.kana, value.romaji].filter(Boolean).join(" · "), "preview-secondary"),
      el("p", value.englishName, "preview-english"),
      el("p", value.shortDefinition, "preview-description"));
  }
  preview.append(header);
  const body = document.createElement("div");
  body.className = "preview-body";
  function section(title, content, list = false) {
    if (!content || (Array.isArray(content) && !content.length)) return;
    const block = document.createElement("section");
    block.append(el("h2", title));
    if (list) {
      const items = document.createElement("ul");
      for (const item of content) items.append(el("li", item));
      block.append(items);
    } else block.append(el("p", content));
    body.append(block);
  }
  if (record.kind === "faq") section("Related guidance", value.relatedArticleIds || [], true);
  if (record.kind === "residence-status") {
    section("General purpose", value.purpose);
    section("Typical activities", value.typicalActivities, true);
    section("Official examples", value.examples, true);
    section("What to verify", value.considerations, true);
  }
  if (record.kind === "glossary-term") {
    section("What it means", value.detailedExplanation);
    section("Where you may encounter it", value.commonContext);
  }
  preview.append(body);
  return preview;
}

function structuredWebsitePath(record) {
  const slug = encodeURIComponent(record.value.slug || record.id);
  if (record.kind === "faq") return `/faq#faq-${slug}`;
  if (record.kind === "residence-status") return `/residence-statuses/${slug}`;
  return `/glossary/${slug}`;
}

function structuredContentEditor(record) {
  const section = document.createElement("section");
  section.className = "structured-editor";
  section.append(el("h3", "Edit content"),
    el("p", "Edit the selected English fields. Saving returns a reviewed or archived record to Editorial review; a draft stays Draft. The rest of the record stays as shown below.", "hint"));
  const fields = new Map();
  for (const key of record.editableFields) {
    const title = key.replace(/([A-Z])/g, " $1").replace(/^./, (character) => character.toUpperCase());
    const control = document.createElement("textarea");
    control.rows = key === "detailedExplanation" || key === "considerations" ? 5 : 3;
    control.id = `edit-${key}`;
    const label = labeledField(title, control.id, key === "summary" ? (record.kind === "faq" ? helpText.faqSummary : helpText.residenceSummary) : helpText[key]);
    const initial = record.value[key];
    control.value = Array.isArray(initial) ? initial.join("\n") : initial ?? "";
    if (Array.isArray(initial)) {
      const hint = el("p", "One item per line. Blank lines are ignored.", "hint");
      section.append(label, control, hint);
    } else section.append(label, control);
    fields.set(key, { control, initial });
  }
  let updatedAt;
  if (record.kind === "faq") {
    const label = labeledField("Updated date", "structured-updated-date", helpText.updatedAt);
    updatedAt = document.createElement("input");
    updatedAt.type = "date";
    updatedAt.id = "structured-updated-date";
    updatedAt.min = record.updatedAt;
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    updatedAt.value = today > record.updatedAt ? today : record.updatedAt;
    section.append(label, updatedAt);
  }
  const diff = document.createElement("details");
  const diffBody = el("pre", "No content changes.");
  diff.append(el("summary", "Review proposed field changes"), diffBody);
  const actions = document.createElement("div");
  actions.className = "edit-actions";
  const save = el("button", "Save content");
  save.type = "button";
  save.className = "primary";
  save.setAttribute("aria-keyshortcuts", "Control+S");
  save.title = "Save content (Ctrl+S)";
  save.disabled = true;
  const discard = el("button", "Discard edits");
  discard.type = "button";
  const previewToggle = el("button", `Preview ${record.kind.replaceAll("-", " ")}`);
  previewToggle.type = "button";
  previewToggle.setAttribute("aria-controls", "cms-structured-preview");
  previewToggle.setAttribute("aria-expanded", "false");
  const previewPanel = document.createElement("section");
  previewPanel.id = "cms-structured-preview";
  previewPanel.className = "article-preview-panel";
  previewPanel.hidden = true;
  const previewStatus = el("p", "Preview reflects the loaded record.", "hint");
  previewStatus.setAttribute("role", "status");
  const previewNote = el("p", "Preview of editable English content. Some website modules and relationships are omitted. The full website view shows saved content only; inspect it after saving and before approval.", "hint");
  const websiteLink = el("a", "Open full website view");
  websiteLink.href = `${websiteOrigin}${structuredWebsitePath(record)}`;
  websiteLink.target = "_blank";
  websiteLink.rel = "noopener noreferrer";
  previewPanel.append(previewStatus, previewNote, websiteLink, structuredPreview(record, record.value, record.status));
  const message = el("p", "Unsaved edits are kept as a local recovery draft. Save writes the source file.", "hint");
  message.setAttribute("role", "status");
  actions.append(save, discard, previewToggle);
  const bar = actionBar(actions, message);
  section.append(diff, bar.bar, previewPanel);
  function changes() {
    const changed = {};
    for (const [key, { control, initial }] of fields) {
      const value = Array.isArray(initial) ? control.value.split("\n").map((item) => item.trim()).filter(Boolean) : control.value;
      if (JSON.stringify(value) !== JSON.stringify(initial)) changed[key] = value;
    }
    return changed;
  }
  let recovery;
  function updateState() {
    const changed = changes();
    hasUnsavedChanges = Object.keys(changed).length > 0;
    markRecordUnsaved(hasUnsavedChanges);
    bar.setState(hasUnsavedChanges ? "dirty" : "clean", hasUnsavedChanges ? "Unsaved edits" : "No unsaved edits");
    if (hasUnsavedChanges) recovery?.schedule();
    save.disabled = !hasUnsavedChanges;
    diffBody.textContent = hasUnsavedChanges ? Object.entries(changed).map(([key, value]) =>
      `${key}\n- ${JSON.stringify(record.value[key])}\n+ ${JSON.stringify(value)}`).join("\n\n")
      + (updatedAt ? `\n\nupdatedAt: ${record.updatedAt} → ${updatedAt.value}` : "")
      + `\n\nstatus: ${record.status} → ${record.status === "draft" ? "draft" : "needs-review"}`
      : "No content changes.";
    diff.open = hasUnsavedChanges;
    if (!previewPanel.hidden) {
      const next = { ...record.value, ...changed };
      previewPanel.querySelector(".structured-preview")?.replaceWith(structuredPreview(record, next,
        hasUnsavedChanges && record.status !== "draft" ? "needs-review" : record.status));
      previewStatus.textContent = hasUnsavedChanges ? "Preview reflects unsaved edits; save before review submission." : "Preview reflects the loaded record.";
    }
  }
  recovery = recoveryPanel(record, (content) => {
    for (const [key, value] of Object.entries(content.fields || {})) {
      const entry = fields.get(key);
      if (entry) entry.control.value = Array.isArray(value) ? value.join("\n") : String(value ?? "");
    }
    if (updatedAt && content.updatedAt) updatedAt.value = content.updatedAt;
    for (const { control } of fields.values()) control.dispatchEvent(new Event("input", { bubbles: true }));
    updatedAt?.dispatchEvent(new Event("change", { bubbles: true }));
  });
  recovery.setCurrentContent(() => ({ fields: changes(), ...(updatedAt ? { updatedAt: updatedAt.value } : {}) }));
  recovery.onSaved((snapshot) => { if (hasUnsavedChanges) bar.setState("dirty", ["Unsaved edits", draftTime(snapshot) && `recovery draft kept ${draftTime(snapshot)}`].filter(Boolean).join(" · ")); });
  cancelEditorPreview = () => recovery.dispose();
  section.prepend(recovery.element);
  previewToggle.addEventListener("click", () => {
    previewPanel.hidden = !previewPanel.hidden;
    previewToggle.textContent = previewPanel.hidden ? `Preview ${record.kind.replaceAll("-", " ")}` : "Hide preview";
    previewToggle.setAttribute("aria-expanded", String(!previewPanel.hidden));
    if (!previewPanel.hidden) updateState();
  });
  for (const { control } of fields.values()) control.addEventListener("input", updateState);
  updatedAt?.addEventListener("change", updateState);
  discard.addEventListener("click", () => {
    if (hasUnsavedChanges && !window.confirm("Discard your unsaved edits to this record?")) return;
    hasUnsavedChanges = false;
    selectRecord(record.kind, record.id);
  });
  save.addEventListener("click", async () => {
    const changed = changes();
    if (!Object.keys(changed).length) return;
    save.disabled = true;
    bar.setState("saving", "Saving…");
    message.textContent = "Saving content…";
    try {
      await recovery.flush();
      const savedVersion = recovery.version();
      await mutate(`/api/records/${record.kind}/${encodeURIComponent(record.id)}/content`, "PUT", {
        expectedRevision: record.revision,
        expectedSourceRevision: record.source.sourceRevision,
        fields: changed,
        ...(updatedAt ? { updatedAt: updatedAt.value } : {}),
      });
      hasUnsavedChanges = false;
      await recovery.clearAfterSave(savedVersion);
      await refresh();
    } catch (error) { message.textContent = error.message; message.className = "error"; updateState(); bar.setState("error", "Not saved"); }
  });
  return section;
}

function renderStructuredRecord(record) {
  const wrapper = document.createElement("div");
  wrapper.className = "structured-record record-workspace";
  const header = recordHeader({ kind: kindLabel(record.kind), title: record.title, status: record.status, translation: record.translation, path: record.source.path, queue: { kind: record.kind, id: record.id } });
  if (record.kind === "faq" || record.kind === "glossary-term") {
    const duplicate = el("button", "Duplicate as new");
    duplicate.type = "button";
    duplicate.className = "duplicate-record";
    duplicate.addEventListener("click", () => duplicateAsNew(record));
    header.append(duplicate);
  }
  wrapper.append(header);
  const value = record.value;
  if (record.kind === "faq") wrapper.append(el("p", value.summary, "record-summary"));
  if (record.kind === "residence-status") wrapper.append(el("p", value.summary, "record-summary"), el("p", value.purpose));
  if (record.kind === "glossary-term") {
    wrapper.append(el("p", `${value.japanese} · ${value.kana || "No kana"} · ${value.romaji || "No romaji"}`, "record-summary"),
      el("p", value.shortDefinition), el("p", value.detailedExplanation));
  }
  const sources = document.createElement("section");
  sources.append(el("h3", "Official sources"), sourceList(record.sources));
  sources.append(contentImpactPanel());
  if (record.kind === "faq") sources.append(el("p", "FAQs cite their related articles rather than declaring official sources directly. Review those articles and their source lists too.", "hint"));
  const related = document.createElement("section");
  related.append(el("h3", "Related articles"));
  const relatedArticleIds = value.relatedArticleIds || (value.articleId ? [value.articleId] : []);
  if (relatedArticleIds.length) {
    const links = document.createElement("ul");
    for (const articleId of relatedArticleIds) {
      const item = document.createElement("li");
      const button = el("button", articleId);
      button.type = "button";
      button.addEventListener("click", () => selectArticle(articleId));
      item.append(button);
      links.append(item);
    }
    related.append(links);
  } else related.append(el("p", "No related articles listed for this record.", "hint"));
  const full = document.createElement("details");
  full.open = false;
  full.append(el("summary", "Complete stored record"), el("pre", JSON.stringify(value, null, 2)));
  const file = document.createElement("dl");
  field(file, "Source file", record.source.path);
  field(file, "Editorial revision", record.revision);
  field(file, "Source file revision", record.source.sourceRevision);
  field(file, "Last reviewed", record.lastReviewedAt || "Not recorded");
  field(file, "Japanese translation", record.translation === "stale"
    ? "stale: the English fields changed after the Japanese artifact was made; hand it to the translation workflow"
    : record.translation);
  const editorial = structuredEditorialControls(record);
  editorial.id = "structured-editorial";
  const review = document.createElement("div");
  review.className = "review-layout";
  const controls = document.createElement("div");
  controls.className = "review-controls";
  controls.append(editorial);
  review.append(reviewContext({ content: structuredPreview(record, record.value, record.status), sources: record.sources }), controls);
  const fileDetails = document.createElement("div");
  fileDetails.append(file, full);
  wrapper.append(renderDetailTabs([
    ["content", "Edit", structuredContentEditor(record)],
    ["review", "Review & approve", review],
    ["linked", "Linked articles", related],
    ["sources", "Sources", sources],
    ["file", "Details", fileDetails],
  ], "Record sections", "record"));
  detail.replaceChildren(wrapper);
}

function editorialControls(article) {
  const { metadata, summary: record } = article;
  const section = document.createElement("section");
  section.className = "editorial-controls";
  section.append(el("h3", "Editorial status"));
  const statusLabel = labeledField("Change status", "article-status", helpText.status);
  const status = document.createElement("select");
  status.id = "article-status";
  for (const [value, label] of [["draft", "Draft"], ["needs-review", "Editorial review"], ["archived", "Archived"]]) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    status.append(option);
  }
  status.value = metadata.status === "verified" ? "needs-review" : metadata.status;
  const statusNote = el("p", metadata.status === "verified"
    ? "Changing a reviewed article preserves its historical approval record, but removes its current reviewed date. Choose Editorial review to revise and review it again."
    : "Status changes do not count as human approval. They remove any old reviewed date; historical approval records stay in Git.", "hint");
  const statusButton = el("button", "Save status");
  statusButton.type = "button";
  statusButton.disabled = metadata.status !== "verified";
  status.addEventListener("change", () => { statusButton.disabled = status.value === metadata.status; });
  const statusMessage = el("p", "", "hint");
  statusMessage.setAttribute("role", "status");
  statusButton.addEventListener("click", async () => {
    if (hasUnsavedChanges) { statusMessage.textContent = "Save or discard article body edits first."; statusMessage.className = "error"; return; }
    statusButton.disabled = true;
    try {
      noteGeneratedMetadata(await mutate(`/api/articles/${encodeURIComponent(metadata.id)}/status`, "PUT", { expectedRevision: record.revision, status: status.value }));
      await refresh();
      document.querySelector("#tab-review")?.click();
    } catch (error) { statusMessage.textContent = error.message; statusMessage.className = "error"; statusButton.disabled = false; }
  });
  section.append(statusLabel, status, statusNote, statusButton, statusMessage);

  if (metadata.status !== "needs-review") return section;
  const { form: review, date } = approvalForm({
    intro: "Read the saved article, its sources, and the checks beside this form, then approve this exact revision. This writes the verified status, review date, and an immutable approval record to the local checkout.",
    revision: record.editorialRevision || record.revision,
    ids: { date: "review-date", change: "review-change-note", validation: "review-validation", sources: "review-source-ids", approval: "review-approval-note" },
    kindName: "article",
    onSubmit: async (payload) => {
      const next = nextInQueue();
      const result = await mutate(`/api/articles/${encodeURIComponent(metadata.id)}/review`, "POST", { expectedRevision: record.revision, ...payload });
      noteGeneratedMetadata(result);
      await refresh();
      document.querySelector("#tab-review")?.click();
      approvalRecorded(document.querySelector("#panel-review .editorial-controls"), result.approvalRecord, next);
    },
  });
  date.min = metadata.updatedAt;
  section.append(review);
  return section;
}

function renderDetailTabs(tabs, label, prefix = "") {
  const tablist = document.createElement("div");
  tablist.className = "detail-tabs";
  tablist.setAttribute("role", "tablist");
  tablist.setAttribute("aria-label", label);
  const panels = [];
  const buttons = [];
  function activate(index, focus = false) {
    buttons.forEach((button, itemIndex) => {
      const active = itemIndex === index;
      button.setAttribute("aria-selected", String(active));
      button.tabIndex = active ? 0 : -1;
      panels[itemIndex].hidden = !active;
    });
    // Panels refresh state that may have changed while hidden, such as unsaved edits made in another tab.
    for (const form of panels[index].querySelectorAll("form")) form.dispatchEvent(new Event("panelshow"));
    if (focus) buttons[index].focus();
  }
  tabs.forEach(([key, title, content], index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.id = `${prefix ? `${prefix}-` : ""}tab-${key}`;
    button.setAttribute("role", "tab");
    button.setAttribute("aria-controls", `${prefix ? `${prefix}-` : ""}panel-${key}`);
    button.textContent = title;
    button.addEventListener("click", () => activate(index));
    button.addEventListener("keydown", (event) => {
      const next = event.key === "ArrowRight" ? (index + 1) % tabs.length
        : event.key === "ArrowLeft" ? (index + tabs.length - 1) % tabs.length
          : event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : null;
      if (next === null) return;
      event.preventDefault();
      activate(next, true);
    });
    const panel = document.createElement("section");
    panel.id = `${prefix ? `${prefix}-` : ""}panel-${key}`;
    panel.className = "detail-panel";
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("aria-labelledby", button.id);
    panel.tabIndex = 0;
    panel.append(content);
    buttons.push(button);
    panels.push(panel);
    tablist.append(button);
  });
  activate(0);
  const container = document.createElement("div");
  container.append(tablist, ...panels);
  return container;
}

function statusLabel(status) {
  return ({ draft: "Draft", "needs-review": "Editorial review", verified: "Reviewed", archived: "Archived" })[status] || status;
}

function kindLabel(kind) {
  return ({ article: "Article", faq: "FAQ", "residence-status": "Residence status", "glossary-term": "Glossary term" })[kind] || kind.replaceAll("-", " ");
}

// Revisions are 64-character hashes; the first 8 identify one in conversation, and the full value stays copyable.
function shortRevision(revision) {
  return revision && revision.length > 12 ? `${revision.slice(0, 8)}…` : revision || "unavailable";
}

// ---------- Review queue ----------
// The filtered and sorted list doubles as a queue: Previous and Next (or K and J) step through it from a record.

function queueNav(kind, id) {
  const index = currentMatches.findIndex((item) => item.kind === kind && item.id === id);
  if (index < 0 || currentMatches.length < 2) return null;
  const nav = document.createElement("nav");
  nav.className = "queue-nav";
  nav.setAttribute("aria-label", "Records in the current list");
  const previous = el("button", "Previous");
  previous.type = "button";
  previous.disabled = index === 0;
  previous.setAttribute("aria-keyshortcuts", "K");
  previous.title = "Previous record (K)";
  previous.addEventListener("click", () => stepQueue(-1));
  const next = el("button", "Next");
  next.type = "button";
  next.disabled = index === currentMatches.length - 1;
  next.setAttribute("aria-keyshortcuts", "J");
  next.title = "Next record (J)";
  next.addEventListener("click", () => stepQueue(1));
  nav.append(previous, el("span", `${index + 1} of ${currentMatches.length} in this list`, "queue-position"), next);
  return nav;
}

function stepQueue(direction) {
  const index = currentMatches.findIndex((item) => item.kind === selectedKind && item.id === selectedId);
  const target = currentMatches[index + direction];
  if (index >= 0 && target) selectRecord(target.kind, target.id);
}

// Shown in the record header while the editor holds edits that are not written to the file yet.
function markRecordUnsaved(unsaved) {
  const badges = detail.querySelector(".record-header .record-badges");
  if (!badges) return;
  let badge = badges.querySelector(".unsaved-badge");
  if (unsaved && !badge) badges.append(el("span", "Unsaved edits", "badge unsaved-badge"));
  else if (!unsaved) badge?.remove();
}

// The bar under every editor: what has happened to the edits, then the actions. It stays in view while the
// editor scrolls, so the save state and Save are never off screen.
function actionBar(actions, message) {
  const bar = document.createElement("div");
  bar.className = "action-bar";
  const state = el("p", "No unsaved edits", "save-state");
  state.dataset.state = "clean";
  bar.append(state, actions, message);
  return {
    bar,
    setState(kind, text) {
      state.dataset.state = kind;
      state.textContent = text;
    },
  };
}

function draftTime(snapshot) {
  const date = new Date(snapshot?.capturedAt || "");
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

// Checks from this CMS session that passed, newest first and one per check, for the approval form to offer.
function passedChecksThisSession() {
  if (!checkReport) return [];
  const seen = new Set();
  const passed = [];
  for (const run of [...checkReport.history].reverse()) {
    if (run.status !== "passed" || seen.has(run.id)) continue;
    seen.add(run.id);
    const definition = checkReport.definitions.find((item) => item.id === run.id);
    passed.push({ id: run.id, label: definition?.label || run.id, command: definition?.command || run.id, at: run.startedAt });
  }
  return passed;
}

// The reading half of the review screen: the saved content, its sources, and the checks run this session.
function reviewContext({ heading, content, sources }) {
  const context = document.createElement("section");
  context.className = "review-context";
  context.setAttribute("aria-label", "What you are approving");
  context.append(el("h3", "What you are approving"),
    el("p", "The saved version below is the revision the approval covers. Unsaved edits are not included.", "hint"));
  if (heading) context.append(heading);
  context.append(content);
  const sourceSection = document.createElement("section");
  sourceSection.className = "review-sources";
  sourceSection.append(el("h3", "Official sources"));
  if (sources.length) {
    const sourceItems = document.createElement("ul");
    for (const source of sources) {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = source.url || "#";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = source.title;
      item.append(link, el("small", [source.organization, source.lastCheckedAt ? `link checked ${formatDate(source.lastCheckedAt)}` : "link check not recorded"].filter(Boolean).join(" · ")));
      sourceItems.append(item);
    }
    sourceSection.append(sourceItems);
  } else sourceSection.append(el("p", "No official sources declared.", "hint"));
  const checks = document.createElement("section");
  checks.className = "review-checks";
  checks.append(el("h3", "Checks this session"));
  const runs = checkReport ? [...checkReport.history].reverse() : [];
  if (runs.length) {
    const runItems = document.createElement("ul");
    for (const run of runs.slice(0, 8)) {
      const name = checkReport.definitions.find((item) => item.id === run.id)?.label || run.id;
      runItems.append(el("li", `${name}: ${checkStateLabel(run.status)} · ${formatTime(run.startedAt)}`));
    }
    checks.append(runItems);
  } else checks.append(el("p", "No checks have run in this CMS session.", "hint"));
  context.append(sourceSection, checks);
  return context;
}

function checkStateLabel(status) {
  return ({ passed: "passed", warning: "review findings", failed: "failed", canceled: "canceled", running: "running" })[status] || status;
}

// One approval form for every kind. The button stays disabled until the confirmation is ticked and the editor
// holds no unsaved edits; checks that passed this session can be selected instead of retyped.
function approvalForm({ intro, revision, ids, kindName, onSubmit }) {
  const form = document.createElement("form");
  form.className = "review-form";
  const revisionLine = el("p", `Revision ${shortRevision(revision)}`, "revision-label");
  revisionLine.title = revision || "";
  const copy = el("button", "Copy full revision");
  copy.type = "button";
  copy.className = "quiet";
  copy.addEventListener("click", async () => {
    try {
      await window.navigator.clipboard.writeText(revision);
      copy.textContent = "Copied";
    } catch { copy.textContent = "Copy failed; select the revision in Details"; }
  });
  revisionLine.append(" ", copy);
  const unsavedNotice = el("p", "This record has unsaved edits in Edit. Save or discard them before approving; the approval covers the saved revision only.", "check-warning unsaved-notice");
  form.append(el("h3", "Mark reviewed"), el("p", intro, "hint"), revisionLine, unsavedNotice);
  function fieldInput(title, id, help, multiline = false) {
    const label = labeledField(title, id, help);
    const input = document.createElement(multiline ? "textarea" : "input");
    input.id = id;
    input.required = true;
    if (multiline) input.rows = 3;
    form.append(label, input);
    return input;
  }
  const date = fieldInput("Review date", ids.date, helpText.reviewDate);
  date.type = "date";
  const now = new Date();
  date.max = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  date.value = date.max;
  const change = fieldInput("What did you review or change?", ids.change, helpText.changeNote, true);
  const passed = passedChecksThisSession();
  const chips = [];
  if (passed.length) {
    const group = document.createElement("fieldset");
    group.className = "check-chips";
    group.append(el("legend", "Checks that passed in this session"));
    for (const run of passed) {
      const label = document.createElement("label");
      const box = document.createElement("input");
      box.type = "checkbox";
      box.value = `${run.label} passed (${run.command}) at ${formatTime(run.at)}`;
      label.append(box, ` ${run.label} · ${formatTime(run.at)}`);
      group.append(label);
      chips.push(box);
    }
    form.append(group);
  }
  const validation = fieldInput(passed.length ? "Other validation performed (one per line)" : "Validation performed (one check per line)",
    ids.validation, helpText.validation, true);
  if (!passed.length) {
    const hint = el("p", "No checks have passed in this CMS session. List the checks you ran, or run them on the Checks page first.", "hint");
    form.append(hint);
  }
  const syncValidationRequired = () => { validation.required = !chips.some((box) => box.checked); };
  for (const box of chips) box.addEventListener("change", syncValidationRequired);
  const sourceReviews = fieldInput("Resolved source review IDs (optional, one per line)", ids.sources, helpText.sourceReviews, true);
  sourceReviews.required = false;
  const approval = fieldInput("Approval note", ids.approval, helpText.approvalNote, true);
  const { row: checkLabel, check } = approvalField(`I reviewed and approve this exact ${kindName} revision.`);
  const button = el("button", "Mark reviewed and record approval");
  button.type = "submit";
  button.className = "primary";
  const message = el("p", "", "hint");
  message.setAttribute("role", "status");
  form.append(checkLabel, button, message);
  function sync() {
    unsavedNotice.hidden = !hasUnsavedChanges;
    button.disabled = !check.checked || hasUnsavedChanges;
  }
  check.addEventListener("change", sync);
  form.addEventListener("panelshow", sync);
  sync();
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (hasUnsavedChanges) { message.textContent = "Save or discard the edits in Edit first."; message.className = "error"; return; }
    if (!check.checked) { message.textContent = "Tick the confirmation to approve this revision."; message.className = "error"; return; }
    button.disabled = true;
    message.textContent = "Recording the approved revision…";
    message.className = "hint";
    try {
      await onSubmit({
        reviewedAt: date.value,
        changeNote: change.value,
        validationPerformed: [...chips.filter((box) => box.checked).map((box) => box.value),
          ...validation.value.split("\n").map((item) => item.trim()).filter(Boolean)],
        sourceReviewIds: sourceReviews.value.split("\n").map((item) => item.trim()).filter(Boolean),
        approvalNote: approval.value,
        explicitHumanApproval: check.checked,
      });
    } catch (error) { message.textContent = error.message; message.className = "error"; sync(); }
  });
  return { form, date };
}

// The record after the current one in the list, captured before an approval refreshes the list (an approved
// record can leave a filtered list, which would lose its position).
function nextInQueue() {
  const index = currentMatches.findIndex((item) => item.kind === selectedKind && item.id === selectedId);
  return index >= 0 ? currentMatches[index + 1] || null : null;
}

// After an approval, the confirmation names the file and offers the next record from the list.
function approvalRecorded(container, approvalRecord, next) {
  const done = document.createElement("div");
  done.className = "approval-done";
  done.append(el("p", `Approval recorded in ${approvalRecord}. Run npm run editorial:audit before committing.`, "success"));
  if (next) {
    const open = el("button", `Next: ${next.title}`);
    open.type = "button";
    open.className = "primary";
    open.addEventListener("click", () => selectRecord(next.kind, next.id));
    done.append(open);
  }
  container?.append(done);
}

// The same header for every record: what it is, its state, and where it lives, above the record's tabs.
function recordHeader({ kind, title, status, translation, path, extra = [], queue = null }) {
  const header = document.createElement("header");
  header.className = "record-header";
  const badges = document.createElement("p");
  badges.className = "record-badges";
  if (status) badges.append(el("span", statusLabel(status), `badge status-${status}`));
  if (translation) badges.append(el("span", `Japanese: ${translation}`, `badge ${translation === "current" ? "current" : translation === "stale" ? "stale" : ""}`.trim()));
  for (const item of extra) badges.append(item);
  const nav = queue ? queueNav(queue.kind, queue.id) : null;
  if (nav) header.append(nav);
  header.append(el("p", kind, "eyebrow"), el("h3", title), badges);
  if (path) header.append(el("p", path, "record-path"));
  return header;
}

function renderTabs(article) {
  const { metadata, summary: record } = article;
  const workspace = document.createElement("div");
  workspace.className = "record-workspace";
  const review = document.createElement("div");
  review.className = "review-layout";
  const controls = document.createElement("div");
  controls.className = "review-controls";
  controls.append(editorialControls(article));
  const saved = document.createElement("article");
  saved.className = "article-preview review-preview";
  const savedHeader = document.createElement("header");
  savedHeader.className = "preview-header";
  savedHeader.append(el("h3", metadata.title), el("p", metadata.description, "preview-description"));
  saved.append(savedHeader, renderArticleBlocks(article.blocks));
  review.append(reviewContext({ content: saved, sources: article.sources }), controls);
  workspace.append(recordHeader({ kind: "Article", title: metadata.title, status: metadata.status, translation: record.translation, path: record.path, queue: { kind: "article", id: metadata.id } }),
    renderDetailTabs([
      ["article", "Edit", articleView(article)],
      ["review", "Review & approve", review],
      ["linked", "Linked articles", linkedArticlesView(article)],
      ["sources", "Sources", sourcesView(article)],
      ["file", "Details", fileDetailsView(article)],
    ], "Article sections"));
  detail.replaceChildren(workspace);
}

async function selectArticle(id) {
  return selectRecord("article", id);
}

async function selectRecord(kind, id, options = {}) {
  if (hasUnsavedChanges && !window.confirm("Discard the unsaved content changes?")) return;
  cancelEditorPreview();
  hasUnsavedChanges = false;
  selectedId = id;
  selectedKind = kind;
  if (!options.keepPage) {
    showPage("content");
    setRoute(`content/${kind}/${encodeURIComponent(id)}`);
  }
  renderList();
  detail.replaceChildren(el("p", "Loading record…"));
  try {
    const record = await json(kind === "article" ? `/api/articles/${encodeURIComponent(id)}` : `/api/records/${kind}/${encodeURIComponent(id)}`);
    if (selectedId !== id || selectedKind !== kind) return;
    if (kind === "article") renderTabs(record);
    else renderStructuredRecord(record);
    // On narrow screens the workspace sits below the list; bring it into view when a record opens.
    if (!options.keepPage && window.matchMedia?.("(max-width: 750px)").matches) detail.scrollIntoView?.({ block: "start" });
    await loadContentImpact(kind, id);
  } catch (error) {
    detail.replaceChildren(el("p", error.message, "error"));
  }
}

function contentImpactPanel() {
  const section = document.createElement("section");
  section.className = "content-impact";
  section.append(el("h3", "Content-to-source impact"), el("p", "Loading source relationships…", "hint"));
  return section;
}

async function loadContentImpact(kind, id) {
  const panel = detail.querySelector(".content-impact");
  if (!panel) return;
  try {
    const result = await json(`/api/impact/content/${kind}/${encodeURIComponent(id)}`);
    if (selectedKind !== kind || selectedId !== id) return;
    const status = el("p", `Graph coverage: ${result.coverage}. ${result.note || "Declared sources are represented in the dependency graph."}`, result.coverage === "complete" ? "hint" : "check-warning");
    const list = document.createElement("ul");
    for (const source of result.sources) {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = source.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = `${source.title} (${source.id})`;
      item.append(link);
      list.append(item);
    }
    panel.replaceChildren(el("h3", "Content-to-source impact"), status,
      result.sources.length ? list : el("p", "No mapped official sources for this record."));
  } catch (error) { panel.replaceChildren(el("h3", "Content-to-source impact"), el("p", error.message, "error")); }
}

/** One changed file with its diff, loaded when the disclosure opens. */
function gitFileItem(path) {
  const item = document.createElement("li");
  const details = document.createElement("details");
  const summaryLine = el("summary", path);
  const body = el("pre", "Open to load the diff.");
  details.append(summaryLine, body);
  details.addEventListener("toggle", async () => {
    if (!details.open || details.dataset.loaded) return;
    body.textContent = "Loading diff…";
    try {
      const result = await json(`/api/git/diff?path=${encodeURIComponent(path)}`);
      body.textContent = result.diff || "No textual difference.";
      details.dataset.loaded = "true";
    } catch (error) {
      body.textContent = error.message;
    }
  });
  item.append(details);
  return item;
}

function gitGroup(heading, description, paths) {
  const group = document.createElement("section");
  group.append(el("h3", `${heading} (${paths.length})`), el("p", description, "hint"));
  if (paths.length) {
    const list = document.createElement("ul");
    list.className = "git-files";
    list.append(...paths.map(gitFileItem));
    // Long groups (often files that were dirty before the session) stay collapsed so the CMS's own edits stay visible.
    if (paths.length > 12) {
      const disclosure = document.createElement("details");
      disclosure.className = "git-file-group";
      disclosure.append(el("summary", `Show ${paths.length} files`), list);
      group.append(disclosure);
    } else group.append(list);
  } else group.append(el("p", "None."));
  return group;
}

function renderGit(report) {
  const container = document.querySelector("#git-status");
  const { identity } = report;
  lastGitReport = report;
  renderOverview();
  const facts = document.createElement("dl");
  field(facts, "Worktree", identity.worktree);
  field(facts, "Repository", identity.repository);
  field(facts, "Branch", report.currentBranch === identity.branch ? identity.branch : `${report.currentBranch} (session started on ${identity.branch})`);
  field(facts, "Starting commit", identity.startCommit);
  if (report.currentCommit !== identity.startCommit) field(facts, "Current commit", report.currentCommit);
  field(facts, "Session started", formatTime(identity.startedAt));
  const parts = [facts];
  if (report.currentBranch !== identity.branch || report.currentCommit !== identity.startCommit) {
    parts.push(el("p", "The branch or commit changed after the CMS started. Restart the CMS before saving so its snapshot matches the checkout.", "error"));
  }
  if (identity.dirtyAtStart.length) {
    parts.push(el("p", `${identity.dirtyAtStart.length} file(s) had uncommitted changes when the CMS started. The CMS will not write them; commit or set those changes aside and restart, or run the CMS from a separate worktree.`, "hint"));
  }
  parts.push(
    gitGroup("Changed by this CMS session", "Files the CMS wrote since it started. Review these diffs before committing.", report.cmsChanges),
    gitGroup("Already changed before this session", "Uncommitted work that existed when the CMS started. The CMS did not write these.", report.preexistingChanges),
    gitGroup("Changed outside the CMS during this session", "Another editor or agent changed these after the CMS started.", report.otherChanges),
  );
  const raw = document.createElement("details");
  raw.append(el("summary", "git status"), el("pre", report.status || "Clean working tree"));
  parts.push(raw);
  container.replaceChildren(...parts);
}

const impactSearch = document.querySelector("#impact-search");
const impactSource = document.querySelector("#impact-source");
const impactResult = document.querySelector("#impact-result");
const handoffStatus = document.querySelector("#handoff-status");
const handoffItems = document.querySelector("#handoff-items");
let impactCatalog;

function renderSelectedImpact() {
  if (!impactCatalog) return;
  const source = impactCatalog.sources.find((item) => item.id === impactSource.value);
  if (!source) {
    impactResult.replaceChildren(el("p", "Choose a source to see the articles, FAQs, terms, and guidance that depend on it.", "hint"));
    return;
  }
  const heading = el("h3", source.title);
  const identity = el("p", `${source.id} · ${source.organization || "Organization not recorded"}`, "hint");
  const link = document.createElement("a");
  link.href = source.url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "Open official source";
  const groups = document.createElement("div");
  groups.className = "impact-groups";
  const kinds = [...new Set(source.dependents.map((dependent) => dependent.kind))];
  for (const kind of kinds) {
    const group = document.createElement("section");
    group.append(el("h3", kindLabel(kind)));
    const list = document.createElement("ul");
    for (const dependent of source.dependents.filter((item) => item.kind === kind)) {
      const item = document.createElement("li");
      if (["article", "glossary-term", "residence-status"].includes(kind)) {
        const button = el("button", dependent.id);
        button.type = "button";
        button.addEventListener("click", () => selectRecord(kind, dependent.id));
        item.append(button);
      } else item.append(document.createTextNode(dependent.id));
      if (dependent.viaArticleIds.length) item.append(el("small", ` via ${dependent.viaArticleIds.join(", ")}`));
      list.append(item);
    }
    group.append(list);
    groups.append(group);
  }
  const findings = impactCatalog.findings.filter((item) => item.sourceId === source.id);
  impactResult.replaceChildren(heading, identity, ...(source.url ? [link] : []),
    el("p", impactCatalog.coverageNote, "hint"),
    source.dependents.length ? groups : el("p", "No dependents are represented for this source in the graph."),
    ...findings.map((finding) => el("p", `${finding.severity}: ${finding.message}`, finding.severity === "error" ? "error" : "check-warning")));
}

function renderImpactChoices() {
  if (!impactCatalog) return;
  const selected = impactSource.value;
  const query = impactSearch.value.trim().toLocaleLowerCase();
  const matches = impactCatalog.sources.filter((source) => `${source.title} ${source.id} ${source.organization}`.toLocaleLowerCase().includes(query));
  const shown = matches.slice(0, listPageSize);
  const current = matches.find((source) => source.id === selected);
  if (current && !shown.includes(current)) shown.unshift(current);
  const impactCount = document.querySelector("#impact-count");
  if (impactCount) impactCount.textContent = matches.length > shown.length
    ? `${matches.length} of ${impactCatalog.sources.length} sources match; the first ${shown.length} are listed. Search to narrow the list.`
    : `${matches.length} of ${impactCatalog.sources.length} sources match.`;
  const placeholder = el("option", query ? `Choose one of ${matches.length} matching sources` : "Choose a source");
  placeholder.value = "";
  impactSource.replaceChildren(placeholder, ...shown.map((source) => {
    const option = el("option", `${source.title} (${source.id})`);
    option.value = source.id;
    return option;
  }));
  if (query && matches.length === 1) impactSource.value = matches[0].id;
  if (matches.some((source) => source.id === selected)) impactSource.value = selected;
  renderSelectedImpact();
}

async function refreshImpact() {
  try {
    impactCatalog = await json("/api/impact/sources");
    renderImpactChoices();
  } catch (error) { impactResult.replaceChildren(el("p", error.message, "error")); }
}

async function refreshHandoff() {
  try {
    const handoff = await json("/api/translation-handoff");
    lastHandoff = handoff;
    renderOverview();
    const stale = handoff.items.filter((item) => item.state === "stale").length;
    const missing = handoff.items.filter((item) => item.state === "missing").length;
    handoffStatus.replaceChildren(el("p", `${stale} stale and ${missing} missing Japanese artifacts across supported CMS content kinds.${handoff.complete ? "" : " Catalog errors make this list incomplete."}`, handoff.complete ? "hint" : "error"),
      ...(handoff.failures || []).map((failure) => el("p", `${failure.path}: ${failure.error}`, "error")));
    handoffItems.replaceChildren(...handoff.items.map((item) => {
      const li = document.createElement("li");
      const button = el("button", `${item.kind.replaceAll("-", " ")} · ${item.title}`);
      button.type = "button";
      button.addEventListener("click", () => {
        if (item.kind === "local-guidance-supplement") {
          if (!openLocalGuidanceById(item.id)) handoffStatus.append(el("p", `Load the municipality guidance catalog before opening ${item.id}.`, "error"));
          return;
        }
        selectRecord(item.kind, item.id);
      });
      li.append(button, el("small", ` ${item.state} · ${item.path} · English revision ${item.sourceRevision}`));
      return li;
    }));
    if (!handoff.items.length) handoffItems.append(el("li", "Every Japanese artifact is current for the supported catalogs.", "success"));
    document.querySelector("#handoff-download")?.toggleAttribute("hidden", !handoff.items.length);
  } catch (error) { handoffStatus.replaceChildren(el("p", error.message, "error")); }
}

impactSearch.addEventListener("input", renderImpactChoices);
impactSource.addEventListener("change", renderSelectedImpact);

const checkKind = document.querySelector("#check-kind");
const checkStart = document.querySelector("#check-start");
const checkCancel = document.querySelector("#check-cancel");
const checkCommand = document.querySelector("#check-command");
const checkStatus = document.querySelector("#check-status");
const checkSteps = document.querySelector("#check-steps");
const checkOutput = document.querySelector("#check-output");
let checkReport;
let checkPollTimer;

function checkDuration(milliseconds) {
  return `${(milliseconds / 1000).toFixed(1)} s`;
}

function renderChecks(report) {
  checkReport = report;
  const selectedId = checkKind.value;
  const currentIds = [...checkKind.options].map((option) => option.value).join("\0");
  const incomingIds = report.definitions.map((definition) => definition.id).join("\0");
  if (currentIds !== incomingIds) {
    checkKind.replaceChildren(...report.definitions.map((definition) => {
      const option = el("option", definition.label);
      option.value = definition.id;
      return option;
    }));
  }
  if (report.definitions.some((definition) => definition.id === selectedId)) checkKind.value = selectedId;
  const definition = report.definitions.find((item) => item.id === checkKind.value);
  if (definition) {
    const command = document.createElement("details");
    command.className = "check-command-detail";
    command.append(el("summary", "Command"), el("code", definition.command));
    checkCommand.replaceChildren(el("p", `${definition.description || definition.label}. ${definition.scope === "focused" ? "Focused check: it covers only the named paths." : "Project check."}`), command);
  } else checkCommand.replaceChildren(el("p", "No checks available."));
  const running = report.active?.status === "running";
  checkStart.disabled = running || !definition;
  checkCancel.hidden = !running;
  checkCancel.disabled = Boolean(report.active?.cancelRequested);
  const run = report.active && (running || report.active.id === checkKind.value)
    ? report.active : report.history.find((item) => item.id === checkKind.value);
  if (!run) {
    checkStatus.textContent = running ? "A check is running." : "No result for this check in this CMS session.";
    checkStatus.className = "";
    checkSteps.replaceChildren();
    checkOutput.textContent = "No output yet.";
    return;
  }
  const name = report.definitions.find((item) => item.id === run.id)?.label || run.id;
  const state = run.cancelRequested && running ? "Canceling" : run.status === "running" ? "Running" : run.status === "passed" ? "Passed"
    : run.status === "warning" ? "Review findings" : run.status === "canceled" ? "Canceled" : "Failed";
  const exit = run.exitCode === undefined || run.exitCode === null ? "" : ` · exit ${run.exitCode}`;
  checkStatus.textContent = `${state}: ${name} · ${checkDuration(run.durationMs)}${exit}. ${run.status === "passed" ? "Only this named check passed." : ""}`;
  checkStatus.className = run.status === "failed" ? "error" : run.status === "warning" ? "check-warning" : run.status === "passed" ? "success" : "";
  checkSteps.replaceChildren(...(run.steps || []).map((step) => el("li", `${step.label}: ${step.status} · ${checkDuration(step.durationMs)}${step.exitCode === undefined || step.exitCode === null ? "" : ` · exit ${step.exitCode}`}`)));
  checkOutput.textContent = `${run.output || "No output yet."}${run.outputTruncated ? "\n[Earlier output was truncated.]" : ""}`;
}

function scheduleCheckPoll(report) {
  clearTimeout(checkPollTimer);
  if (report.active?.status === "running") checkPollTimer = setTimeout(refreshChecks, 1000);
}

async function refreshChecks() {
  try {
    const report = await json("/api/checks");
    renderChecks(report);
    scheduleCheckPoll(report);
    if (report.active && report.active.status !== "running") refreshActivity();
  } catch (error) {
    checkStatus.textContent = error.message;
    checkStatus.className = "error";
  }
}

checkKind.addEventListener("change", () => { if (checkReport) renderChecks(checkReport); });
checkStart.addEventListener("click", async () => {
  checkStart.disabled = true;
  checkStatus.textContent = "Starting the selected check…";
  try {
    const report = await mutate("/api/checks/start", "POST", { id: checkKind.value });
    renderChecks(report);
    scheduleCheckPoll(report);
    refreshActivity();
  } catch (error) {
    checkStatus.textContent = error.message;
    checkStatus.className = "error";
    checkStart.disabled = false;
  }
});
checkCancel.addEventListener("click", async () => {
  checkCancel.disabled = true;
  try {
    const report = await mutate("/api/checks/cancel", "POST", {});
    renderChecks(report);
    scheduleCheckPoll(report);
    refreshActivity();
  } catch (error) {
    checkStatus.textContent = error.message;
    checkStatus.className = "error";
  } finally {
    checkCancel.disabled = false;
  }
});

async function refresh() {
  if ((hasUnsavedChanges || localGuidanceUnsaved) && !window.confirm("Discard unsaved content changes and refresh?")) return;
  hasUnsavedChanges = false;
  localGuidanceUnsaved = false;
  try {
    const [catalog, structured] = await Promise.all([json("/api/articles"), json("/api/records")]);
    articles = [...catalog.articles.map((item) => ({ ...item, kind: "article" })), ...structured.records];
    summary.replaceChildren(
      summaryLink(`${articles.length} reviewable records`, "content", () => setContentFilters({})),
      summaryLink(`${articles.filter((item) => item.status === "needs-review").length} need editorial review`, "content", () => setContentFilters({ status: "needs-review", order: "oldest-review" })),
      summaryLink(`${articles.filter((item) => item.translation === "stale").length} stale Japanese translations`, "translations"),
      summaryLink(`${catalog.failures.length + structured.failures.length} catalog errors`, "overview", () => document.querySelector("#errors-heading")?.scrollIntoView?.()),
    );
    const allFailures = [...catalog.failures, ...structured.failures];
    catalogFailureCount = allFailures.length;
    dataRefreshedAt = new Date();
    renderOverview();
    failures.replaceChildren(...(allFailures.length
      ? allFailures.map((item) => el("p", `${item.path}: ${item.error}`, "error"))
      : [el("p", "No catalog parse errors.")]));
    renderGroupFilter();
    renderList();
    if (selectedId) await selectRecord(selectedKind, selectedId, { keepPage: true });
    renderGit(await json("/api/git"));
    await refreshGeneratedMetadata();
    await Promise.all([refreshImpact(), refreshHandoff()]);
    await refreshReferences();
    await refreshLocalGuidance();
    await Promise.all([refreshRecoveryList(), refreshActivity()]);
  } catch (error) {
    summary.replaceChildren(el("p", error.message, "error"));
  }
}

const resetContentList = () => { contentListLimit = listPageSize; renderList(); };
const resetReferenceList = () => { referenceListLimit = listPageSize; renderReferenceList(); };
search.addEventListener("input", resetContentList);
statusFilter.addEventListener("change", resetContentList);
sortOrder?.addEventListener("change", resetContentList);
kindFilter.addEventListener("change", () => { groupFilter.value = ""; renderGroupFilter(); resetContentList(); });
groupFilter.addEventListener("change", resetContentList);
referenceSearch?.addEventListener("input", resetReferenceList);
referenceKind?.addEventListener("change", resetReferenceList);
localGuidanceSearch?.addEventListener("input", renderLocalGuidanceList);
document.querySelector("#local-guidance-issues-only")?.addEventListener("change", () => renderLocalGuidanceMatrix(localGuidanceGuides));
localGuidanceLocation?.addEventListener("change", () => {
  if (localGuidanceUnsaved && !window.confirm("Discard unsaved municipality guidance changes?")) {
    localGuidanceLocation.value = localGuidanceDetailRecord?.locationId || "";
    return;
  }
  localGuidanceUnsaved = false;
  selectedLocalGuidanceId = null;
  localGuidanceDetailRecord = null;
  localGuidanceDetail.replaceChildren(el("p", "Select a guide to inspect or edit its English guidance."));
  renderLocalGuidanceList();
});
// ---------- Creating records ----------
// New FAQs and glossary terms are appended to their canonical module. The form previews the exact text and file first;
// Create is available only for the previewed fields, and the server rechecks everything.

let creationOptionsCache = null;

async function loadCreationOptions() {
  creationOptionsCache ??= await json("/api/create/options");
  return creationOptionsCache;
}

const creationKindLabels = { article: "article", faq: "FAQ", "glossary-term": "glossary term", source: "official source" };
const creationArticles = { article: "an", faq: "a", "glossary-term": "a", source: "an" };

function creationTextField(form, { key, label, help, value = "", multiline = false, required = false }) {
  const id = `create-${key}`;
  const input = document.createElement(multiline ? "textarea" : "input");
  input.id = id;
  input.dataset.createField = key;
  if (!multiline) input.type = "text";
  if (multiline) input.rows = 3;
  input.value = value || "";
  input.required = required;
  form.append(labeledField(`${label}${required ? "" : " (optional)"}`, id, help), input);
  return input;
}

// Taxonomy IDs read as words in the interface: "living-in-japan" becomes "Living in Japan".
function humanize(value) {
  const text = String(value).replaceAll("-", " ").replace(/\bjapan\b/g, "Japan").replace(/\bjapanese\b/g, "Japanese");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function slugifyId(text) {
  return text.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}

// The ID follows the field it is derived from until the editor types an ID of their own.
function linkDerivedId(idInput, from) {
  let own = Boolean(idInput.value);
  idInput.addEventListener("input", () => { own = idInput.value.trim() !== ""; });
  from.addEventListener("input", () => { if (!own) idInput.value = slugifyId(from.value); });
}

// Optional relationships and search terms fold away so the required fields come first.
function optionalGroup(form, title) {
  const group = document.createElement("details");
  group.className = "create-optional";
  group.append(el("summary", title));
  form.append(group);
  return group;
}

function creationSelectField(form, { key, label, help, options, value }) {
  const id = `create-${key}`;
  const select = document.createElement("select");
  select.id = id;
  select.dataset.createField = key;
  for (const [optionValue, optionLabel] of options) {
    const option = el("option", optionLabel);
    option.value = optionValue;
    select.append(option);
  }
  if (value !== undefined) select.value = value;
  form.append(labeledField(label, id, help), select);
  return select;
}

// A one-per-line list of IDs with a searchable helper that appends a known ID.
function creationIdListField(form, { key, label, help, values = [], known = null }) {
  const id = `create-${key}`;
  const textarea = document.createElement("textarea");
  textarea.id = id;
  textarea.rows = Math.max(2, Math.min(values.length + 1, 6));
  textarea.dataset.createList = key;
  textarea.value = values.join("\n");
  form.append(labeledField(`${label} (one per line)`, id, help), textarea);
  if (known?.length) {
    const listId = `${id}-known`;
    const datalist = document.createElement("datalist");
    datalist.id = listId;
    datalist.append(...known.map((item) => { const option = document.createElement("option"); option.value = item; return option; }));
    const finder = document.createElement("div");
    finder.className = "create-id-finder";
    const search = document.createElement("input");
    search.type = "text";
    search.setAttribute("list", listId);
    search.setAttribute("aria-label", `Find a known ID to add to ${label.toLocaleLowerCase()}`);
    search.placeholder = "Type to find a known ID";
    const add = el("button", "Add");
    add.type = "button";
    add.setAttribute("aria-label", `Add to ${label.toLocaleLowerCase()}`);
    add.addEventListener("click", () => {
      const value = search.value.trim();
      if (!value) return;
      const lines = textarea.value.split("\n").map((line) => line.trim()).filter(Boolean);
      if (!lines.includes(value)) textarea.value = [...lines, value].join("\n");
      search.value = "";
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
      search.focus();
    });
    finder.append(search, add, datalist);
    form.append(finder);
  }
  return textarea;
}

function creationCheckboxes(form, { key, label, help, options, values = [] }) {
  const fieldset = document.createElement("fieldset");
  fieldset.className = "create-checkboxes";
  fieldset.dataset.createList = key;
  const legend = document.createElement("legend");
  legend.append(el("span", label), helpDisclosure(label, help));
  fieldset.append(legend);
  for (const option of options) {
    const wrapper = document.createElement("label");
    const box = document.createElement("input");
    box.type = "checkbox";
    box.value = option;
    box.checked = values.includes(option);
    wrapper.append(box, document.createTextNode(` ${humanize(option)}`));
    fieldset.append(wrapper);
  }
  form.append(fieldset);
  return fieldset;
}

function creationFields(form) {
  const fields = {};
  for (const input of form.querySelectorAll("[data-create-field]")) {
    if (input.value.trim() || input.required) fields[input.dataset.createField] = input.value;
  }
  for (const list of form.querySelectorAll("[data-create-list]")) {
    const values = list.tagName === "FIELDSET"
      ? [...list.querySelectorAll("input[type='checkbox']:checked")].map((box) => box.value)
      : list.value.split("\n").map((line) => line.trim()).filter(Boolean);
    if (values.length) fields[list.dataset.createList] = values;
  }
  const relationships = [...form.querySelectorAll("[data-relationship-type]")].flatMap((list) =>
    list.value.split("\n").map((line) => line.trim()).filter(Boolean).map((articleId) => ({ type: list.dataset.relationshipType, articleId })));
  if (relationships.length) fields.relationships = relationships;
  return fields;
}

async function openCreateForm(kind, prefill = null, options = {}) {
  if (hasUnsavedChanges && !window.confirm("Discard the unsaved content changes?")) return;
  cancelEditorPreview();
  hasUnsavedChanges = false;
  selectedId = null;
  // Sources are created from the Sources page; everything else from Content.
  const page = kind === "source" ? "sources" : "content";
  const container = kind === "source" ? referenceDetail : detail;
  if (!options.keepPage) {
    showPage(page);
    setRoute(`${page}/new/${kind}`);
  }
  if (kind !== "source") renderList();
  container.replaceChildren(el("p", "Loading the creation form…"));
  let choices;
  try { choices = await loadCreationOptions(); }
  catch (error) { container.replaceChildren(el("p", error.message, "error")); return; }
  const value = prefill || {};
  const workspace = document.createElement("div");
  workspace.className = "record-workspace create-record";
  workspace.dataset.createKind = kind;
  const header = document.createElement("header");
  header.className = "record-header";
  header.append(el("p", prefill ? `New ${creationKindLabels[kind]} · duplicated from ${prefill.duplicatedFrom}` : `New ${creationKindLabels[kind]}`, "eyebrow"),
    el("h3", `Create ${creationArticles[kind]} ${creationKindLabels[kind]}`),
    el("p", kind === "article"
      ? "The CMS creates the article's MDX file and registers it in the chosen registry module, together. A new article starts as Draft or Editorial review, has no Japanese translation yet, and needs its own review before approval."
      : kind === "source"
        ? "The CMS appends one entry to the chosen source module. A new source can be cited right away; source monitoring checks it on its next run. It appears in the reference catalogs after the CMS restarts."
        : "The CMS appends one entry to the canonical module shown in the preview. A new record starts as Draft or Editorial review, has no Japanese translation yet, and needs its own review before approval.", "hint"));
  const form = document.createElement("form");
  form.className = "structured-editor create-form";
  form.noValidate = true;
  const statusOptions = [["needs-review", "Editorial review"], ["draft", "Draft"]];
  if (kind === "faq") {
    const question = creationTextField(form, { key: "question", label: "Question", required: true, value: value.question, help: "The question as a reader would ask it." });
    const id = creationTextField(form, { key: "id", label: "ID", required: true, value: value.id, help: "A permanent identifier: lowercase words separated by hyphens. It is filled from the question until you change it. Other records link to it, so choose it carefully." });
    linkDerivedId(id, question);
    creationTextField(form, { key: "slug", label: "Slug", value: value.slug, help: "The URL part. Leave empty to use the ID." });
    creationTextField(form, { key: "summary", label: "Answer summary", required: true, multiline: true, value: value.summary, help: "A short answer of up to 320 characters that points to the linked resources for details." });
    creationSelectField(form, { key: "primaryBrowseGroupId", label: "Browse group", value: value.primaryBrowseGroupId, options: choices.faqGroups.map(({ id, label }) => [id, label]), help: "The FAQ group this question belongs to. It also decides which module the entry is added to." });
    creationSelectField(form, { key: "status", label: "Initial status", value: value.status || "needs-review", options: statusOptions, help: "Draft for incomplete work; Editorial review when it is ready to be checked. Approval is a separate step." });
    form.append(el("p", "Link at least one related resource: an article here, or a group, journey, term, status, or activity below.", "hint"));
    creationIdListField(form, { key: "relatedArticleIds", label: "Related articles", values: value.relatedArticleIds, known: choices.known.articles, help: "Article IDs this answer relies on." });
    const more = optionalGroup(form, "Other related resources and search terms");
    creationIdListField(more, { key: "relatedGroupIds", label: "Related article groups", values: value.relatedGroupIds, known: choices.known.groups, help: "Article group IDs." });
    creationIdListField(more, { key: "relatedJourneyIds", label: "Related guided journeys", values: value.relatedJourneyIds, known: choices.known.journeys, help: "Guided journey IDs." });
    creationIdListField(more, { key: "relatedGlossaryTermIds", label: "Related glossary terms", values: value.relatedGlossaryTermIds, known: choices.known.glossaryTerms, help: "Glossary term IDs." });
    creationIdListField(more, { key: "relatedResidenceStatusIds", label: "Related residence statuses", values: value.relatedResidenceStatusIds, known: choices.known.residenceStatuses, help: "Residence status IDs." });
    creationIdListField(more, { key: "relatedActivityIds", label: "Related activities", values: value.relatedActivityIds, known: choices.known.activities, help: "Activity cross-reference IDs." });
    creationIdListField(more, { key: "searchTerms", label: "Search terms", values: value.searchTerms, help: "Phrases readers might search for." });
  } else if (kind === "article") {
    const article = choices.article;
    const title = creationTextField(form, { key: "title", label: "Title", required: true, value: value.title, help: "The article's heading." });
    const id = creationTextField(form, { key: "id", label: "ID", required: true, value: value.id, help: "A permanent identifier and file name: lowercase words separated by hyphens. It is filled from the title until you change it. Other records link to it." });
    linkDerivedId(id, title);
    creationTextField(form, { key: "slug", label: "Slug", value: value.slug, help: "The URL part. Leave empty to use the ID." });
    creationTextField(form, { key: "description", label: "Description", required: true, multiline: true, value: value.description, help: "A summary of up to 180 characters for lists and search results." });
    creationSelectField(form, { key: "family", label: "Registry family", value: value.family || article.registryFamilies[0], options: article.registryFamilies.map((family) => [family, humanize(family)]), help: "The article registry module the new article is registered in. It sets the article's place in the catalog order." });
    creationCheckboxes(form, { key: "journeyStageIds", label: "Journey stages", values: value.journeyStageIds, options: article.journeyStages, help: "At least one: when readers need this article." });
    creationCheckboxes(form, { key: "topicIds", label: "Topics", values: value.topicIds, options: article.topics, help: "At least one topic." });
    creationCheckboxes(form, { key: "geographicScopes", label: "Geographic scope", values: value.geographicScopes || ["national"], options: article.geographicScopes, help: "At least one: whether the rules are national, prefectural, or municipal." });
    creationSelectField(form, { key: "importance", label: "Importance", value: value.importance || "informational", options: article.importance.map((item) => [item, humanize(item)]), help: "How much a reader's situation depends on this guidance." });
    creationSelectField(form, { key: "contentType", label: "Content type", value: value.contentType || "guide", options: article.contentTypes.map((item) => [item, humanize(item)]), help: "The kind of article." });
    creationSelectField(form, { key: "status", label: "Initial status", value: value.status || "draft", options: [["draft", "Draft"], ["needs-review", "Editorial review"]], help: "Draft for incomplete work; Editorial review when it is ready to be checked. Approval is a separate step." });
    creationIdListField(form, { key: "sourceIds", label: "Official sources", values: value.sourceIds, known: choices.known.sources, help: "Source IDs the article relies on. Create a missing source first from Sources & references." });
    const more = optionalGroup(form, "Audiences, terms, statuses, related articles, and search terms (optional)");
    creationCheckboxes(more, { key: "audienceIds", label: "Audiences", values: value.audienceIds, options: article.audiences, help: "Readers the article is written for, if it is narrower than everyone." });
    creationIdListField(more, { key: "termIds", label: "Glossary terms", values: value.termIds, known: choices.known.glossaryTerms, help: "Glossary term IDs the article uses." });
    creationIdListField(more, { key: "residenceStatusIds", label: "Residence statuses", values: value.residenceStatusIds, known: choices.known.residenceStatuses, help: "Residence status IDs the article covers." });
    for (const type of article.relationshipTypes) {
      const label = { related: "Related articles", prerequisite: "Prerequisite articles", "next-step": "Next-step articles" }[type] || type;
      const field = creationIdListField(more, { key: `relationships-${type}`, label, values: (value.relationships || []).filter((item) => item.type === type).map((item) => item.articleId), known: choices.known.articles, help: "Article IDs linked from this article." });
      delete field.dataset.createList;
      field.dataset.relationshipType = type;
    }
    creationIdListField(more, { key: "searchTerms", label: "Search terms", values: value.searchTerms, help: "Phrases readers might search for." });
    const body = creationTextField(form, { key: "body", label: "Body (MDX)", required: true, multiline: true, value: value.body || "## First section\n\nWrite the guide here, and cite the official sources listed above.", help: "The article body in the supported Markdown and component subset. Refine it later in the formatted editor." });
    body.rows = 10;
    body.classList.add("create-body");
  } else if (kind === "source") {
    creationSelectField(form, { key: "family", label: "Source family", value: value.family || choices.sourceFamilies[0], options: choices.sourceFamilies.map((family) => [family, humanize(family)]), help: "The subject module under src/data/sources the source is added to." });
    creationTextField(form, { key: "organization", label: "Organization", required: true, value: value.organization, help: "The public body that publishes the page." });
    creationTextField(form, { key: "title", label: "Page title", required: true, value: value.title, help: "The page or document title as published." });
    creationTextField(form, { key: "url", label: "URL", required: true, value: value.url, help: "The official https address." });
    creationTextField(form, { key: "id", label: "ID", required: true, value: value.id, help: "A permanent identifier, usually the organization and page: lowercase words separated by hyphens." });
    creationSelectField(form, { key: "authorityLevel", label: "Authority", value: value.authorityLevel || "national-government", options: choices.authorityLevels.map((item) => [item, humanize(item)]), help: "The level of government or public institution that publishes it." });
    creationSelectField(form, { key: "language", label: "Language", value: value.language || "ja", options: choices.sourceLanguages.map((item) => [item, item === "ja" ? "Japanese" : "English"]), help: "The page's language." });
    creationSelectField(form, { key: "checkMethod", label: "Link check method", value: value.checkMethod || "", options: [["", "Default (automated)"], ...choices.checkMethods.map((item) => [item, humanize(item)])], help: "Use manual when automated reachability checks cannot load the page." });
  } else {
    creationTextField(form, { key: "japanese", label: "Japanese term", required: true, value: value.japanese, help: "The term as written in Japanese." });
    creationTextField(form, { key: "kana", label: "Kana reading", value: value.kana, help: "The reading in hiragana or katakana." });
    const romaji = creationTextField(form, { key: "romaji", label: "Romaji", value: value.romaji, help: "The romanized reading, with macrons where used." });
    const id = creationTextField(form, { key: "id", label: "ID", required: true, value: value.id, help: "A permanent identifier, usually the romanized term: lowercase words separated by hyphens. It is filled from the romaji until you change it." });
    linkDerivedId(id, romaji);
    creationTextField(form, { key: "slug", label: "Slug", value: value.slug, help: "The URL part. Leave empty to use the ID." });
    creationTextField(form, { key: "englishName", label: "English name", required: true, value: value.englishName, help: "The English name readers will see." });
    creationTextField(form, { key: "shortDefinition", label: "Short definition", required: true, multiline: true, value: value.shortDefinition, help: "One sentence defining the term." });
    creationTextField(form, { key: "detailedExplanation", label: "Detailed explanation", required: true, multiline: true, value: value.detailedExplanation, help: "What the term means in practice, and its limits." });
    creationTextField(form, { key: "commonContext", label: "Where it appears", required: true, multiline: true, value: value.commonContext, help: "Where readers are likely to meet the term." });
    creationCheckboxes(form, { key: "topicIds", label: "Topics", values: value.topicIds, options: choices.topics, help: "At least one. The primary topic decides which module the entry is added to." });
    creationSelectField(form, { key: "primaryBrowseGroupId", label: "Primary topic", value: value.primaryBrowseGroupId || "", options: [["", "First selected topic"], ...choices.topics.map((topic) => [topic, humanize(topic)])], help: "The topic the term is browsed under. It must also be selected above." });
    creationCheckboxes(form, { key: "journeyStageIds", label: "Journey stages", values: value.journeyStageIds, options: choices.journeyStages, help: "When readers are likely to need the term." });
    creationSelectField(form, { key: "status", label: "Initial status", value: value.status || "needs-review", options: statusOptions, help: "Draft for incomplete work; Editorial review when it is ready to be checked. Approval is a separate step." });
    creationIdListField(form, { key: "relatedArticleIds", label: "Related articles", values: value.relatedArticleIds, known: choices.known.articles, help: "Article IDs that explain the term in context." });
    creationIdListField(form, { key: "sourceIds", label: "Official sources", values: value.sourceIds, known: choices.known.sources, help: "Official source IDs that support the definition." });
    const more = optionalGroup(form, "Related terms and search terms (optional)");
    creationIdListField(more, { key: "relatedTermIds", label: "Related glossary terms", values: value.relatedTermIds, known: choices.known.glossaryTerms, help: "Other glossary term IDs." });
    creationIdListField(more, { key: "searchTerms", label: "Search terms", values: value.searchTerms, help: "Phrases readers might search for." });
  }
  const preview = document.createElement("section");
  preview.className = "create-preview";
  preview.hidden = true;
  const actions = document.createElement("div");
  actions.className = "edit-actions";
  const previewButton = el("button", "Preview addition");
  previewButton.type = "button";
  const createButton = el("button", `Create ${creationKindLabels[kind]}`);
  createButton.type = "submit";
  createButton.className = "primary";
  createButton.disabled = true;
  const cancelButton = el("button", "Cancel");
  cancelButton.type = "button";
  cancelButton.addEventListener("click", () => {
    if (hasUnsavedChanges && !window.confirm(`Discard this new ${creationKindLabels[kind]}?`)) return;
    hasUnsavedChanges = false;
    container.replaceChildren(el("p", kind === "source" ? "Select a reference record to inspect its details." : "Select a record to edit its content, review it, or inspect its links, sources, and file details.", "empty-state"));
    setRoute(page);
  });
  actions.append(previewButton, createButton, cancelButton);
  const status = el("p", "Preview the addition to see the exact file and text before creating.", "hint");
  status.setAttribute("role", "status");
  status.tabIndex = -1;
  form.append(preview, actions, status);
  let plan = null;
  let planned = "";
  const invalidate = () => {
    hasUnsavedChanges = true;
    if (!plan) return;
    plan = null;
    createButton.disabled = true;
    status.textContent = "The fields changed after the preview. Preview again before creating.";
    status.className = "hint";
  };
  form.addEventListener("input", invalidate);
  form.addEventListener("change", invalidate);
  previewButton.addEventListener("click", async () => {
    const fields = creationFields(form);
    previewButton.disabled = true;
    status.textContent = "Checking the new record…";
    status.className = "hint";
    try {
      plan = await mutate(`/api/create/${kind}/preview`, "POST", { fields });
      planned = JSON.stringify(fields);
      preview.replaceChildren(el("h4", "Proposed addition"), ...(kind === "article" ? [
        el("p", `Creates ${plan.mdxPath}:`, "hint"), el("pre", plan.mdxText),
        el("p", `Adds this import and registration entry to ${plan.registryPath}:`, "hint"), el("pre", `${plan.importLine}\n…\n${plan.entryLine}`),
      ] : [
        el("p", `Adds the entry below to ${plan.path}, starting at line ${plan.line}.`, "hint"),
        el("pre", plan.insertion.replace(/^,?\r?\n/, "")),
      ]), ...(plan.warnings || []).map((warning) => el("p", warning, "check-warning")),
      el("p", "Nothing is written until you select Create.", "hint"));
      preview.hidden = false;
      createButton.disabled = false;
      status.textContent = "The record passed validation. Review the text, then create it.";
      status.className = "success";
    } catch (error) {
      plan = null;
      createButton.disabled = true;
      preview.hidden = true;
      status.textContent = error.message;
      status.className = "error";
      status.focus?.();
    } finally { previewButton.disabled = false; }
  });
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const fields = creationFields(form);
    if (!plan || JSON.stringify(fields) !== planned) { status.textContent = "Preview the addition before creating."; status.className = "error"; return; }
    createButton.disabled = true;
    status.textContent = `Creating the ${creationKindLabels[kind]}…`;
    try {
      const result = await mutate(`/api/create/${kind}`, "POST", { fields, expectedSourceRevision: kind === "article" ? plan.registrySourceRevision : plan.sourceRevision });
      noteGeneratedMetadata(result);
      hasUnsavedChanges = false;
      creationOptionsCache = null;
      if (kind === "source") {
        const another = el("button", "Create another source");
        another.type = "button";
        another.addEventListener("click", () => openCreateForm("source"));
        container.replaceChildren(el("h3", "Official source created"),
          el("p", `Added ${result.id} to ${result.path}. New records can cite it now; it appears in the reference catalogs after the CMS restarts. Source monitoring checks it on its next run.`, "success"), another);
        await refresh();
        return;
      }
      await refresh();
      await selectRecord(kind, result.id);
      document.querySelector("#article-detail .record-header")?.append(el("p", kind === "article"
        ? `Created ${result.path} and registered it in ${result.registryPath}. Add it to an article group or guided journey in code if it belongs on those pages.`
        : `Created in ${result.path}. Review it, then run the relevant checks before committing.`, "success"));
    } catch (error) {
      status.textContent = error.message;
      status.className = "error";
      createButton.disabled = false;
    }
  });
  workspace.append(header, form);
  container.replaceChildren(workspace);
  form.querySelector("input, textarea, select")?.focus?.();
}

// Copies an existing record's content into a new form with a fresh ID and no review data.
function duplicateAsNew(record) {
  const value = { ...record.value };
  for (const key of ["lastReviewedAt", "createdAt", "updatedAt", "slug"]) delete value[key];
  value.id = `${record.id}-copy`;
  value.status = "needs-review";
  value.duplicatedFrom = record.id;
  return openCreateForm(record.kind, value);
}

// ---------- Pages ----------
// One page per workspace area, addressed by the URL hash (#/content, #/content/faq/<id>) so pages can be
// bookmarked and the Back button works. Switching pages only hides the others, so unsaved edits survive.

const pageTitles = {
  overview: "Overview", content: "Content", guidance: "Municipality guidance", sources: "Sources & references",
  translations: "Translations", checks: "Checks", changes: "Changes", activity: "Activity",
};
let currentPage = null;

function showPage(name, { focus = false } = {}) {
  const page = pageTitles[name] ? name : "overview";
  if (page !== currentPage) {
    for (const section of document.querySelectorAll("main > .page")) section.hidden = section.dataset.page !== page;
    for (const link of document.querySelectorAll("[data-page-link]")) {
      if (link.dataset.pageLink === page) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    }
    const heading = document.querySelector("#page-heading");
    if (heading) heading.textContent = pageTitles[page];
    document.title = `${pageTitles[page]} · Nihonest editorial workspace`;
    currentPage = page;
  }
  if (focus) document.querySelector("#page-heading")?.focus?.();
}

// Record the page (and record) in the address without re-running the hash handler.
function setRoute(path) {
  const hash = `#/${path}`;
  if (window.location.hash !== hash) window.history.pushState(null, "", hash);
}

function routeFromHash(event) {
  const [page, kind, ...rest] = window.location.hash.replace(/^#\/?/, "").split("/");
  const id = rest.length ? decodeURIComponent(rest.join("/")) : null;
  showPage(page || "overview", { focus: Boolean(event) });
  if ((page === "content" && kind === "new" && ["article", "faq", "glossary-term"].includes(id)) || (page === "sources" && kind === "new" && id === "source")) {
    const creation = document.querySelector(`.page[data-page="${page}"] .create-record`);
    if (creation?.dataset.createKind !== id) openCreateForm(id, null, { keepPage: true });
  } else if (page === "content" && kind && id && (selectedKind !== kind || selectedId !== id)) selectRecord(kind, id);
  if (page === "guidance" && kind && kind !== selectedLocalGuidanceId) openLocalGuidanceById(decodeURIComponent(kind));
}

function openLocalGuidanceById(id) {
  const location = localGuidanceLocations.find((entry) => entry.supplements.some((supplement) => supplement.id === id));
  if (!location) return false;
  if (localGuidanceUnsaved && !window.confirm("Discard unsaved municipality guidance changes?")) return true;
  localGuidanceUnsaved = false;
  localGuidanceLocation.value = location.id;
  localGuidanceLocation.dispatchEvent(new Event("change", { bubbles: true }));
  selectLocalGuidance(id);
  return true;
}

// Recheck the checkout once a minute so the restart notice appears without a manual Refresh. This updates only the
// overview and header; the Changes page keeps its open diffs until Refresh.
window.setInterval(async () => {
  if (document.hidden) return;
  try {
    lastGitReport = await json("/api/git");
    renderOverview();
  } catch { /* The next Refresh reports Git errors in the Changes page. */ }
}, 60_000);

window.addEventListener("popstate", routeFromHash);
window.addEventListener("hashchange", routeFromHash);

document.querySelector("#refresh").addEventListener("click", refresh);
for (const button of document.querySelectorAll("button[data-create-kind]")) {
  button.addEventListener("click", () => {
    button.closest("details")?.removeAttribute("open");
    openCreateForm(button.dataset.createKind);
  });
}
// ---------- Theme ----------
// System (follow the operating system), Light, or Dark; the choice is stored per browser and applied before paint
// by theme-init.js.
const themeToggle = document.querySelector("#theme-toggle");
const themeOrder = ["system", "light", "dark"];
const themeNames = { system: "System", light: "Light", dark: "Dark" };

function currentTheme() {
  const value = document.documentElement.dataset.theme;
  return value === "light" || value === "dark" ? value : "system";
}

function renderThemeToggle() {
  if (!themeToggle) return;
  const theme = currentTheme();
  const next = themeOrder[(themeOrder.indexOf(theme) + 1) % themeOrder.length];
  themeToggle.textContent = `Theme: ${themeNames[theme]}`;
  themeToggle.setAttribute("aria-label", `Theme: ${theme === "system" ? "follows the system" : themeNames[theme].toLowerCase()}. Switch to ${themeNames[next].toLowerCase()}`);
}

themeToggle?.addEventListener("click", () => {
  const next = themeOrder[(themeOrder.indexOf(currentTheme()) + 1) % themeOrder.length];
  if (next === "system") delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = next;
  try {
    if (next === "system") window.localStorage.removeItem("nihonest-cms:theme");
    else window.localStorage.setItem("nihonest-cms:theme", next);
  } catch { /* The choice then lasts only for this page. */ }
  renderThemeToggle();
});
renderThemeToggle();

// ---------- Go to (Ctrl+K) ----------
// One searchable list of every page, record, municipality guide, reference record, and common action.

const palette = document.querySelector("#palette");
const paletteInput = document.querySelector("#palette-input");
const paletteResults = document.querySelector("#palette-results");
let paletteMatches = [];
let paletteIndex = 0;

function paletteEntries() {
  const entries = [];
  for (const [page, title] of Object.entries(pageTitles)) {
    entries.push({ group: "Page", title, run: () => { setRoute(page); showPage(page, { focus: true }); } });
  }
  entries.push(
    { group: "Action", title: "Start reviewing (oldest review first)", run: () => { if (!startReviewQueue()) { setRoute("content"); showPage("content", { focus: true }); } } },
    { group: "Action", title: "New article", run: () => openCreateForm("article") },
    { group: "Action", title: "New FAQ", run: () => openCreateForm("faq") },
    { group: "Action", title: "New glossary term", run: () => openCreateForm("glossary-term") },
    { group: "Action", title: "New official source", run: () => openCreateForm("source") },
    { group: "Action", title: "Refresh data", run: () => refresh() },
  );
  for (const record of articles) {
    entries.push({ group: kindLabel(record.kind), title: record.title, detail: `${statusLabel(record.status)} · ${record.id}`, keys: `${record.id} ${(record.groups || []).join(" ")}`, run: () => selectRecord(record.kind, record.id) });
  }
  for (const location of localGuidanceLocations) {
    for (const supplement of location.supplements) {
      entries.push({ group: "Municipality guide", title: supplement.title, detail: location.name, keys: `${supplement.id} ${location.name} ${location.prefectureName || ""}`, run: () => openLocalGuidanceById(supplement.id) });
    }
  }
  for (const record of referenceRecords) {
    entries.push({ group: referenceKindLabel(record.kind), title: record.title, detail: record.id, keys: record.id, run: () => { setRoute("sources"); selectReference(record.kind, record.id); } });
  }
  return entries;
}

// Every word must match; matches at the start of the title rank first, then pages and actions, then the rest.
function renderPalette() {
  const words = paletteInput.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const all = paletteEntries();
  const scored = [];
  for (const entry of all) {
    const haystack = `${entry.title} ${entry.group} ${entry.detail || ""} ${entry.keys || ""}`.toLocaleLowerCase();
    if (!words.every((word) => haystack.includes(word))) continue;
    const title = entry.title.toLocaleLowerCase();
    const score = (words.length && title.startsWith(words[0]) ? 0 : 2) + (entry.group === "Page" || entry.group === "Action" ? 0 : 1);
    scored.push([score, entry]);
  }
  scored.sort((a, b) => a[0] - b[0]);
  paletteMatches = (words.length ? scored : scored.filter(([, entry]) => entry.group === "Page" || entry.group === "Action")).slice(0, 40).map(([, entry]) => entry);
  paletteIndex = Math.min(paletteIndex, Math.max(paletteMatches.length - 1, 0));
  paletteResults.replaceChildren(...paletteMatches.map((entry, index) => {
    const item = document.createElement("li");
    item.id = `palette-option-${index}`;
    item.setAttribute("role", "option");
    item.setAttribute("aria-selected", String(index === paletteIndex));
    item.append(el("span", entry.title, "palette-title"), el("span", [entry.group, entry.detail].filter(Boolean).join(" · "), "palette-detail"));
    item.addEventListener("mousedown", (event) => event.preventDefault());
    item.addEventListener("click", () => runPalette(index));
    return item;
  }));
  if (!paletteMatches.length) paletteResults.append(el("li", "No matches. Try a title, ID, location, or page name.", "palette-empty"));
  paletteInput.setAttribute("aria-activedescendant", paletteMatches.length ? `palette-option-${paletteIndex}` : "");
  paletteResults.querySelector("[aria-selected='true']")?.scrollIntoView?.({ block: "nearest" });
}

function openPalette() {
  if (!palette || palette.open) return;
  paletteInput.value = "";
  paletteIndex = 0;
  renderPalette();
  palette.showModal?.();
  if (!palette.showModal) palette.setAttribute("open", "");
  paletteInput.focus();
}

function closePalette() {
  if (palette?.close) palette.close();
  else palette?.removeAttribute("open");
}

function runPalette(index) {
  const entry = paletteMatches[index];
  if (!entry) return;
  closePalette();
  entry.run();
}

paletteInput?.addEventListener("input", () => { paletteIndex = 0; renderPalette(); });
paletteInput?.addEventListener("keydown", (event) => {
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
    if (!paletteMatches.length) return;
    paletteIndex = (paletteIndex + (event.key === "ArrowDown" ? 1 : -1) + paletteMatches.length) % paletteMatches.length;
    renderPalette();
  } else if (event.key === "Enter") {
    event.preventDefault();
    runPalette(paletteIndex);
  }
});
// A click on the backdrop (outside the panel) closes the palette.
palette?.addEventListener("click", (event) => { if (event.target === palette) closePalette(); });
document.querySelector("#open-palette")?.addEventListener("click", openPalette);

// Keyboard: Ctrl+K (or Cmd+K, or / outside fields) opens Go to; Ctrl+S (or Cmd+S) saves the open editor; J and K
// step through the content list from a record. Letter keys are ignored while typing in a field or the formatted editor.
document.addEventListener("keydown", (event) => {
  const target = event.target;
  const typing = target?.closest?.("input, textarea, select, [contenteditable='true']");
  if (((event.ctrlKey || event.metaKey) && !event.altKey && event.key.toLowerCase() === "k") || (event.key === "/" && !typing && !event.ctrlKey && !event.metaKey)) {
    event.preventDefault();
    openPalette();
    return;
  }
  if ((event.ctrlKey || event.metaKey) && !event.altKey && event.key.toLowerCase() === "s") {
    const page = document.querySelector(`main > .page[data-page="${currentPage}"]`);
    const save = [...(page?.querySelectorAll(".action-bar .primary, .local-guidance-save-row .primary") || [])]
      .find((button) => !button.disabled && !button.closest("[hidden]"));
    if (!save && !hasUnsavedChanges && !localGuidanceUnsaved) return;
    event.preventDefault();
    save?.click();
    return;
  }
  if (typing || event.ctrlKey || event.metaKey || event.altKey || currentPage !== "content" || !selectedId) return;
  if (event.key === "j" || event.key === "k") {
    event.preventDefault();
    stepQueue(event.key === "j" ? 1 : -1);
  }
});
window.addEventListener("beforeunload", (event) => {
  if (!hasUnsavedChanges && !localGuidanceUnsaved) return;
  event.preventDefault();
  event.returnValue = "";
});
showPage((window.location.hash.replace(/^#\/?/, "").split("/")[0]) || "overview");
refresh().then(() => { if (window.location.hash) routeFromHash(); });
refreshChecks();
