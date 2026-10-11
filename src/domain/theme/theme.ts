import { z } from "zod";

/** What the visitor chose. "system" follows the device setting and is the default; the other two override it. */
export const themePreferenceSchema = z.enum(["system", "light", "dark"]);
export type ThemePreference = z.infer<typeof themePreferenceSchema>;
export const defaultThemePreference: ThemePreference = "system";

export const themePreferenceOptions: readonly ThemePreference[] = ["system", "light", "dark"];

/** Browser bar colours, matching the header surface in each theme (slate-950 in dark, white in light). */
export const themeColors = { light: "#ffffff", dark: "#020618" } as const;
