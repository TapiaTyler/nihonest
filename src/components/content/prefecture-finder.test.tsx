import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getInterfaceMessageGroup } from "@/domain/localization/interface-messages";
import { getPrefectureFinderData } from "@/lib/content/prefecture-finder";
import { localGuidanceLocationStorageKey } from "@/lib/storage/local-guidance-location";
import { PrefectureFinder } from "./prefecture-finder";

const data = getPrefectureFinderData();

describe("PrefectureFinder", () => {
  it("searches and selects without changing saved local context", () => {
    window.localStorage.setItem(localGuidanceLocationStorageKey, "nagoya");
    render(<PrefectureFinder locale="en" messages={getInterfaceMessageGroup("en", "finder.")} {...data} />);
    const search = screen.getByRole("searchbox", { name: "Search prefectures" });
    const select = screen.getByRole("combobox", { name: "Choose a prefecture" });
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    fireEvent.change(search, { target: { value: "東京都" } });
    expect(within(select).getAllByRole("option")).toHaveLength(2);
    fireEvent.change(select, { target: { value: "jp-13000" } });
    // Researched guidance appears only after a municipality or ward is chosen, and only for that area.
    expect(screen.queryByRole("heading", { name: "Researched local guidance" })).not.toBeInTheDocument();
    const municipalitySelect = screen.getByRole("combobox", { name: "Choose a municipality or ward" });
    expect(within(municipalitySelect).getByRole("option", { name: "Chiyoda City" })).toHaveValue("jp-13101");
    fireEvent.change(municipalitySelect, { target: { value: "jp-13104" } });
    expect(screen.getByRole("heading", { name: "Researched local guidance" })).toBeInTheDocument();
    expect(screen.getByText(/cover only Shinjuku City, not the entire prefecture/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Registering an address in Shinjuku" })).toHaveAttribute("href", "/articles/registering-your-address-after-arrival?local=jp-13104#local-guidance-heading");
    expect(screen.queryByRole("link", { name: "Registering an address in Chiyoda" })).not.toBeInTheDocument();
    fireEvent.change(municipalitySelect, { target: { value: "" } });
    fireEvent.change(search, { target: { value: "no-such-prefecture" } });
    expect(screen.getByRole("status")).toHaveTextContent("No prefectures match this search");
    expect(screen.getByText(/outside the current search results/)).toBeInTheDocument();
    expect(within(select).getByRole("option", { name: /Tokyo/ })).toHaveValue("jp-13000");
    fireEvent.click(screen.getByRole("button", { name: "Clear search" }));
    expect(select).toHaveValue("jp-13000");
    fireEvent.click(screen.getByRole("button", { name: "Clear selection" }));
    expect(select).toHaveValue("");
    expect(window.localStorage.getItem(localGuidanceLocationStorageKey)).toBe("nagoya");
  });

  it("shows an explicit local coverage gap in Japanese", () => {
    const unresearched = data.prefectures[0];
    const locationsWithoutLocalResearch = data.municipalities.filter(({ prefectureId }) => prefectureId !== unresearched.id);
    const { container } = render(<PrefectureFinder locale="ja" messages={getInterfaceMessageGroup("ja", "finder.")} {...data} municipalities={locationsWithoutLocalResearch} />);
    expect(container.querySelector("section")).toHaveAttribute("lang", "ja");
    expect(screen.queryByText(/currently in English/)).not.toBeInTheDocument();
    const select = screen.getByRole("combobox", { name: "都道府県を選択" });
    expect(within(select).getByRole("option", { name: unresearched.names.ja })).toHaveValue(unresearched.id);
    fireEvent.change(select, { target: { value: unresearched.id } });
    expect(screen.getByRole("heading", { name: `選択中の都道府県：${unresearched.names.ja}` })).toBeInTheDocument();
    expect(screen.getByText(/都道府県全体の手続きはまだ調査していません/)).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "国民健康保険" }).map((link) => link.getAttribute("href"))).toContain(`/articles/joining-national-health-insurance?local=${unresearched.id}#local-guidance-heading`);
    expect(screen.queryByRole("combobox", { name: "市区町村を選択" })).not.toBeInTheDocument();
    expect(screen.getByText("日本の都道府県地図")).toBeInTheDocument();
  });

  it("names municipalities, Tokyo areas, dates, and translated supplements in Japanese", () => {
    const supplement = data.coverage.flatMap(({ municipalities }) => municipalities).find(({ id }) => id === "jp-13104")!.supplements[0]!;
    render(<PrefectureFinder locale="ja" messages={getInterfaceMessageGroup("ja", "finder.")} {...data} japaneseSupplementTitles={{ [supplement.id]: "新宿区での住所の登録" }} />);
    fireEvent.change(screen.getByRole("combobox", { name: "都道府県を選択" }), { target: { value: "jp-13000" } });
    const municipalitySelect = screen.getByRole("combobox", { name: "市区町村を選択" });
    expect(within(municipalitySelect).getByRole("option", { name: "新宿区" })).toHaveValue("jp-13104");
    expect(municipalitySelect.querySelector("optgroup")).toHaveAttribute("label", "特別区");
    fireEvent.change(municipalitySelect, { target: { value: "jp-13104" } });
    expect(screen.getByText(/これらの補足は新宿区だけを対象/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "新宿区での住所の登録" })).not.toHaveAttribute("lang");
    // Supplements without a current translation keep their English title, marked as English.
    const untranslated = screen.getAllByRole("link").find((link) => link.getAttribute("lang") === "en");
    expect(untranslated).toBeDefined();
    expect(screen.getAllByText(/出典の最終確認日：\d{4}年\d{1,2}月\d{1,2}日/).length).toBeGreaterThan(0);
  });

  it("uses the same ephemeral selection for map and list, including keyboard selection", () => {
    window.localStorage.setItem(localGuidanceLocationStorageKey, "nagoya");
    render(<PrefectureFinder locale="en" messages={getInterfaceMessageGroup("en", "finder.")} {...data} />);
    const mapDisclosure = screen.getByText("Japan prefecture map").closest("details");
    expect(mapDisclosure).not.toHaveAttribute("open");
    fireEvent.click(screen.getByText("Japan prefecture map"));
    expect(mapDisclosure).toHaveAttribute("open");
    const map = screen.getByRole("group", { name: /main Japan map/ });
    expect(within(map).getAllByRole("button")).toHaveLength(46);
    const okinawaInset = screen.getByRole("button", { name: /Select Okinawa.*southern islands inset/ });
    const select = screen.getByRole("combobox", { name: "Choose a prefecture" });
    const search = screen.getByRole("searchbox", { name: "Search prefectures" });
    expect(map.compareDocumentPosition(search) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    const kyoto = within(map).getByRole("button", { name: /Select Kyoto/ });
    const fullViewBox = map.getAttribute("viewBox");
    Object.defineProperty(map, "getBoundingClientRect", { value: () => ({ left: 0, top: 0, width: 300, height: 300 }) });
    fireEvent.wheel(map, { deltaY: -120, clientX: 150, clientY: 150 });
    expect(Number(map.getAttribute("viewBox")?.split(" ")[2])).toBeLessThan(Number(fullViewBox?.split(" ")[2]));
    fireEvent.keyDown(map, { key: "Home" });
    expect(map).toHaveAttribute("viewBox", fullViewBox);
    fireEvent.keyDown(map, { key: "PageUp" });
    const keyboardZoomViewBox = map.getAttribute("viewBox");
    expect(Number(keyboardZoomViewBox?.split(" ")[2])).toBeLessThan(Number(fullViewBox?.split(" ")[2]));
    fireEvent.keyDown(map, { key: "ArrowRight" });
    expect(Number(map.getAttribute("viewBox")?.split(" ")[0])).toBeGreaterThan(Number(keyboardZoomViewBox?.split(" ")[0]));
    fireEvent.keyDown(map, { key: "Home" });
    expect(map).toHaveAttribute("viewBox", fullViewBox);

    fireEvent.keyDown(kyoto, { key: "Enter" });
    expect(select).toHaveValue("jp-26000");
    expect(kyoto).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText(/Selected: Kyoto/)).toBeInTheDocument();
    const focusedViewBox = map.getAttribute("viewBox");
    expect(focusedViewBox).not.toBe(fullViewBox);
    expect(screen.queryByRole("button", { name: "Zoom out on map" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Map controls/ }));
    expect(screen.getByRole("button", { name: /Map controls/ })).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(screen.getByRole("button", { name: "Pan map east" }));
    expect(Number(map.getAttribute("viewBox")?.split(" ")[0])).toBeGreaterThan(Number(focusedViewBox?.split(" ")[0]));
    fireEvent.click(screen.getByRole("button", { name: "Zoom out on map" }));
    expect(Number(map.getAttribute("viewBox")?.split(" ")[2])).toBeGreaterThan(Number(focusedViewBox?.split(" ")[2]));
    fireEvent.click(screen.getByRole("button", { name: "Zoom to selection" }));
    expect(map).toHaveAttribute("viewBox", focusedViewBox);
    fireEvent.click(screen.getByRole("button", { name: "Full map" }));
    expect(map).toHaveAttribute("viewBox", fullViewBox);

    fireEvent.change(select, { target: { value: "jp-27000" } });
    expect(kyoto).toHaveAttribute("aria-pressed", "false");
    expect(within(map).getByRole("button", { name: /Select Osaka/ })).toHaveAttribute("aria-pressed", "true");
    fireEvent.change(select, { target: { value: "jp-26000" } });
    expect(map).toHaveAttribute("viewBox", focusedViewBox);
    fireEvent.click(okinawaInset);
    expect(select).toHaveValue("jp-47000");
    expect(okinawaInset).toHaveAttribute("aria-pressed", "true");
    expect(window.localStorage.getItem(localGuidanceLocationStorageKey)).toBe("nagoya");
  });

  it("lists only researched municipalities and offers Other for general starting points", () => {
    render(<PrefectureFinder locale="en" messages={getInterfaceMessageGroup("en", "finder.")} {...data} />);
    fireEvent.change(screen.getByRole("combobox", { name: "Choose a prefecture" }), { target: { value: "jp-13000" } });
    const municipalitySelect = screen.getByRole("combobox", { name: "Choose a municipality or ward" });
    expect(within(municipalitySelect).queryByRole("option", { name: "Chofu City" })).not.toBeInTheDocument();
    expect(within(municipalitySelect).getAllByRole("option").at(-1)).toHaveTextContent("Other");
    fireEvent.change(municipalitySelect, { target: { value: "other" } });
    expect(screen.queryByRole("heading", { name: "Researched local guidance" })).not.toBeInTheDocument();
    expect(screen.getByText(/Prefecture-wide procedures for these articles have not been researched/)).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "National Health Insurance" }).map((link) => link.getAttribute("href"))).toContain("/articles/joining-national-health-insurance?local=jp-13000#local-guidance-heading");
  });

  it("lists a designated city once and notes that its wards may differ", () => {
    render(<PrefectureFinder locale="en" messages={getInterfaceMessageGroup("en", "finder.")} {...data} />);
    fireEvent.change(screen.getByRole("combobox", { name: "Choose a prefecture" }), { target: { value: "jp-23000" } });
    const municipalitySelect = screen.getByRole("combobox", { name: "Choose a municipality or ward" });
    const optionNames = within(municipalitySelect).getAllByRole("option").map(({ textContent }) => textContent);
    expect(optionNames.filter((name) => name === "Nagoya City")).toHaveLength(1);
    expect(optionNames.at(-1)).toBe("Other");
    fireEvent.change(municipalitySelect, { target: { value: "jp-23100" } });

    expect(screen.getByText(/Nagoya City is divided into wards. Each ward office may have its own procedures/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "National Health Insurance in Nagoya" })).toHaveAttribute("href", "/articles/joining-national-health-insurance?local=jp-23100#local-guidance-heading");
  });
});
