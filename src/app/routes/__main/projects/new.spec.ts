import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

// Max length enforced by the title field in the form
const MAX_PROJECT_NAME_LENGTH = 30;

/**
 * Generates a unique project name combining timestamp and random product name.
 * Ensures uniqueness across test runs to avoid collisions in parallel execution.
 */
function generateUniqueProjectName(): string {
  const timestamp = new Date().toISOString();
  const productName = faker.commerce.productName();
  const fullName = `${timestamp} ${productName}`;
  return fullName.substring(0, MAX_PROJECT_NAME_LENGTH);
}

test.describe("Create New Project", () => {
  test("should create a new project with dynamic name", async ({ page }) => {
    // Login with the test user
    await page.goto("/login");
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page).toHaveURL(/.*projects/);

    // Navigate to the create project form
    await page.goto("/projects/new");
    await expect(page.getByText("Create new project")).toBeVisible();

    // Generate a unique project name to avoid test collisions
    const projectName = generateUniqueProjectName();

    // Fill in the project title
    const titleTextarea = page.locator('textarea[name="title"]');
    await titleTextarea.clear();
    await titleTextarea.fill(projectName);

    // Verify the logged-in user is auto-selected as a project member
    const checkedCheckboxes = page.locator('input[name="user"][data-state="checked"]');
    await expect(checkedCheckboxes).toHaveCount(1);

    // Submit the form
    await page.getByRole("button", { name: "Accept changes" }).click();

    // Verify successful creation: redirect to projects list
    await expect(page).toHaveURL(/\/projects$/);

    // Verify the new project appears in the list
    await expect(page.getByText(projectName)).toBeVisible();
  });
});
