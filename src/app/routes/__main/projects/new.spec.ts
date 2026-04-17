import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

test.describe("Create New Project", () => {
  test.beforeEach(async ({ page }) => {
    // Login as default user (Daniel Serrano)
    await page.goto("/login");
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page).toHaveURL(/.*projects/);
  });

  test("creates a project with dynamically generated name", async ({ page }) => {
    // Generate project name: timestamp + product name, truncated to 30 chars
    const timestamp = Date.now().toString();
    const productName = faker.commerce.productName();
    const fullProjectName = `${timestamp} ${productName}`;
    const projectName = fullProjectName.substring(0, 30);

    // Navigate to the create project page
    await page.goto("/projects/new");

    // Fill in the project name (Title component with maxLength=30)
    const titleTextarea = page.locator('textarea[name="title"]');
    await titleTextarea.fill(projectName);

    // Verify the title was set correctly (respecting 30-char limit)
    await expect(titleTextarea).toHaveValue(projectName);

    // Ensure at least one user is selected before submit
    const userCheckboxes = page.locator('input[name="user"]');
    const checkedUserCount = await userCheckboxes.evaluateAll((checkboxes) =>
      checkboxes.filter((checkbox) => (checkbox as HTMLInputElement).checked)
        .length
    );

    if (checkedUserCount === 0) {
      await page.locator('label[for^="checkbox-"]').first().click();
    }

    // Submit the form (click the "Accept changes" button)
    await page.getByRole("button", { name: "Accept changes" }).click();

    // Wait for redirect to /projects (without /new)
    await expect(page).toHaveURL(/^.*\/projects$/);

    // Verify the newly created project appears in the project list
    // Project names are rendered in <h2> tags within ProjectCard components
    await expect(page.getByRole("heading", { name: projectName, level: 2 })).toBeVisible();
  });
});
