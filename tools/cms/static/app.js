const summary = document.querySelector("#summary");
const list = document.querySelector("#article-list");
const detail = document.querySelector("#article-detail");
const failures = document.querySelector("#failures");
const resultCount = document.querySelector("#result-count");
const search = document.querySelector("#search");
const statusFilter = document.querySelector("#status-filter");
const kindFilter = document.querySelector("#kind-filter");
const groupFilter = document.querySelector("#group-filter");
const websiteOrigin = "http://127.0.0.1:3000";
let articles = [];
let selectedId = null;
let selectedKind = "article";
let sessionToken = null;
let hasUnsavedChanges = false;
let cancelEditorPreview = () => {};

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

function renderList() {
  const query = search.value.trim().toLocaleLowerCase();
  const selectedStatus = statusFilter.value;
  const selectedKindFilter = kindFilter.value;
  const selectedGroup = groupFilter.value;
  const matches = articles.filter((article) =>
    (!selectedKindFilter || article.kind === selectedKindFilter) &&
    (!selectedGroup || (article.groups || []).some((group) => `${article.kind}:${group}` === selectedGroup)) &&
    (!selectedStatus || article.status === selectedStatus) &&
    (!query || `${article.title} ${article.id}`.toLocaleLowerCase().includes(query)));
  list.replaceChildren();
  resultCount.textContent = `${matches.length} of ${articles.length} records`;
  for (const article of matches) {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("aria-current", String(article.id === selectedId && article.kind === selectedKind));
    button.append(el("strong", article.title), el("small", `${article.kind.replaceAll("-", " ")} · ${article.status}${article.translation ? ` · Japanese: ${article.translation}` : ""}`));
    button.addEventListener("click", () => selectRecord(article.kind, article.id));
    item.append(button);
    list.append(item);
  }
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
  header.append(el("span", metadata.status === "needs-review" ? "Editorial review" : metadata.status, "badge"),
    el("h3", metadata.title), el("p", metadata.description, "preview-description"));
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
      textarea.focus();
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
      formatLines((lines) => lines.map((line, index) => {
        const plain = line.replace(/^(?:#{2,3}|>|[-*]|\d+[.)])\s+/, "");
        return `${typeof prefix === "function" ? prefix(index) : prefix}${plain}`;
      }));
    }
    function wrapSelection(marker) {
      const selection = textarea.value.slice(textarea.selectionStart, textarea.selectionEnd);
      replaceSelection(`${marker}${selection}${marker}`, marker.length, marker.length + selection.length);
    }
    formatButton(typographyGroup, "H₂", "Heading 2", "Heading level 2", () => prefixLines("## "));
    formatButton(typographyGroup, "H₃", "Heading 3", "Heading level 3", () => prefixLines("### "));
    formatButton(typographyGroup, "B", "Bold", "Bold (Ctrl+B)", () => wrapSelection("**"));
    formatButton(typographyGroup, "I", "Italic", "Italic (Ctrl+I)", () => wrapSelection("*"));
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
    let linkSelection = { start: 0, end: 0 };
    formatButton(structureGroup, "⌁", "Link", "Insert or change link", () => {
      linkSelection = { start: textarea.selectionStart, end: textarea.selectionEnd };
      linkText.value = textarea.value.slice(linkSelection.start, linkSelection.end);
      linkUrl.value = "";
      linkForm.hidden = false;
      linkText.focus();
    });
    applyLink.addEventListener("click", () => {
      const label = linkText.value.trim();
      const url = linkUrl.value.trim();
      if (!label || !/^(?:\/(?!\/)|https?:\/\/)[^\s)]+$/.test(url)) {
        message.textContent = "Enter link text and a site path or HTTP(S) URL without spaces.";
        message.className = "error";
        return;
      }
      textarea.setSelectionRange(linkSelection.start, linkSelection.end);
      replaceSelection(`[${label}](${url})`);
      linkForm.hidden = true;
    });
    cancelLink.addEventListener("click", () => { linkForm.hidden = true; textarea.focus(); });
    const linkTextField = document.createElement("div");
    linkTextField.className = "link-field";
    linkTextField.append(linkTextLabel, linkText);
    const linkUrlField = document.createElement("div");
    linkUrlField.className = "link-field";
    linkUrlField.append(linkUrlLabel, linkUrl);
    linkForm.append(linkTextField, linkUrlField, applyLink, cancelLink);
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
      textarea.focus();
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
    const message = el("p", "Changes are local to this browser until Save.", "hint");
    message.setAttribute("role", "status");
    const diff = document.createElement("details");
    const diffBody = el("pre", "No body changes.");
    diff.append(el("summary", "Review body change"), diffBody);
    const save = el("button", "Save article body");
    save.type = "button";
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
    editor.append(label, toolbar, linkForm, textarea, dateLabel, date, diff, actions, message);
    wrapper.append(editor);
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
      save.disabled = !changed || !validPreview;
      diffBody.textContent = `${metadata.updatedAt === date.value ? "Update date unchanged." : `Update date: ${metadata.updatedAt} → ${date.value}`}\n\n${changeSummary(article.body, textarea.value)}`;
      diff.open = changed;
    }
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
      clearTimeout(previewTimer);
      hasUnsavedChanges = false;
      selectArticle(metadata.id);
    });
    save.addEventListener("click", async () => {
      save.disabled = true;
      message.textContent = "Saving article body…";
      try {
        await mutate(`/api/articles/${encodeURIComponent(metadata.id)}/body`, "PUT", {
          expectedRevision: record.revision, body: textarea.value, updatedAt: date.value,
        });
        hasUnsavedChanges = false;
        await refresh();
      } catch (error) {
        message.textContent = error.message;
        message.className = "error";
        updateState();
      }
    });
  } else wrapper.append(el("p", "Body editing is currently available only for draft and needs-review articles.", "hint"));
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
  section.append(el("p", "Repository identity and editorial metadata. Status and human review can be changed below; other fields are read-only.", "hint"));
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
  section.append(dl, editorialControls(article), raw);
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
      document.querySelector("#record-tab-file")?.click();
    } catch (error) { message.textContent = error.message; message.className = "error"; statusButton.disabled = false; }
  });
  section.append(statusLabel, status, note, statusButton, message);
  if (record.status !== "needs-review") return section;

  const form = document.createElement("form");
  form.className = "review-form";
  form.append(el("h3", "Mark reviewed"),
    el("p", "Review this complete record, linked content, and official sources. Record the validation you performed and explicitly approve the exact revision shown below. The CMS writes the verified state and an immutable approval record.", "hint"),
    el("p", `Editorial revision to review: ${record.revision}`, "revision-label"));
  function fieldInput(title, id, multiline = false) {
    const help = id.includes("date") ? helpText.reviewDate : id.includes("change") ? helpText.changeNote
      : id.includes("validation") ? helpText.validation : id.includes("source") ? helpText.sourceReviews : helpText.approvalNote;
    const label = labeledField(title, id, help);
    const input = document.createElement(multiline ? "textarea" : "input");
    input.id = id;
    input.required = true;
    if (multiline) input.rows = 3;
    form.append(label, input);
    return input;
  }
  const date = fieldInput("Review date", "structured-review-date");
  date.type = "date";
  if (record.updatedAt) date.min = record.updatedAt;
  const now = new Date();
  date.max = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  date.value = date.max;
  const change = fieldInput("What did you review or change?", "structured-change-note", true);
  const validation = fieldInput("Validation performed (one check per line)", "structured-validation", true);
  const sourceReviews = fieldInput("Resolved source review IDs (optional, one per line)", "structured-source-reviews", true);
  sourceReviews.required = false;
  const approval = fieldInput("Approval note", "structured-approval-note", true);
  const { row: checkLabel, check } = approvalField("I reviewed and approve this exact record revision.");
  const approve = el("button", "Mark reviewed and record approval");
  approve.type = "submit";
  const result = el("p", "", "hint");
  result.setAttribute("role", "status");
  form.append(checkLabel, approve, result);
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (hasUnsavedChanges) { result.textContent = "Save or discard content edits first."; result.className = "error"; return; }
    approve.disabled = true;
    result.textContent = "Recording the approved revision…";
    try {
      const saved = await mutate(`/api/records/${record.kind}/${encodeURIComponent(record.id)}/review`, "POST", {
        expectedRevision: record.revision,
        expectedSourceRevision: record.source.sourceRevision,
        reviewedAt: date.value,
        changeNote: change.value,
        validationPerformed: validation.value.split("\n").map((item) => item.trim()).filter(Boolean),
        sourceReviewIds: sourceReviews.value.split("\n").map((item) => item.trim()).filter(Boolean),
        approvalNote: approval.value,
        explicitHumanApproval: check.checked,
      });
      await refresh();
      document.querySelector("#record-tab-file")?.click();
      document.querySelector("#structured-editorial")?.append(el("p", `Approval recorded in ${saved.approvalRecord}. Run npm run editorial:audit before committing.`, "success"));
    } catch (error) { result.textContent = error.message; result.className = "error"; approve.disabled = false; }
  });
  section.append(form);
  return section;
}

function structuredPreview(record, value, status) {
  const preview = document.createElement("article");
  preview.className = `article-preview structured-preview ${record.kind}-preview`;
  const header = document.createElement("header");
  header.className = "preview-header";
  const badge = el("span", status === "needs-review" ? "Editorial review" : status, "badge");
  header.append(badge);
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
  const message = el("p", "Changes are local to this browser until Save.", "hint");
  message.setAttribute("role", "status");
  actions.append(save, discard, previewToggle);
  section.append(diff, actions, message, previewPanel);
  function changes() {
    const changed = {};
    for (const [key, { control, initial }] of fields) {
      const value = Array.isArray(initial) ? control.value.split("\n").map((item) => item.trim()).filter(Boolean) : control.value;
      if (JSON.stringify(value) !== JSON.stringify(initial)) changed[key] = value;
    }
    return changed;
  }
  function updateState() {
    const changed = changes();
    hasUnsavedChanges = Object.keys(changed).length > 0;
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
  previewToggle.addEventListener("click", () => {
    previewPanel.hidden = !previewPanel.hidden;
    previewToggle.textContent = previewPanel.hidden ? `Preview ${record.kind.replaceAll("-", " ")}` : "Hide preview";
    previewToggle.setAttribute("aria-expanded", String(!previewPanel.hidden));
    if (!previewPanel.hidden) updateState();
  });
  for (const { control } of fields.values()) control.addEventListener("input", updateState);
  updatedAt?.addEventListener("change", updateState);
  discard.addEventListener("click", () => { hasUnsavedChanges = false; selectRecord(record.kind, record.id); });
  save.addEventListener("click", async () => {
    const changed = changes();
    if (!Object.keys(changed).length) return;
    save.disabled = true;
    message.textContent = "Saving content…";
    try {
      await mutate(`/api/records/${record.kind}/${encodeURIComponent(record.id)}/content`, "PUT", {
        expectedRevision: record.revision,
        expectedSourceRevision: record.source.sourceRevision,
        fields: changed,
        ...(updatedAt ? { updatedAt: updatedAt.value } : {}),
      });
      hasUnsavedChanges = false;
      await refresh();
    } catch (error) { message.textContent = error.message; message.className = "error"; updateState(); }
  });
  return section;
}

function renderStructuredRecord(record) {
  const wrapper = document.createElement("div");
  wrapper.className = "structured-record";
  wrapper.append(el("p", record.kind.replaceAll("-", " ").toUpperCase(), "eyebrow"),
    el("h3", record.title), el("span", record.status === "needs-review" ? "Editorial review" : record.status, "badge"));
  const value = record.value;
  if (record.kind === "faq") wrapper.append(el("p", value.summary, "record-summary"));
  if (record.kind === "residence-status") wrapper.append(el("p", value.summary, "record-summary"), el("p", value.purpose));
  if (record.kind === "glossary-term") {
    wrapper.append(el("p", `${value.japanese} · ${value.kana || "No kana"} · ${value.romaji || "No romaji"}`, "record-summary"),
      el("p", value.shortDefinition), el("p", value.detailedExplanation));
  }
  const sources = document.createElement("section");
  sources.append(el("h3", "Official sources"), sourceList(record.sources));
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
  full.open = true;
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
  const fileDetails = document.createElement("div");
  fileDetails.append(full, file, editorial);
  wrapper.append(renderDetailTabs([
    ["content", "Content", structuredContentEditor(record)],
    ["linked", "Linked Articles", related],
    ["sources", "Sources", sources],
    ["file", "File Details", fileDetails],
  ], "Structured record sections", "record"));
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
      await mutate(`/api/articles/${encodeURIComponent(metadata.id)}/status`, "PUT", { expectedRevision: record.revision, status: status.value });
      await refresh();
      document.querySelector("#tab-file")?.click();
    } catch (error) { statusMessage.textContent = error.message; statusMessage.className = "error"; statusButton.disabled = false; }
  });
  section.append(statusLabel, status, statusNote, statusButton, statusMessage);

  if (metadata.status !== "needs-review") return section;
  const review = document.createElement("form");
  review.className = "review-form";
    review.append(el("h3", "Mark reviewed"),
    el("p", "Review the complete article, metadata, sources, and relationships. Run the relevant validation and inspect the rendered article before approving this exact revision. This action writes the verified status, review date, and an immutable approval record to the local checkout.", "hint"),
    el("p", `Editorial revision to review: ${record.editorialRevision || record.revision}`, "revision-label"));
  function inputField(labelText, id, multiline = false) {
    const help = id.includes("date") ? helpText.reviewDate : id.includes("change") ? helpText.changeNote
      : id.includes("validation") ? helpText.validation : id.includes("source") ? helpText.sourceReviews : helpText.approvalNote;
    const label = labeledField(labelText, id, help);
    const input = document.createElement(multiline ? "textarea" : "input");
    input.id = id;
    input.required = true;
    if (multiline) input.rows = 3;
    review.append(label, input);
    return input;
  }
  const date = inputField("Review date", "review-date");
  date.type = "date";
  date.min = metadata.updatedAt;
  const now = new Date();
  date.max = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  date.value = date.max;
  const change = inputField("What did you review or change?", "review-change-note", true);
  const validation = inputField("Validation performed (one check per line)", "review-validation", true);
  const sourceReviews = inputField("Resolved source review IDs (optional, one per line)", "review-source-ids", true);
  sourceReviews.required = false;
  const approval = inputField("Approval note", "review-approval-note", true);
  const { row: checkLabel, check } = approvalField("I reviewed and approve this exact article revision.");
  const reviewButton = el("button", "Mark reviewed and record approval");
  reviewButton.type = "submit";
  const message = el("p", "", "hint");
  message.setAttribute("role", "status");
  review.append(checkLabel, reviewButton, message);
  review.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (hasUnsavedChanges) { message.textContent = "Save or discard article body edits first."; message.className = "error"; return; }
    reviewButton.disabled = true;
    message.textContent = "Recording the approved revision…";
    try {
      const result = await mutate(`/api/articles/${encodeURIComponent(metadata.id)}/review`, "POST", {
        expectedRevision: record.revision,
        reviewedAt: date.value,
        changeNote: change.value,
        validationPerformed: validation.value.split("\n").map((item) => item.trim()).filter(Boolean),
        sourceReviewIds: sourceReviews.value.split("\n").map((item) => item.trim()).filter(Boolean),
        approvalNote: approval.value,
        explicitHumanApproval: check.checked,
      });
      await refresh();
      document.querySelector("#tab-file")?.click();
      const refreshed = document.querySelector("#panel-file .editorial-controls");
      refreshed?.append(el("p", `Approval recorded in ${result.approvalRecord}. Run npm run editorial:audit before committing.`, "success"));
    } catch (error) { message.textContent = error.message; message.className = "error"; reviewButton.disabled = false; }
  });
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

function renderTabs(article) {
  detail.replaceChildren(renderDetailTabs([
    ["article", "Article", articleView(article)],
    ["linked", "Linked Articles", linkedArticlesView(article)],
    ["sources", "Sources", sourcesView(article)],
    ["file", "File Details", fileDetailsView(article)],
  ], "Article detail sections"));
}

async function selectArticle(id) {
  return selectRecord("article", id);
}

async function selectRecord(kind, id) {
  if (hasUnsavedChanges && !window.confirm("Discard the unsaved content changes?")) return;
  cancelEditorPreview();
  hasUnsavedChanges = false;
  selectedId = id;
  selectedKind = kind;
  renderList();
  detail.replaceChildren(el("p", "Loading record…"));
  try {
    const record = await json(kind === "article" ? `/api/articles/${encodeURIComponent(id)}` : `/api/records/${kind}/${encodeURIComponent(id)}`);
    if (selectedId !== id || selectedKind !== kind) return;
    if (kind === "article") renderTabs(record);
    else renderStructuredRecord(record);
  } catch (error) {
    detail.replaceChildren(el("p", error.message, "error"));
  }
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
    group.append(list);
  } else group.append(el("p", "None."));
  return group;
}

function renderGit(report) {
  const container = document.querySelector("#git-status");
  const { identity } = report;
  const facts = document.createElement("dl");
  field(facts, "Worktree", identity.worktree);
  field(facts, "Repository", identity.repository);
  field(facts, "Branch", report.currentBranch === identity.branch ? identity.branch : `${report.currentBranch} (session started on ${identity.branch})`);
  field(facts, "Starting commit", identity.startCommit);
  if (report.currentCommit !== identity.startCommit) field(facts, "Current commit", report.currentCommit);
  field(facts, "Session started", identity.startedAt);
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

async function refresh() {
  if (hasUnsavedChanges && !window.confirm("Discard the unsaved content changes and refresh?")) return;
  hasUnsavedChanges = false;
  try {
    const [catalog, structured] = await Promise.all([json("/api/articles"), json("/api/records")]);
    articles = [...catalog.articles.map((item) => ({ ...item, kind: "article" })), ...structured.records];
    summary.replaceChildren(
      el("span", `${articles.length} reviewable records`),
      el("span", `${articles.filter((item) => item.status === "needs-review").length} need editorial review`),
      el("span", `${articles.filter((item) => item.translation === "stale").length} stale Japanese translations`),
      el("span", `${catalog.failures.length + structured.failures.length} catalog errors`),
    );
    const allFailures = [...catalog.failures, ...structured.failures];
    failures.replaceChildren(...(allFailures.length
      ? allFailures.map((item) => el("p", `${item.path}: ${item.error}`, "error"))
      : [el("p", "No catalog parse errors.")]));
    renderGroupFilter();
    renderList();
    if (selectedId) await selectRecord(selectedKind, selectedId);
    renderGit(await json("/api/git"));
  } catch (error) {
    summary.replaceChildren(el("p", error.message, "error"));
  }
}

search.addEventListener("input", renderList);
statusFilter.addEventListener("change", renderList);
kindFilter.addEventListener("change", () => { groupFilter.value = ""; renderGroupFilter(); renderList(); });
groupFilter.addEventListener("change", renderList);
document.querySelector("#refresh").addEventListener("click", refresh);
window.addEventListener("beforeunload", (event) => {
  if (!hasUnsavedChanges) return;
  event.preventDefault();
  event.returnValue = "";
});
refresh();
