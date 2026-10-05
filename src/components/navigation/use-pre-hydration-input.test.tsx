import { act, useEffect, useState } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import { usePreHydrationInput } from "./use-pre-hydration-input";

function Picker({ restored }: Readonly<{ restored?: string }>) {
  const [choice, setChoice] = useState("");
  const [query, setQuery] = useState("");
  const selectRef = usePreHydrationInput<HTMLSelectElement>(setChoice);
  const inputRef = usePreHydrationInput<HTMLInputElement>(setQuery);
  // Stands in for state restored after mount, such as a saved location.
  useEffect(() => {
    if (!restored) return;
    const timer = window.setTimeout(() => setChoice(restored));
    return () => window.clearTimeout(timer);
  }, [restored]);
  return (
    <div>
      <select ref={selectRef} aria-label="Choice" value={choice} onChange={(event) => setChoice(event.target.value)}>
        <option value="">None</option>
        <option value="a">A</option>
        <option value="b">B</option>
      </select>
      <input ref={inputRef} aria-label="Query" value={query} onChange={(event) => setQuery(event.target.value)} />
      <output>{`${choice}|${query}`}</output>
    </div>
  );
}

let container: HTMLDivElement;
afterEach(() => container?.remove());

function serverRender(element: React.ReactElement) {
  container = document.createElement("div");
  container.innerHTML = renderToString(element);
  document.body.append(container);
  return {
    select: container.querySelector("select")!,
    input: container.querySelector("input")!,
    output: () => container.querySelector("output")!.textContent,
  };
}

describe("usePreHydrationInput", () => {
  it("applies a choice and text entered before hydration", async () => {
    const page = serverRender(<Picker />);
    page.select.value = "b";
    page.input.value = "tokyo";
    await act(async () => { hydrateRoot(container, <Picker />); });
    expect(page.output()).toBe("b|tokyo");
    expect(page.select.value).toBe("b");
  });

  it("leaves untouched fields alone so state restored after mount is kept", async () => {
    const page = serverRender(<Picker />);
    await act(async () => {
      hydrateRoot(container, <Picker restored="a" />);
      await new Promise((done) => setTimeout(done, 10));
    });
    await act(async () => { await new Promise((done) => setTimeout(done, 10)); });
    expect(page.output()).toBe("a|");
    expect(page.select.value).toBe("a");
  });
});
