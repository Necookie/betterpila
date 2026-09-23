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

test("header displays live PST Philippine Standard Time clock", async ({ page }) => {
  await page.goto("/");
  const clock = page.locator("#pst-live-clock");
  await expect(clock).toBeVisible();
  await expect(clock).toHaveText(/PST .* UTC\+8/);
});

test("corrections desk renders interactive intake form with linked docket", async ({ page }) => {
  await page.goto("/corrections?record=%2Fofficials%2Fsample-official");
  await expect(page.getByRole("heading", { level: 2, name: /Submit an Editorial Correction/i })).toBeVisible();
  await expect(page.locator("#corr-docket")).toHaveValue("/officials/sample-official");
  await expect(page.getByRole("button", { name: /Email Editorial Desk/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /File on GitHub Issues/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /Copy Memorandum/i })).toBeVisible();
});

test("collection search empty state offers cross-directory search link", async ({ page }) => {
  await page.goto("/projects?q=nonexistentquery");
  await expect(page.getByRole("heading", { level: 2, name: /No matching records found/i })).toBeVisible();
  const crossSearchBtn = page.getByRole("link", { name: /Search all directories for "nonexistentquery"/i });
  await expect(crossSearchBtn).toBeVisible();
  await expect(crossSearchBtn).toHaveAttribute("href", "/search?q=nonexistentquery");
});

test("search empty state allows requesting unverified/missing records", async ({ page }) => {
  await page.goto("/search?q=unlisted-ordinance");
  await expect(page.getByRole("heading", { level: 2, name: /No verified records found/i })).toBeVisible();
  const requestBtn = page.getByRole("link", { name: /Request \/ Submit "unlisted-ordinance"/i });
  await expect(requestBtn).toBeVisible();
  await expect(requestBtn).toHaveAttribute("href", /corrections\?record=Missing%20Record%3A%20unlisted-ordinance/);
});


