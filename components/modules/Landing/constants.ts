import type { CSSProperties } from "react";

export const BG = "var(--background)";
export const BG2 = "var(--card)";
export const BORDER = "var(--border)";
export const DIM = "var(--muted-foreground)";
export const MID = "var(--foreground)";
export const ACCENT = "var(--primary)";
export const FONT = "var(--font-sans)";

export const WRAP_CLASS = "mx-auto w-full max-w-[1100px] px-4 sm:px-6 lg:px-7 lg:max-w-[1200px] ";

export const wrap: CSSProperties = {
  maxWidth: 1100,
  margin: "0 auto",
  padding: "0 28px",
  width: "100%",
};
