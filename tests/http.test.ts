import { describe, expect, it } from "vitest";
import { requireSameOrigin } from "../src/lib/http";

describe("requireSameOrigin", () => {
  it("allows requests from the portal", () => {
    const request = new Request("https://betterpila.org/api/admin/records", {
      method: "POST",
      headers: { Origin: "https://betterpila.org", "Sec-Fetch-Site": "same-origin" },
    });
    expect(requireSameOrigin(request)).toBeNull();
  });

  it("rejects a foreign origin", () => {
    const request = new Request("https://betterpila.org/api/admin/records", {
      method: "POST",
      headers: { Origin: "https://attacker.example", "Sec-Fetch-Site": "cross-site" },
    });
    expect(requireSameOrigin(request)?.status).toBe(403);
  });
});
