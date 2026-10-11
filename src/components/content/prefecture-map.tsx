"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { FinderPrefecture } from "@/domain/geography/prefecture";
import { prefectureMapPaths } from "@/data/geography/prefecture-map-paths";
import { DisclosureChevron } from "@/components/navigation/disclosure-chevron";
import { fillInterfaceMessage, type InterfaceMessageGroup } from "@/domain/localization/interface-message-lookup";

type Viewport = Readonly<{ x: number; y: number; width: number; height: number }>;
const fullView: Viewport = { x: 145, y: 10, width: 510, height: 515 };
const mapRatio = fullView.height / fullView.width;
const controlClass = "min-h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-teal-900 hover:border-teal-700 focus:outline-2 focus:outline-offset-2 focus:outline-teal-700";

function focusView(focus: readonly number[]): Viewport {
  const width = Math.min(510, Math.max(70, focus[2] * 1.8));
  const height = width * mapRatio;
  return { x: focus[0] - width / 2, y: focus[1] - height / 2, width, height };
}

function zoomAt(view: Viewport, factor: number, xFraction = 0.5, yFraction = 0.5): Viewport {
  const width = Math.min(650, Math.max(35, view.width * factor));
  const height = width * mapRatio;
  return {
    x: view.x + view.width * xFraction - width * xFraction,
    y: view.y + view.height * yFraction - height * yFraction,
    width,
    height,
  };
}

type PointerPosition = Readonly<{ x: number; y: number }>;

/** An optional visual selector; the native prefecture select remains the accessible text route. */
export function PrefectureMap({
  prefectures,
  selectedId,
  onSelect,
  locale = "en",
  messages,
}: Readonly<{
  locale?: "en" | "ja";
  /** The map's `finder.map.` interface messages in `locale`. */
  messages: InterfaceMessageGroup<"finder.map.">;
  prefectures: readonly FinderPrefecture[];
  selectedId: string;
  onSelect: (id: string) => void;
}>) {
  const [focusedCode, setFocusedCode] = useState("");
  // A label that names the prefecture under the pointer (or the keyboard focus); position is relative to the map frame.
  const [hoverLabel, setHoverLabel] = useState<Readonly<{ names: FinderPrefecture["names"]; x: number; y: number; flip: boolean }> | null>(null);
  const [controlsOpen, setControlsOpen] = useState(false);
  const controlsId = useId();
  const mapRef = useRef<SVGSVGElement>(null);
  const mapFrameRef = useRef<HTMLDivElement>(null);
  const pointers = useRef(new Map<number, PointerPosition>());
  const pointerStarts = useRef(new Map<number, PointerPosition>());
  const dragged = useRef(false);
  const prefecturesByCode = new Map(prefectures.map((prefecture) => [prefecture.code.slice(0, 2), prefecture]));
  const selected = prefectures.find(({ id }) => id === selectedId);
  const selectedPath = prefectureMapPaths.find(({ code }) => code === selected?.code.slice(0, 2));
  const [viewport, setViewport] = useState<Viewport>(() => selectedPath ? focusView(selectedPath.focus) : fullView);
  const [previousSelection, setPreviousSelection] = useState(selectedId);
  if (previousSelection !== selectedId) {
    setPreviousSelection(selectedId);
    setViewport(selectedPath ? focusView(selectedPath.focus) : fullView);
  }
  const zoomLevel = Math.round((fullView.width / viewport.width) * 10) / 10;
  // At rest the map owns pinch and sideways drags but lets a vertical swipe scroll the page, so it is never a trap
  // on a phone; once zoomed in, every drag pans the map.
  const touchAction = zoomLevel > 1 ? "touch-none" : "touch-pan-y";
  const changeView = setViewport;
  const zoom = (factor: number) => setViewport((view) => zoomAt(view, factor));
  const pan = (dx: number, dy: number) => setViewport((view) => ({
    ...view,
    x: view.x + dx * view.width * 0.2,
    y: view.y + dy * view.height * 0.2,
  }));
  useEffect(() => {
    const map = mapRef.current;
    const frame = mapFrameRef.current;
    if (!map || !frame) return;
    const onWheel = (event: WheelEvent) => {
      setHoverLabel(null);
      event.preventDefault();
      const bounds = map.getBoundingClientRect();
      const delta = event.deltaY * (event.deltaMode === WheelEvent.DOM_DELTA_LINE ? 16 : event.deltaMode === WheelEvent.DOM_DELTA_PAGE ? bounds.height : 1);
      const factor = Math.exp(Math.max(-0.45, Math.min(0.45, delta * 0.004)));
      setViewport((view) => zoomAt(view, factor,
        Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width)),
        Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height))));
    };
    frame.addEventListener("wheel", onWheel, { passive: false });
    return () => frame.removeEventListener("wheel", onWheel);
  }, []);
  const handlePointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    const previous = pointers.current.get(event.pointerId);
    if (!previous) return;
    const next = { x: event.clientX, y: event.clientY };
    const start = pointerStarts.current.get(event.pointerId);
    if (pointers.current.size === 1) {
      if (start && Math.hypot(next.x - start.x, next.y - start.y) > 5) dragged.current = true;
      if (dragged.current) {
        const bounds = event.currentTarget.getBoundingClientRect();
        setViewport((view) => ({
          ...view,
          x: view.x - (next.x - previous.x) * view.width / bounds.width,
          y: view.y - (next.y - previous.y) * view.height / bounds.height,
        }));
        event.currentTarget.setPointerCapture(event.pointerId);
      }
    } else if (pointers.current.size === 2) {
      dragged.current = true;
      const other = [...pointers.current.entries()].find(([id]) => id !== event.pointerId)?.[1];
      if (other) {
        const oldDistance = Math.hypot(previous.x - other.x, previous.y - other.y);
        const newDistance = Math.hypot(next.x - other.x, next.y - other.y);
        const bounds = event.currentTarget.getBoundingClientRect();
        const oldMid = { x: (previous.x + other.x) / 2, y: (previous.y + other.y) / 2 };
        const newMid = { x: (next.x + other.x) / 2, y: (next.y + other.y) / 2 };
        setViewport((view) => {
          const zoomed = zoomAt(view, oldDistance / Math.max(newDistance, 1),
            (oldMid.x - bounds.left) / bounds.width, (oldMid.y - bounds.top) / bounds.height);
          return {
            ...zoomed,
            x: zoomed.x - (newMid.x - oldMid.x) * zoomed.width / bounds.width,
            y: zoomed.y - (newMid.y - oldMid.y) * zoomed.height / bounds.height,
          };
        });
        event.currentTarget.setPointerCapture(event.pointerId);
      }
    }
    pointers.current.set(event.pointerId, next);
  };
  const releasePointer = (event: React.PointerEvent<SVGSVGElement>) => {
    pointers.current.delete(event.pointerId);
    pointerStarts.current.delete(event.pointerId);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  /** Places the label relative to the map frame that contains `from`; positions come from the event, not from refs. */
  const showHoverLabel = (names: FinderPrefecture["names"], from: Element, clientX: number, clientY: number) => {
    const frame = from.closest("[data-map-frame]")?.getBoundingClientRect();
    if (!frame) return;
    const x = clientX - frame.left;
    setHoverLabel({ names, x, y: clientY - frame.top, flip: x > frame.width * 0.6 });
  };
  /** Hover is for mouse and pen only; a tap on a touch screen selects and must not leave a label behind. */
  const onHoverPointer = (names: FinderPrefecture["names"]) => (event: React.PointerEvent) => {
    if (event.pointerType === "touch") return;
    showHoverLabel(names, event.currentTarget as Element, event.clientX, event.clientY);
  };
  const okinawa = prefecturesByCode.get("47");
  const okinawaPath = prefectureMapPaths.find(({ code }) => code === "47");
  const renderPrefecture = ({ code, d }: (typeof prefectureMapPaths)[number]) => {
    const prefecture = prefecturesByCode.get(code);
    if (!prefecture) return null;
    const isSelected = selectedId === prefecture.id;
    const isFocused = focusedCode === code;
    return (
      <g
        key={code}
        role="button"
        tabIndex={0}
        className="focus:outline-none"
        aria-label={fillInterfaceMessage(messages["finder.map.selectPrefecture"], prefecture.names)}
        aria-pressed={isSelected}
        onClick={() => onSelect(prefecture.id)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onSelect(prefecture.id);
          }
        }}
        onFocus={(event) => {
          setFocusedCode(code);
          if (event.currentTarget.matches(":focus-visible")) {
            const box = event.currentTarget.getBoundingClientRect();
            showHoverLabel(prefecture.names, event.currentTarget, box.left + box.width / 2, box.top + box.height / 2);
          }
        }}
        onBlur={() => { setFocusedCode(""); setHoverLabel(null); }}
        onPointerEnter={onHoverPointer(prefecture.names)}
        onPointerMove={onHoverPointer(prefecture.names)}
        onPointerLeave={() => setHoverLabel(null)}
        onMouseEnter={() => setFocusedCode(code)}
        onMouseLeave={(event) => { if (document.activeElement !== event.currentTarget) setFocusedCode(""); }}
      >
        <path
          d={d}
          fillRule="evenodd"
          fill={isFocused ? "#14b8a6" : isSelected ? "#0f766e" : "#a7dcd6"}
          stroke={isSelected ? "none" : "#ffffff"}
          strokeWidth={1.2}
          vectorEffect="non-scaling-stroke"
          className="cursor-pointer transition-colors"
        />
      </g>
    );
  };

  return (
    <details className="group rounded-xl border border-teal-200 bg-white p-3 sm:p-4">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 py-2 text-base font-semibold text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 [&::-webkit-details-marker]:hidden">
        <span>{messages["finder.map.summary"]}</span>
        <DisclosureChevron />
      </summary>
      <p className="mt-1 text-xs leading-5 text-slate-600">
        {messages["finder.map.instructions"]}
      </p>
      <div ref={mapFrameRef} data-map-frame className="relative mx-auto mt-3 max-w-xl pb-24 sm:pb-0">
      <svg
        ref={mapRef}
        viewBox={`${viewport.x} ${viewport.y} ${viewport.width} ${viewport.height}`}
        role="group"
        aria-label={messages["finder.map.mapLabel"]}
        tabIndex={0}
        onKeyDown={(event) => {
          const actions: Record<string, () => void> = {
            ArrowUp: () => pan(0, -1),
            ArrowDown: () => pan(0, 1),
            ArrowLeft: () => pan(-1, 0),
            ArrowRight: () => pan(1, 0),
            PageUp: () => zoom(0.75),
            PageDown: () => zoom(1 / 0.75),
            Home: () => changeView(fullView),
            End: () => changeView(selectedPath ? focusView(selectedPath.focus) : fullView),
          };
          const action = actions[event.key];
          if (action) {
            event.preventDefault();
            action();
          }
        }}
        onPointerDown={(event) => {
          setHoverLabel(null);
          if (event.pointerType === "mouse" && event.button !== 0) return;
          if (pointers.current.size === 0) dragged.current = false;
          const position = { x: event.clientX, y: event.clientY };
          pointers.current.set(event.pointerId, position);
          pointerStarts.current.set(event.pointerId, position);
        }}
        onPointerMove={handlePointerMove}
        onPointerUp={releasePointer}
        onPointerCancel={releasePointer}
        onClickCapture={(event) => {
          if (dragged.current) {
            event.preventDefault();
            event.stopPropagation();
            dragged.current = false;
          }
        }}
        className={`block h-auto w-full cursor-grab ${touchAction} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 active:cursor-grabbing`}
      >
        {prefectureMapPaths.filter(({ code }) => code !== "47").map(renderPrefecture)}
        {selectedPath && (
          <path
            d={selectedPath.d}
            fillRule="evenodd"
            fill={focusedCode === selectedPath.code ? "#14b8a6" : "#0f766e"}
            stroke={focusedCode === selectedPath.code ? "#14b8a6" : "#0f766e"}
            strokeWidth={1.5}
            vectorEffect="non-scaling-stroke"
            pointerEvents="none"
            aria-hidden="true"
          />
        )}
      </svg>
      <button
        type="button"
        aria-expanded={controlsOpen}
        aria-controls={controlsId}
        onClick={() => setControlsOpen((open) => !open)}
        className="absolute right-2 top-2 z-20 inline-flex min-h-11 items-center gap-2 rounded-lg border border-teal-600 bg-white px-3 text-sm font-semibold text-teal-900 shadow-sm focus:outline-2 focus:outline-offset-2 focus:outline-teal-700"
      >
        {messages["finder.map.controls"]}
        <DisclosureChevron open={controlsOpen} />
      </button>
      {controlsOpen && (
        <div id={controlsId} role="group" aria-label={messages["finder.map.controlsLabel"]} data-map-controls className="absolute right-2 top-16 z-20 grid w-44 max-w-[calc(100%-1rem)] gap-2 rounded-xl border border-teal-200 bg-white p-2 shadow-lg">
          <div className="grid grid-cols-2 gap-2">
            <button type="button" className={controlClass} onClick={() => zoom(0.75)} aria-label={messages["finder.map.zoomIn"]}>+</button>
            <button type="button" className={controlClass} onClick={() => zoom(1 / 0.75)} aria-label={messages["finder.map.zoomOut"]}>−</button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span />
            <button type="button" className={controlClass} onClick={() => pan(0, -1)} aria-label={messages["finder.map.panNorth"]}>↑</button>
            <span />
            <button type="button" className={controlClass} onClick={() => pan(-1, 0)} aria-label={messages["finder.map.panWest"]}>←</button>
            <button type="button" className={controlClass} onClick={() => pan(0, 1)} aria-label={messages["finder.map.panSouth"]}>↓</button>
            <button type="button" className={controlClass} onClick={() => pan(1, 0)} aria-label={messages["finder.map.panEast"]}>→</button>
          </div>
          <button type="button" className={controlClass} onClick={() => changeView(selectedPath ? focusView(selectedPath.focus) : fullView)} disabled={!selectedPath}>{messages["finder.map.zoomToSelection"]}</button>
          <button type="button" className={controlClass} onClick={() => changeView(fullView)}>{messages["finder.map.fullMap"]}</button>
        </div>
      )}
      {hoverLabel && (
        <div
          aria-hidden="true"
          data-map-hover-label
          className="pointer-events-none absolute z-30 whitespace-nowrap rounded-md bg-slate-950 px-2.5 py-1.5 text-xs font-medium text-white shadow-lg"
          style={{ left: hoverLabel.x, top: hoverLabel.y, transform: hoverLabel.flip ? "translate(calc(-100% - 12px), 16px)" : "translate(12px, 16px)" }}
        >
          {locale === "ja"
            ? <span lang="ja">{hoverLabel.names.ja}</span>
            : <>{hoverLabel.names.en} · <span lang="ja">{hoverLabel.names.ja}</span></>}
        </div>
      )}
      {okinawa && okinawaPath && (
        <button
          type="button"
          aria-label={fillInterfaceMessage(messages["finder.map.selectInset"], okinawa.names)}
          aria-pressed={selectedId === okinawa.id}
          onClick={() => onSelect(okinawa.id)}
          onPointerEnter={onHoverPointer(okinawa.names)}
          onPointerMove={onHoverPointer(okinawa.names)}
          onPointerLeave={() => setHoverLabel(null)}
          className="absolute bottom-2 left-2 z-10 block w-1/3 max-w-36 cursor-pointer rounded-lg border border-slate-200 bg-slate-50 p-2 text-left shadow-sm hover:border-teal-600 focus:outline-2 focus:outline-offset-2 focus:outline-teal-700"
        >
          <span className="text-xs font-medium text-slate-700">{messages["finder.map.insetLabel"]}</span>
          <svg viewBox="30 510 215 110" aria-hidden="true" className="mt-1 block h-auto w-full">
            <path d={okinawaPath.d} fillRule="evenodd" fill={selectedId === okinawa.id ? "#0f766e" : "#a7dcd6"} stroke="#0f766e" strokeWidth="2" />
          </svg>
        </button>
      )}
      </div>
      <p className="mt-2 text-xs text-slate-600" aria-live="polite">{fillInterfaceMessage(messages["finder.map.zoomLevel"], { level: String(zoomLevel) })}</p>
      <p className={`mt-2 text-teal-900 ${selected ? "text-lg font-semibold leading-7" : "text-sm font-medium"}`} aria-live="polite">
        {selected ? fillInterfaceMessage(messages["finder.map.selected"], selected.names) : messages["finder.map.choose"]}
      </p>
      <p className="mt-2 text-xs leading-5 text-slate-600">
        {messages["finder.map.attribution"]}{locale === "ja" ? "" : " "}
        <a
          href="https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N03-v3_1.html"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-2 hover:text-teal-800"
        >
          {messages["finder.map.attributionSource"]}
        </a>{locale === "ja" ? "。" : "."}
      </p>
    </details>
  );
}
