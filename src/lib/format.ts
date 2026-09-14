import type { RecordType } from "./types";

export function formatDate(value: string | null | undefined): string {
  if (!value) return "Not yet verified";
  const date = new Date(`${value.length === 10 ? `${value}T00:00:00Z` : value}`);
  if (Number.isNaN(date.valueOf())) return value;
  return new Intl.DateTimeFormat("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Manila",
  }).format(date);
}

export function publicPath(type: RecordType, slug: string): string {
  const sections: Record<RecordType, string> = {
    official: "officials",
    office: "offices",
    budget: "budgets",
    project: "projects",
    ordinance: "ordinances",
    resolution: "resolutions",
  };
  return `/${sections[type]}/${slug}`;
}

export function payloadValue(payload: Record<string, unknown>, key: string): string | null {
  const value = payload[key];
  return typeof value === "string" && value.trim() ? value : null;
}

