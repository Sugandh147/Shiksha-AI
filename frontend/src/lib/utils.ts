/**
 * src/lib/utils.ts
 * ─────────────────
 * Shared utility functions used throughout the app.
 * cn() merges Tailwind CSS classes safely — avoids conflicts between classes.
 */
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind CSS class names without conflicts */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as a percentage string */
export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

/** Get initials from a full name (e.g., "Priya Sharma" → "PS") */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/** Format a date as a human-friendly string */
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
