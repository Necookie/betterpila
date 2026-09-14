import { describe, expect, it } from "vitest";
import { recordInputSchema, searchSchema, slugify } from "../src/lib/validation";

describe("slugify", () => {
  it("creates a stable public URL segment", () => {
    expect(slugify("  Municipal Mayor’s Office  ")).toBe("municipal-mayor-s-office");
  });

  it("removes unsupported characters", () => {
    expect(slugify("Pila — Laguna! 2026")).toBe("pila-laguna-2026");
  });
});

describe("recordInputSchema", () => {
  it("accepts a sourced draft-shaped record", () => {
    const result = recordInputSchema.safeParse({
      type: "project",
      slug: "sample-project",
      title: "Sample project",
      summary: "A plain-language description long enough for publication review.",
      payload: { location: "Pila, Laguna" },
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.status).toBe("draft");
  });

  it("rejects an unsafe slug and short summary", () => {
    expect(recordInputSchema.safeParse({
      type: "budget",
      slug: "Not Safe",
      title: "Budget",
      summary: "Too short",
      payload: {},
    }).success).toBe(false);
  });
});

describe("searchSchema", () => {
  it("coerces a valid year", () => {
    expect(searchSchema.parse({ q: "roads", year: "2026" })).toMatchObject({ q: "roads", year: 2026 });
  });
});
