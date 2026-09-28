(function () {
  "use strict";

  const blankLines = /\n(?:[ \t]*\n)+/g;

  function scan(body, componentTags) {
    const chunks = [];
    let start = 0;
    for (const match of body.matchAll(blankLines)) {
      if (match.index > start) chunks.push(describe(body.slice(start, match.index), match[0], start, componentTags));
      start = match.index + match[0].length;
    }
    if (start < body.length) chunks.push(describe(body.slice(start), "", start, componentTags));
    return chunks;
  }

  function describe(raw, separator, start, componentTags) {
    const clean = raw.trim();
    const lines = clean.split("\n");
    const component = clean.match(/^<([A-Z][A-Za-z0-9]*)\s*\/>$/)?.[1];
    const entry = { raw, separator, start, end: start + raw.length, kind: "locked", label: "Unsupported MDX block" };
    if (component) {
      entry.label = Object.entries(componentTags).find(([, tag]) => tag === component)?.[0]?.replaceAll("-", " ")
        || `Unknown component: ${component}`;
      return entry;
    }
    if (/^(?:<|import\s|export\s|\{|:::|\||-{3,}\s*$|\[\^)/m.test(clean)
      || /[`]|!\[[^\]]*\]\(|~~|\{[^}]*\}/.test(clean)) return entry;
    const heading = clean.match(/^(#{2,3})[ \t]+([^\n]+)$/);
    if (heading) return { ...entry, kind: heading[1].length === 2 ? "heading-2" : "heading-3", text: heading[2] };
    if (lines.every((line) => /^> [^\n]+$/.test(line))) {
      return { ...entry, kind: "blockquote", text: lines.map((line) => line.slice(2)).join(" ") };
    }
    if (lines.every((line) => /^[-*] [^\n]+$/.test(line))) {
      return { ...entry, kind: "unordered-list", items: lines.map((line) => line.slice(2)) };
    }
    if (lines.every((line) => /^\d+[.)] [^\n]+$/.test(line))) {
      return { ...entry, kind: "ordered-list", items: lines.map((line) => line.replace(/^\d+[.)] /, "")) };
    }
    if (lines.some((line) => /^(?:#{1,6}\s|>\s|[-*]\s|\d+[.)]\s)/.test(line))) return entry;
    return { ...entry, kind: "paragraph", text: lines.join(" ") };
  }

  function renderInline(text, document) {
    const fragment = document.createDocumentFragment();
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\((?:\/|https?:\/\/)[^)\s]+\))/g);
    for (const part of parts) {
      if (part.startsWith("**") && part.endsWith("**")) {
        const node = document.createElement("strong");
        node.textContent = part.slice(2, -2);
        fragment.append(node);
      } else if (part.startsWith("*") && part.endsWith("*")) {
        const node = document.createElement("em");
        node.textContent = part.slice(1, -1);
        fragment.append(node);
      } else {
        const link = part.match(/^\[([^\]]+)\]\(((?:\/|https?:\/\/)[^)\s]+)\)$/);
        if (link) {
          const node = document.createElement("a");
          node.href = link[2];
          node.textContent = link[1];
          node.addEventListener("click", (event) => event.preventDefault());
          fragment.append(node);
        } else fragment.append(document.createTextNode(part));
      }
    }
    return fragment;
  }

  function inlineSource(node) {
    if (node.nodeType === 3) return node.textContent;
    if (node.nodeType !== 1) return "";
    const content = Array.from(node.childNodes, inlineSource).join("");
    if (node.tagName === "STRONG" || node.tagName === "B") return `**${content}**`;
    if (node.tagName === "EM" || node.tagName === "I") return `*${content}*`;
    if (node.tagName === "A") return `[${content}](${node.getAttribute("href")})`;
    if (node.tagName === "BR") return " ";
    return content;
  }

  function sourceFor(chunk, element) {
    if (chunk.kind === "locked") return chunk.raw;
    if (chunk.kind === "unordered-list" || chunk.kind === "ordered-list") {
      const items = [...element.querySelectorAll(":scope > li")];
      return items.map((item, index) => `${chunk.kind === "unordered-list" ? "-" : `${index + 1}.`} ${inlineSource(item).trim()}`).join("\n");
    }
    const content = inlineSource(element).trim();
    if (chunk.kind === "heading-2") return `## ${content}`;
    if (chunk.kind === "heading-3") return `### ${content}`;
    if (chunk.kind === "blockquote") return `> ${content}`;
    return content;
  }

  function normalizedSource(chunk) {
    const lines = chunk.raw.replace(/^\n+|\n+$/g, "").split("\n");
    if (chunk.kind === "unordered-list") return lines.map((line) => `- ${line.slice(2)}`).join("\n");
    if (chunk.kind === "ordered-list") return lines.map((line, index) => `${index + 1}. ${line.replace(/^\d+[.)] /, "")}`).join("\n");
    if (chunk.kind === "blockquote") return `> ${lines.map((line) => line.slice(2)).join(" ")}`;
    if (chunk.kind === "heading-2" || chunk.kind === "heading-3") return lines[0].replace(/^(#{2,3})[ \t]+/, "$1 ");
    return lines.join(" ");
  }

  function render(body, componentTags, document) {
    const chunks = scan(body, componentTags);
    const surface = document.createElement("div");
    surface.className = "formatted-surface preview-body";
    chunks.forEach((chunk, index) => {
      const wrapper = document.createElement("div");
      wrapper.className = "formatted-block";
      wrapper.dataset.blockIndex = String(index);
      if (chunk.kind !== "locked") {
        const tag = chunk.kind === "heading-2" ? "h2" : chunk.kind === "heading-3" ? "h3"
          : chunk.kind === "blockquote" ? "blockquote" : chunk.kind === "ordered-list" ? "ol"
            : chunk.kind === "unordered-list" ? "ul" : "p";
        const content = document.createElement(tag);
        if (chunk.items) {
          for (const item of chunk.items) {
            const li = document.createElement("li");
            li.setAttribute("contenteditable", "true");
            li.append(renderInline(item, document));
            content.append(li);
          }
        } else {
          content.setAttribute("contenteditable", "true");
          content.append(renderInline(chunk.text, document));
        }
        content.setAttribute("aria-label", `${chunk.kind.replaceAll("-", " ")} block ${index + 1}`);
        if (sourceFor(chunk, content) === normalizedSource(chunk)) wrapper.append(content);
        else {
          chunk.kind = "locked";
          chunk.label = "Formatting the editor cannot preserve; use MDX source";
        }
      }
      if (chunk.kind === "locked") {
        wrapper.classList.add("formatted-locked");
        wrapper.append(Object.assign(document.createElement("strong"), { textContent: chunk.label }),
          Object.assign(document.createElement("p"), { textContent: "Locked block. Use Source mode for an exact edit." }));
      }
      surface.append(wrapper);
    });
    return { surface, chunks };
  }

  window.CmsFormattedArticle = { scan, render, sourceFor, inlineSource };
})();
