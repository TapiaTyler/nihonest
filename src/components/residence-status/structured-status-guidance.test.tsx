import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ContentLocaleProvider } from "@/components/localization/content-locale-provider";
import { residenceStatuses } from "@/data/residence-statuses";
import { contentLocaleStorageKey } from "@/lib/storage/content-locale";
import { StructuredStatusGuidance } from "./structured-status-guidance";

const guidance = residenceStatuses.find(({ id }) => id === "professor")!.structuredGuidance!;
const overlay = { "route-kind-label": "高等教育機関での教育・研究の在留資格" };

describe("StructuredStatusGuidance", () => {
  afterEach(() => window.localStorage.removeItem(contentLocaleStorageKey));

  it("renders canonical English by default even when an overlay exists", () => {
    render(<StructuredStatusGuidance guidance={guidance} translation={overlay} />);
    expect(screen.getByRole("heading", { name: "How this route is assessed" })).toBeInTheDocument();
    expect(screen.getByText(guidance.routeKindLabel)).toBeInTheDocument();
  });

  it("applies the Japanese overlay and interface text, falling back to English per snippet", () => {
    window.localStorage.setItem(contentLocaleStorageKey, "ja");
    const { container } = render(
      <ContentLocaleProvider>
        <StructuredStatusGuidance guidance={guidance} translation={overlay} />
      </ContentLocaleProvider>,
    );
    expect(screen.getByRole("heading", { name: "この経路の審査のポイント" })).toBeInTheDocument();
    expect(screen.getByText(overlay["route-kind-label"])).toBeInTheDocument();
    expect(screen.getByText(guidance.workAuthorization.summary)).toBeInTheDocument();
    expect(container.querySelector("section")).toHaveAttribute("lang", "ja");
  });
});
