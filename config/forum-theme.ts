export interface ForumThemeTokens {
  key: ForumThemeKey
  name: string
  primary: string
  secondary: string
  accent: string
  muted: string
  surface: string
  surfaceAccent: string
  surfaceMuted: string
  surfaceElevated: string
  foreground: string
  foregroundMuted: string
  heroGradient: string
  sidebarBackground: string
  border: string
  borderStrong: string
  glow: string
}

type ForumThemeDictionary = Record<string, ForumThemeTokens>

export type ForumThemeKey = keyof ForumThemeDictionary

const forumThemes: ForumThemeDictionary = {
  default: {
    key: "default",
    name: "Aurora",
    primary: "#f43f5e",
    secondary: "#ec4899",
    accent: "#22d3ee",
    muted: "#64748b",
    surface: "rgba(255,255,255,0.95)",
    surfaceAccent: "rgba(250,248,255,0.75)",
    surfaceMuted: "rgba(248,250,252,0.7)",
    surfaceElevated: "rgba(255,255,255,0.9)",
    foreground: "#0f172a",
    foregroundMuted: "#475569",
    heroGradient: "linear-gradient(140deg, #fff0f6 0%, #e0f2fe 100%)",
    sidebarBackground: "rgba(15,23,42,0.05)",
    border: "rgba(244,63,94,0.18)",
    borderStrong: "rgba(244,63,94,0.32)",
    glow: "0 20px 45px rgba(244,63,94,0.25)",
  },
  sunset: {
    key: "sunset",
    name: "Vesper",
    primary: "#fb923c",
    secondary: "#f97316",
    accent: "#facc15",
    muted: "#f97316",
    surface: "rgba(255,248,240,0.94)",
    surfaceAccent: "rgba(255,247,237,0.76)",
    surfaceMuted: "rgba(255,237,213,0.78)",
    surfaceElevated: "rgba(255,251,235,0.88)",
    foreground: "#3f0a0a",
    foregroundMuted: "#7c2d12",
    heroGradient: "linear-gradient(140deg, #fff7ed 0%, #fde68a 100%)",
    sidebarBackground: "rgba(254,215,170,0.2)",
    border: "rgba(249,115,22,0.22)",
    borderStrong: "rgba(194,65,12,0.32)",
    glow: "0 20px 45px rgba(249,115,22,0.28)",
  },
  midnight: {
    key: "midnight",
    name: "Lumen",
    primary: "#38bdf8",
    secondary: "#6366f1",
    accent: "#a855f7",
    muted: "#94a3b8",
    surface: "rgba(15,23,42,0.82)",
    surfaceAccent: "rgba(30,41,59,0.72)",
    surfaceMuted: "rgba(30,64,175,0.36)",
    surfaceElevated: "rgba(15,23,42,0.9)",
    foreground: "#e2e8f0",
    foregroundMuted: "#94a3b8",
    heroGradient: "linear-gradient(140deg, #1e3a8a 0%, #0ea5e9 100%)",
    sidebarBackground: "rgba(8,47,73,0.55)",
    border: "rgba(56,189,248,0.22)",
    borderStrong: "rgba(59,130,246,0.32)",
    glow: "0 25px 55px rgba(59,130,246,0.35)",
  },
}

export function getForumTheme(key?: string | null): ForumThemeTokens {
  if (!key) return forumThemes.default
  return forumThemes[key] ?? forumThemes.default
}

export function buildThemeCssVariables(theme: ForumThemeTokens): Record<string, string> {
  return {
    "--forum-primary": theme.primary,
    "--forum-secondary": theme.secondary,
    "--forum-accent": theme.accent,
    "--forum-muted": theme.muted,
    "--forum-surface": theme.surface,
    "--forum-surface-accent": theme.surfaceAccent,
    "--forum-surface-muted": theme.surfaceMuted,
    "--forum-surface-elevated": theme.surfaceElevated,
    "--forum-foreground": theme.foreground,
    "--forum-foreground-muted": theme.foregroundMuted,
    "--forum-hero-gradient": theme.heroGradient,
    "--forum-sidebar-bg": theme.sidebarBackground,
    "--forum-border": theme.border,
    "--forum-border-strong": theme.borderStrong,
    "--forum-glow": theme.glow,
  }
}
