import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DebouncedSearchInput } from "./debounced-search-input";

describe("DebouncedSearchInput", () => {
  afterEach(() => vi.useRealTimers());

  it("keeps keystrokes local and commits once after the typing pause", () => {
    vi.useFakeTimers();
    const onCommit = vi.fn();
    render(<DebouncedSearchInput id="query" value="" onCommit={onCommit} placeholder="Search" className="" />);
    const input = screen.getByRole("searchbox");

    fireEvent.change(input, { target: { value: "free" } });
    fireEvent.change(input, { target: { value: "freelance" } });
    expect(onCommit).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(200));
    expect(onCommit).toHaveBeenCalledOnce();
    expect(onCommit).toHaveBeenCalledWith("freelance");
  });

  it("commits immediately on blur for navigation and pointer users", () => {
    const onCommit = vi.fn();
    render(<DebouncedSearchInput id="query" value="" onCommit={onCommit} placeholder="Search" className="" />);
    const input = screen.getByRole("searchbox");

    fireEvent.change(input, { target: { value: "tax" } });
    fireEvent.blur(input);
    expect(onCommit).toHaveBeenCalledWith("tax");
  });

  it("does not replace newer typing when an earlier local commit returns from the parent", () => {
    vi.useFakeTimers();
    const onCommit = vi.fn();
    const { rerender } = render(<DebouncedSearchInput id="query" value="" onCommit={onCommit} placeholder="Search" className="" />);
    const input = screen.getByRole("searchbox");

    fireEvent.change(input, { target: { value: "where" } });
    act(() => vi.advanceTimersByTime(200));
    fireEvent.change(input, { target: { value: "where can i file taxes?" } });

    rerender(<DebouncedSearchInput id="query" value="where" onCommit={onCommit} placeholder="Search" className="" />);
    expect(input).toHaveValue("where can i file taxes?");
  });

  it("still accepts genuine external state restoration", () => {
    const onCommit = vi.fn();
    const { rerender } = render(<DebouncedSearchInput id="query" value="old query" onCommit={onCommit} placeholder="Search" className="" />);

    rerender(<DebouncedSearchInput id="query" value="restored query" onCommit={onCommit} placeholder="Search" className="" />);
    expect(screen.getByRole("searchbox")).toHaveValue("restored query");
  });
});
