import { z } from "zod";
import { editorialStatuses, recordTypes } from "./types";

export const recordInputSchema = z.object({
  type: z.enum(recordTypes),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase words separated by hyphens."),
  title: z.string().trim().min(2).max(180),
  summary: z.string().trim().min(20).max(500),
  body: z.string().trim().max(20_000).nullable().optional(),
  status: z.enum(editorialStatuses).default("draft"),
  lastVerifiedAt: z.iso.date().nullable().optional(),
  reviewDueAt: z.iso.date().nullable().optional(),
  metaTitle: z.string().trim().max(70).nullable().optional(),
  metaDescription: z.string().trim().max(170).nullable().optional(),
  payload: z.record(z.string(), z.unknown()).default({}),
});

export const searchSchema = z.object({
  q: z.string().trim().max(100).default(""),
  type: z.enum(recordTypes).optional(),
  year: z.coerce.number().int().min(1900).max(2200).optional(),
});

export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

