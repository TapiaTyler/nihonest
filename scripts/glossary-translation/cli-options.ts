/** Minimal `--flag value` parsing shared by the glossary-draft commands. */
export function readOption(argv: readonly string[], name: string): string | undefined {
  const index = argv.indexOf(`--${name}`);
  if (index < 0) return undefined;
  const value = argv[index + 1];
  if (!value || value.startsWith("--")) throw new Error(`--${name} needs a value.`);
  return value;
}

export function hasFlag(argv: readonly string[], name: string): boolean {
  return argv.includes(`--${name}`);
}

export function timestamp(): string {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

export const defaultClaudeOptions = { model: "sonnet", effort: "high", budgetUsd: 0.5 } as const;
