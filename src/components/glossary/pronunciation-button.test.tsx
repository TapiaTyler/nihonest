import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PronunciationButton } from "./pronunciation-button";

class MockUtterance {
  readonly text: string;
  lang = "";
  rate = 1;
  voice: SpeechSynthesisVoice | null = null;
  onstart: (() => void) | null = null;
  onpause: (() => void) | null = null;
  onresume: (() => void) | null = null;
  onend: (() => void) | null = null;
  onerror: (() => void) | null = null;

  constructor(text: string) {
    this.text = text;
  }
}

describe("PronunciationButton", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("speaks the kana with a requested Japanese voice and exposes playback states", () => {
    let utterance: MockUtterance | undefined;
    const japaneseVoice = { lang: "ja-JP" } as SpeechSynthesisVoice;
    const synthesis = {
      cancel: vi.fn(),
      getVoices: vi.fn(() => [japaneseVoice]),
      speak: vi.fn((nextUtterance: MockUtterance) => {
        utterance = nextUtterance;
        nextUtterance.onstart?.();
      }),
    };
    vi.stubGlobal("SpeechSynthesisUtterance", MockUtterance);
    vi.stubGlobal("speechSynthesis", synthesis);

    render(<PronunciationButton japanese="在留資格" kana="ざいりゅうしかく" englishName="Status of residence" />);
    fireEvent.click(screen.getByRole("button", { name: "Play pronunciation for Status of residence" }));
    expect(synthesis.speak).toHaveBeenCalledOnce();
    expect(utterance).toMatchObject({ text: "ざいりゅうしかく", lang: "ja-JP", rate: 0.9, voice: japaneseVoice });

    fireEvent.click(screen.getByRole("button", { name: "Stop pronunciation for Status of residence" }));
    expect(synthesis.cancel).toHaveBeenCalledTimes(2);
    expect(screen.getByRole("button", { name: "Replay pronunciation for Status of residence" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Replay pronunciation for Status of residence" }));
    act(() => utterance?.onend?.());
    expect(screen.getByRole("button", { name: "Replay pronunciation for Status of residence" })).toBeInTheDocument();
  });

  it("disables the control when browser speech is unavailable", () => {
    vi.stubGlobal("SpeechSynthesisUtterance", undefined);
    vi.stubGlobal("speechSynthesis", undefined);
    render(<PronunciationButton japanese="在留資格" englishName="Status of residence" />);
    expect(screen.getByRole("button", { name: "Pronunciation unavailable for Status of residence" })).toBeDisabled();
  });
});
