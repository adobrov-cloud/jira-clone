import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

/**
 * Maximum character length for project names.
 * Ensures compatibility with database constraints and UI display.
 */
const MAX_PROJECT_NAME_LENGTH = 30;

/**
 * Generates a unique project name using timestamp and random product name.
 * Truncates to maximum length to comply with project name constraints.
 */
function generateUniqueProjectName(): string {
  const timestamp = new Date().toISOString();
  const productName = faker.commerce.productName();
  const fullName = `${timestamp} ${productName}`;
  return fullName.substring(0, MAX_PROJECT_NAME_LENGTH);
}

test("create new project with dynamic name", async ({ page }) => {
  // Login as default user
  await page.goto("/login");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL(/.*projects/);

  // Navigate to project creation form
  await page.goto("/projects/new");

  const projectName = generateUniqueProjectName();

  // Fill in the project name (user is pre-selected by default)
  await page.locator('textarea[name="title"]').fill(projectName);

  // Submit and wait for redirect to projects list
  await page.getByRole("button", { name: "Accept changes" }).click();
  await expect(page).toHaveURL(/^(?!.*\/new).*\/projects$/);

  // Verify the newly created project appears in the list
  await expect(page.getByText(projectName)).toBeVisible();
});
