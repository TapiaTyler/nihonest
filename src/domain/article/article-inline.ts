/** Display grammar only. Never use this tree to serialize or rewrite CMS source. Offsets are UTF-16. */
type Span = Readonly<{ raw: string; start: number; end: number }>;
export type ArticleInline = Span & (
  | Readonly<{ kind: "text" | "code"; text: string }>
  | Readonly<{ kind: "strong" | "emphasis"; children: readonly ArticleInline[] }>
  | Readonly<{ kind: "link"; href: string; children: readonly ArticleInline[] }>
  | Readonly<{ kind: "protected"; reason: string }>
);

const punctuation = /[!"#$%&'()*+,\-./:;<=>?@[\]\\^_`{|}~]/;
const word = /[\p{L}\p{N}]/u;

/**
 * Supports *, _, **, __, nested emphasis/bold, code runs, escaped punctuation and inline links.
 * Unsupported or malformed markup remains an explicit protected raw span, never HTML or executed MDX.
 * This intentionally bounded grammar is not a CommonMark implementation. Consumers must handle protected
 * spans explicitly before claiming renderer/export parity. Input/depth limits fail loudly.
 */
export function parseArticleInline(source: string): readonly ArticleInline[] {
  if (source.length > 200_000) throw new RangeError("Inline article input exceeds 200000 UTF-16 units.");
  const span = (start: number, end: number): Span => ({ raw: source.slice(start, end), start, end });
  const validDestination = (href: string) => {
    if (!/^(?:\/(?!\/)|https?:\/\/|#)/.test(href) || /[\s\\\u0000-\u001f<>"']/.test(href)) return false;
    if (!/^https?:/.test(href)) return true;
    try { return Boolean(new URL(href).hostname); } catch { return false; }
  };
  const run = (at: number, character: string) => {
    let end = at;
    while (source[end] === character) end++;
    return end - at;
  };
  const balanced = (start: number, limit: number, open: string, close: string) => {
    let depth = 1;
    for (let at = start + 1; at < limit; at++) {
      if (source[at] === "\\") { at++; continue; }
      if (open === "[" && source[at] === "`") {
        const count = run(at, "`");
        let end = at + count;
        while (end < limit && (source[end] !== "`" || run(end, "`") !== count)) {
          end += source[end] === "`" ? run(end, "`") : 1;
        }
        if (end >= limit) return -1;
        at = end + count - 1;
        continue;
      }
      if (source[at] === open) depth++;
      if (source[at] === close) {
        depth--;
        if (depth === 0) return at;
      }
    }
    return -1;
  };
  const parse = (start: number, limit: number, depth: number, allowLinks: boolean, stop = ""):
    { nodes: ArticleInline[]; end: number; closed: boolean } => {
    if (depth > 32) throw new RangeError("Inline article nesting exceeds 32 levels.");
    const nodes: ArticleInline[] = [];
    let at = start;
    const protectedSpan = (end: number, reason: string) => {
      nodes.push({ ...span(at, end), kind: "protected", reason }); at = end;
    };
    const text = (end: number, value = source.slice(at, end)) => {
      const previous = nodes.at(-1);
      if (previous?.kind === "text" && previous.end === at) {
        nodes[nodes.length - 1] = { ...span(previous.start, end), kind: "text", text: previous.text + value };
      } else nodes.push({ ...span(at, end), kind: "text", text: value });
      at = end;
    };
    while (at < limit) {
      if (stop && source.startsWith(stop, at) && !/\s/.test(source[at - 1] ?? "")
        && (stop.length === 2 || run(at, stop[0]!) !== 2)) {
        return { nodes, end: at + stop.length, closed: true };
      }
      const character = source[at]!;
      if (character === "\\" && at + 1 < limit && punctuation.test(source[at + 1]!)) {
        text(at + 2, source[at + 1]!); continue;
      }
      if (character === "`") {
        const count = run(at, "`");
        let close = at + count;
        while (close < limit && (source[close] !== "`" || run(close, "`") !== count)) {
          close += source[close] === "`" ? run(close, "`") : 1;
        }
        if (close >= limit) { protectedSpan(limit, "Unclosed code span"); continue; }
        nodes.push({ ...span(at, close + count), kind: "code", text: source.slice(at + count, close) });
        at = close + count; continue;
      }
      if (character === "[" || (character === "!" && source[at + 1] === "[")) {
        const image = character === "!";
        const labelStart = at + (image ? 1 : 0);
        const labelEnd = balanced(labelStart, limit, "[", "]");
        const destinationStart = labelEnd + (source[labelEnd + 1] === "\\" ? 2 : 1);
        if (labelEnd >= 0 && source[destinationStart] === "(") {
          const destinationEnd = balanced(destinationStart, limit, "(", ")");
          if (destinationEnd < 0) { protectedSpan(limit, "Unclosed link destination"); continue; }
          const href = source.slice(destinationStart + 1, destinationEnd).replace(/\\([()])/g, "$1");
          if (image || !allowLinks || labelEnd === labelStart + 1 || !validDestination(href)) {
            protectedSpan(destinationEnd + 1, "Unsupported image, nested link or destination"); continue;
          }
          nodes.push({ ...span(at, destinationEnd + 1), kind: "link", href,
            children: parse(labelStart + 1, labelEnd, depth + 1, false).nodes });
          at = destinationEnd + 1; continue;
        }
        if (labelEnd >= 0) { protectedSpan(labelEnd + 1, "Unsupported reference or incomplete link"); continue; }
        protectedSpan(limit, "Unclosed link label"); continue;
      }
      if (character === "*" || character === "_") {
        const count = run(at, character);
        if (count > 3) { protectedSpan(at + count, "Unsupported emphasis delimiter run"); continue; }
        if (/\s/.test(source[at + count] ?? " ")
          || (character === "_" && word.test(source[at - 1] ?? "") && word.test(source[at + count] ?? ""))) {
          text(at + count); continue;
        }
        const delimiter = character.repeat(count >= 2 ? 2 : 1);
        const result = parse(at + delimiter.length, limit, depth + 1, allowLinks, delimiter);
        if (!result.closed || !result.nodes.length) { protectedSpan(limit, "Unclosed emphasis delimiter"); continue; }
        nodes.push({ ...span(at, result.end), kind: delimiter.length === 2 ? "strong" : "emphasis", children: result.nodes });
        at = result.end; continue;
      }
      if (character === "<" || character === "{") {
        const closing = source.indexOf(character === "<" ? ">" : "}", at + 1);
        protectedSpan(closing >= 0 && closing < limit ? closing + 1 : at + 1, "Unsupported HTML, autolink or MDX expression");
        continue;
      }
      text(at + 1);
    }
    return { nodes, end: at, closed: !stop };
  };
  return parse(0, source.length, 0, true).nodes;
}
