import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

// Max length constraint from the Title component
const MAX_PROJECT_NAME_LENGTH = 30;

/**
 * Generate a human-readable timestamp in local time.
 * Uses Swedish locale (sv-SE) for ISO-style formatting (YYYY-MM-DD HH:MM).
 * Seconds are removed to keep the format concise.
 */
function generateTimestamp(): string {
  return new Date()
    .toLocaleString("sv-SE")
    .replace(/[T]/g, " ")
    .replace(/:\d{2}$/, "");
}

/**
 * Generate a unique project name combining timestamp and faker-generated product name.
 * Truncates to MAX_PROJECT_NAME_LENGTH to comply with form validation.
 */
function generateProjectName(): string {
  const timestamp = generateTimestamp();
  const productName = faker.commerce.productName();
  const fullName = `${timestamp} ${productName}`;
  return fullName.substring(0, MAX_PROJECT_NAME_LENGTH);
}

test("create project with dynamic name", async ({ page }) => {
  // Login first
  await page.goto("/login");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL(/.*projects/);

  // Navigate to new project page
  await page.goto("/projects/new");

  // Generate a unique project name for this test run
  const projectName = generateProjectName();

  // Fill in the project title
  const titleInput = page.locator('textarea[name="title"]');
  await titleInput.clear();
  await titleInput.fill(projectName);

  // Submit the form
  await page.getByRole("button", { name: "Accept changes" }).click();

  // Verify redirect to projects list
  await expect(page).toHaveURL(/.*\/projects$/);

  // Verify the newly created project appears in the list
  await expect(page.getByText(projectName)).toBeVisible();
});
