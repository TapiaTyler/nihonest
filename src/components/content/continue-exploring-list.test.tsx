import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ContinueExploringList } from "./continue-exploring-list";

describe("ContinueExploringList", () => {
  it("reveals four total recommendations at a time across both groups", () => {
    const cards = Array.from({ length: 3 }, (_, index) => <a key={index} href={`#card-${index + 1}`}>Card {index + 1}</a>);
    const guides = Array.from({ length: 6 }, (_, index) => <li key={index}><a href={`#guide-${index + 1}`}>Guide {index + 1}</a></li>);
    render(<ContinueExploringList cards={cards} guides={guides} />);

    expect(screen.getAllByRole("link")).toHaveLength(4);
    fireEvent.click(screen.getByRole("button", { name: "Show 4 more" }));
    expect(screen.getAllByRole("link")).toHaveLength(8);
    fireEvent.click(screen.getByRole("button", { name: "Show 1 more" }));
    expect(screen.getAllByRole("link")).toHaveLength(9);
    expect(screen.queryByRole("button", { name: /Show .* more/ })).not.toBeInTheDocument();
  });
});
