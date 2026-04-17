import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

test.describe("Create New Project", () => {
  test("should create a new project with dynamic name", async ({
    page,
  }) => {
    // Step 1: Login
    await page.goto("/login");
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page).toHaveURL(/.*projects/);

    // Step 2: Navigate to create project page
    await page.goto("/projects/new");

    // Wait for the dialog to appear
    await expect(page.getByText("Create new project")).toBeVisible();

    // Step 3: Generate dynamic project name
    const timestamp = new Date().toISOString();
    const productName = faker.commerce.productName();
    const fullName = `${timestamp} ${productName}`;
    // Truncate to 30 chars (maxLength)
    const projectName = fullName.substring(0, 30);

    // Step 4: Fill in the title field
    const titleTextarea = page.locator('textarea[name="title"]');
    await titleTextarea.clear();
    await titleTextarea.fill(projectName);

    // Step 5: Verify at least one user is selected (logged-in user is auto-selected)
    const checkedCheckboxes = page.locator(
      'input[name="user"][data-state="checked"]'
    );
    await expect(checkedCheckboxes).toHaveCount(1);

    // Step 6: Submit the form
    await page.getByRole("button", { name: "Accept changes" }).click();

    // Step 7: Verify redirect to projects listing
    await expect(page).toHaveURL(/\/projects$/);

    // Step 8: Verify the new project appears on the page
    // The project name might be the full 30 chars or truncated version
    await expect(page.getByText(projectName)).toBeVisible();
  });
});

