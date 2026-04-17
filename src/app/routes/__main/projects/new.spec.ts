import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

// Maximum allowed length for project titles in the UI
const MAX_PROJECT_NAME_LENGTH = 30;

/**
 * Generates an ISO-like timestamp for test data uniqueness.
 * Used to create unique project names that can be traced back to test run time.
 */
function getLocalTimestamp(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

test("create new project with faker-generated name", async ({ page }) => {
  // Login flow
  await page.goto("/login");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL(/.*projects$/);

  // Navigate to project creation page
  await page.goto("/projects/new");

  // Generate unique project name: timestamp + random product name, truncated to max length
  const projectName = `${getLocalTimestamp()} ${faker.commerce.productName()}`.slice(
    0,
    MAX_PROJECT_NAME_LENGTH
  );

  // Fill in project title
  const titleTextarea = page.locator('textarea[name="title"]');
  await expect(titleTextarea).toBeVisible();
  await titleTextarea.fill(projectName);

  // Submit and verify project appears in list
  await page.getByRole("button", { name: "Accept changes" }).click();
  await expect(page).toHaveURL(/.*projects$/);
  await expect(page.getByText(projectName)).toBeVisible();
});
