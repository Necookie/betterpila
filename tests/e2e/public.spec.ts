import { expect, test } from "@playwright/test";

test("the public portal has working navigation and civic context", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.headers()["content-security-policy"]).toContain("frame-ancestors 'none'");
  await expect(page).toHaveTitle(/Better Pila/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Know what shapes your town.");
  await expect(page.getByText("Pila, Laguna · Public information")).toBeVisible();
  if ((page.viewportSize()?.width ?? 0) < 900) {
    await page.getByText("Menu", { exact: true }).click();
    await expect(page.getByRole("navigation", { name: "Mobile" })).toBeVisible();
  } else {
    await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
  }
  await expect(page.getByText(/independent and source-first/i)).toBeVisible();
});

test("collection pages expose useful empty states", async ({ page }) => {
  await page.goto("/projects");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Projects");
  await expect(page.getByRole("heading", { level: 2, name: "Verification is underway" })).toBeVisible();
  await expect(page.getByText(/has not published verified projects yet/i)).toBeVisible();
});

test("admin pages are not indexed", async ({ page }) => {
  const response = await page.goto("/admin");
  expect(response?.headers()["x-robots-tag"]).toContain("noindex");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});

test("keyboard shortcut / focuses the search input", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("/");
  await expect(page.locator("#home-search")).toBeFocused();
});

