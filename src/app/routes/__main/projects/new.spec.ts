import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

// Max length enforced by project name validation
const MAX_PROJECT_NAME_LENGTH = 30;

/**
 * Generate a unique project name using timestamp and Faker.
 * Truncated to fit within project name length constraints.
 */
function generateProjectName(): string {
  const timestamp = new Date().toISOString();
  const productName = faker.commerce.productName();
  const fullProjectName = `${timestamp} ${productName}`;
  return fullProjectName.substring(0, MAX_PROJECT_NAME_LENGTH);
}

function getTitleInput(page: any) {
  return page.locator('textarea[name="title"]');
}

function getAcceptButton(page: any) {
  return page.getByRole("button", { name: "Accept changes" });
}

test.describe("Create New Project", () => {
  test.beforeEach(async ({ page }) => {
    // Login as default user (Daniel Serrano) to establish session
    await page.goto("/login");
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page).toHaveURL(/.*projects/);
  });

  test("creates project with Faker-generated name", async ({ page }) => {
    await page.goto("/projects/new");

    // Wait for form to be ready
    await expect(page.getByText("Create new project")).toBeVisible();

    const projectName = generateProjectName();

    const titleInput = getTitleInput(page);
    await titleInput.clear();
    await titleInput.fill(projectName);

    // Verify pre-condition: logged-in user should be pre-selected
    const checkedUserCheckboxes = page.locator('input[name="user"]:checked');
    const checkedCount = await checkedUserCheckboxes.count();
    expect(checkedCount).toBeGreaterThan(0);

    await getAcceptButton(page).click();

    // Verify successful creation: redirect to projects list
    await expect(page).toHaveURL(/.*\/projects$/);

    // Verify the new project is visible in the list
    await expect(page.getByText(projectName)).toBeVisible();
  });

  test("has title on create project page", async ({ page }) => {
    await page.goto("/projects/new");
    await expect(page).toHaveTitle(/Jira clone - Create project/);
  });

  test("form validation: requires project name", async ({ page }) => {
    await page.goto("/projects/new");

    const titleInput = getTitleInput(page);
    await titleInput.clear();

    await getAcceptButton(page).click();

    // Form should not submit; error message should be shown
    await expect(page.getByText("Name is required")).toBeVisible();
  });
});
