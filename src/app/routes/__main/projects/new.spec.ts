import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

test.describe("Create New Project", () => {
  test.beforeEach(async ({ page }) => {
    // Login as default user (Daniel Serrano)
    await page.goto("/login");
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page).toHaveURL(/.*projects/);
  });

  test("creates project with Faker-generated name", async ({ page }) => {
    // Navigate to create project page
    await page.goto("/projects/new");

    // Wait for the dialog to be visible
    await expect(page.getByText("Create new project")).toBeVisible();

    // Generate project name: timestamp + Faker product name, truncated to 30 chars
    const timestamp = new Date().toISOString();
    const productName = faker.commerce.productName();
    const fullProjectName = `${timestamp} ${productName}`;
    const projectName = fullProjectName.substring(0, 30);

    // Fill in the project name
    const titleInput = page.locator('textarea[name="title"]');
    await titleInput.clear();
    await titleInput.fill(projectName);

    // Verify at least one user is checked (logged-in user should be pre-checked)
    const checkedUserCheckboxes = page.locator('input[name="user"]:checked');
    const checkedCount = await checkedUserCheckboxes.count();
    expect(checkedCount).toBeGreaterThan(0);

    // Submit the form using the Accept button
    await page.getByRole("button", { name: "Accept changes" }).click();

    // Verify redirect to projects list
    await expect(page).toHaveURL(/.*\/projects$/);

    // Verify the new project appears in the list
    await expect(page.getByText(projectName)).toBeVisible();
  });

  test("has title on create project page", async ({ page }) => {
    await page.goto("/projects/new");
    await expect(page).toHaveTitle(/Jira clone - Create project/);
  });

  test("form validation: requires project name", async ({ page }) => {
    await page.goto("/projects/new");

    // Clear the title input
    const titleInput = page.locator('textarea[name="title"]');
    await titleInput.clear();

    // Try to submit with empty name
    await page.getByRole("button", { name: "Accept changes" }).click();

    // Should still be on the create page with error
    await expect(page.getByText("Name is required")).toBeVisible();
  });
});
