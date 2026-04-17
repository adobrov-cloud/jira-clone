import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

// Max length for project title field
const MAX_PROJECT_TITLE_LENGTH = 30;

/**
 * Generates a unique project name using timestamp and faker.
 * Ensures name is truncated to fit the project title field length constraint.
 */
function generateUniqueProjectName(): string {
  const timestamp = new Date().toISOString();
  const productName = faker.commerce.productName();
  const fullName = `${timestamp} ${productName}`;
  return fullName.substring(0, MAX_PROJECT_TITLE_LENGTH);
}

test("create new project with dynamic name", async ({ page }) => {
  // Authenticate user via login flow
  await page.goto("/login");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL(/.*projects/);

  // Navigate to create new project page
  await page.goto("/projects/new");

  const projectName = generateUniqueProjectName();

  // Fill in the project title
  const titleInput = page.locator('textarea[name="title"]');
  await titleInput.fill(projectName);

  // Logged-in user checkbox is pre-checked by default (defaultChecked={user.id === loggedUser?.id})
  // No need to manually check it

  // Submit the form
  await page.getByRole("button", { name: "Accept changes" }).click();

  // Wait for redirect to projects list
  await expect(page).toHaveURL(/.*projects$/);

  // Verify the new project appears in the projects list
  await expect(page.getByRole("heading", { name: projectName })).toBeVisible();
});
