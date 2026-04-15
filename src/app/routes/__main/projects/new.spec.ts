import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

test("create project with timestamped faker name", async ({ page }) => {
  // Login flow
  await page.goto("/login");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL(/.*projects/);

  // Navigate to create project page
  await page.goto("/projects/new");

  // Generate project name with timestamp and faker product name
  const timestamp = new Date().toISOString();
  const productName = faker.commerce.productName();
  const fullName = `${timestamp} ${productName}`;

  // The Title component has maxLength={30}, so truncate to 30 chars
  const expectedName = fullName.substring(0, 30);

  // Fill the title field
  // The textarea is auto-focused and starts empty
  // Type the full name so the component enforces maxLength character-by-character
  const titleTextarea = page.locator('textarea[name="title"]');
  await titleTextarea.type(fullName);

  // Verify at least one user is checked (auto-checked for logged-in user)
  const checkedUsers = page.locator('input[name="user"]:checked');
  await expect(checkedUsers).toHaveCount(1);

  // Submit the form
  await page.getByRole("button", { name: "Accept changes" }).click();

  // Wait for redirect to projects page
  await expect(page).toHaveURL(/.*projects$/);

  // Verify the new project appears with the expected truncated name
  // Project cards show the name in an h2 element
  await expect(page.getByRole("heading", { name: expectedName })).toBeVisible();
});
