import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getAnnotatedDocumentsForArticle } from "@/lib/content/annotated-documents";
import { getLocalGuidanceForArticle, getSelectableLocalGuidanceLocations } from "@/lib/content/local-guidance";
import { localGuidanceLocationStorageKey } from "@/lib/storage/local-guidance-location";
import { LocalGuidancePanel } from "@/components/local-guidance/local-guidance-panel";
import { AnnotatedDocumentViewer } from "./annotated-document-viewer";

describe("AnnotatedDocumentViewer", () => {
  it("opens every document by default and reopens a collapsed document from quick navigation", () => {
    render(<AnnotatedDocumentViewer families={getAnnotatedDocumentsForArticle("documents-received-when-entering-japan")} />);

    const residenceCard = document.getElementById("document-residence-card") as HTMLDetailsElement;
    expect(residenceCard.open).toBe(true);

    residenceCard.open = false;
    fireEvent.click(screen.getByRole("link", { name: "Residence Card" }));
    expect(residenceCard.open).toBe(true);
  });

  it("defaults to the current document and swaps the entire artifact to an archive", () => {
    render(<AnnotatedDocumentViewer families={getAnnotatedDocumentsForArticle("documents-received-when-entering-japan")} />);

    const selector = screen.getByLabelText("Document version");
    expect(selector).toHaveValue("issued-from-2026-06-14");
    expect(screen.getByText("From Jun 14, 2026")).toBeInTheDocument();

    fireEvent.change(selector, { target: { value: "issued-through-2026-06-13" } });

    expect(screen.getByText(/Archived version:/)).toBeInTheDocument();
    expect(screen.getByText("Issued through Jun 13, 2026")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Show explanation for Application pending notation" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Show explanation for Card number and card-validity date" })).not.toBeInTheDocument();
  });

  it("connects a visual callout to its semantic explanation", async () => {
    render(<AnnotatedDocumentViewer families={getAnnotatedDocumentsForArticle("documents-received-when-entering-japan")} />);

    fireEvent.click(screen.getAllByRole("button", { name: "Show explanation for Work restriction" })[0]);
    const explanation = document.getElementById("residence-card-issued-from-2026-06-14-work-restriction-explanation");
    await waitFor(() => expect(explanation).toHaveFocus());
    expect(explanation).toHaveClass("bg-teal-50");
  });

  it("renders the resident-registration document examples in their canonical guides", () => {
    const { rerender } = render(<AnnotatedDocumentViewer families={getAnnotatedDocumentsForArticle("understanding-my-number")} />);

    expect(screen.getByRole("heading", { name: "My Number Card and notification context" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Official sample of a My Number Card/ })).toBeInTheDocument();
    expect(screen.getByText(/Displayed unmodified/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Show explanation for Twelve-digit Individual Number" })).toBeInTheDocument();

    rerender(<AnnotatedDocumentViewer families={getAnnotatedDocumentsForArticle("registering-your-address-after-arrival")} />);
    expect(screen.getByRole("heading", { name: "Notification of change in residence" })).toBeInTheDocument();
    expect(screen.getByText("Shinjuku City and Nagoya City pilot")).toBeInTheDocument();
  });

  it("places the Certificate of Eligibility in the pre-entry immigration explainer", () => {
    render(<AnnotatedDocumentViewer families={getAnnotatedDocumentsForArticle("visa-and-status-of-residence-explained")} />);

    expect(screen.getByRole("heading", { name: "Certificate of Eligibility" })).toBeInTheDocument();
    expect(getAnnotatedDocumentsForArticle("documents-received-when-entering-japan").map(({ id }) => id)).not.toContain("certificate-of-eligibility");
  });

  it("shares a prefecture and municipality selection with local guidance", () => {
    const articleId = "income-and-resident-tax-after-moving-to-japan";
    render(<>
      <AnnotatedDocumentViewer families={getAnnotatedDocumentsForArticle(articleId)} />
      <LocalGuidancePanel options={getLocalGuidanceForArticle(articleId)} locations={getSelectableLocalGuidanceLocations()} />
    </>);

    const documentPrefecture = document.getElementById("resident-tax-notice-prefecture") as HTMLSelectElement;
    fireEvent.change(documentPrefecture, { target: { value: "tokyo" } });

    expect(window.localStorage.getItem(localGuidanceLocationStorageKey)).toBe("shinjuku");
    expect(screen.getByRole("heading", { name: "Resident tax in Shinjuku" })).toBeInTheDocument();
    expect(document.getElementById("resident-tax-notice-jurisdiction")).toHaveValue("shinjuku");

    fireEvent.change(document.getElementById("local-guidance-prefecture") as HTMLSelectElement, { target: { value: "aichi" } });
    fireEvent.change(document.getElementById("local-guidance-location") as HTMLSelectElement, { target: { value: "nagoya" } });

    expect(window.localStorage.getItem(localGuidanceLocationStorageKey)).toBe("nagoya");
    expect(screen.getByRole("heading", { name: "Resident tax in Nagoya" })).toBeInTheDocument();
    expect(document.getElementById("resident-tax-notice-prefecture")).toHaveValue("aichi");
    expect(document.getElementById("resident-tax-notice-jurisdiction")).toHaveValue("nagoya");
  });
});
