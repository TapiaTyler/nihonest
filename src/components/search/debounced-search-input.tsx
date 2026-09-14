"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const searchCommitDelayMs = 200;

/** Isolates keystrokes from catalog rendering and commits after a short pause, blur, or Enter. */
export function DebouncedSearchInput({
  id,
  value,
  onCommit,
  placeholder,
  className,
}: Readonly<{
  id: string;
  value: string;
  onCommit: (value: string) => void;
  placeholder: string;
  className: string;
}>) {
  const [draftValue, setDraftValue] = useState(value);
  const onCommitRef = useRef(onCommit);
  const locallyCommittedValues = useRef(new Set<string>());

  useEffect(() => {
    onCommitRef.current = onCommit;
  }, [onCommit]);

  useEffect(() => {
    // A parent acknowledgement can arrive after the user has typed more. Do not let that older local commit replace the newer draft.
    if (locallyCommittedValues.current.delete(value)) return;
    locallyCommittedValues.current.clear();
    setDraftValue(value);
  }, [value]);

  const commitValue = useCallback((nextValue: string) => {
    if (nextValue === value) return;
    locallyCommittedValues.current.add(nextValue);
    onCommitRef.current(nextValue);
  }, [value]);

  useEffect(() => {
    if (draftValue === value) return;
    const timeout = window.setTimeout(() => commitValue(draftValue), searchCommitDelayMs);
    return () => window.clearTimeout(timeout);
  }, [commitValue, draftValue, value]);

  function commitImmediately() {
    commitValue(draftValue);
  }

  return (
    <input
      id={id}
      type="search"
      value={draftValue}
      onChange={(event) => setDraftValue(event.target.value)}
      onBlur={commitImmediately}
      onKeyDown={(event) => {
        if (event.key === "Enter") commitImmediately();
      }}
      placeholder={placeholder}
      className={className}
    />
  );
}
