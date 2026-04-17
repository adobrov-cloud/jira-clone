import { test, expect, type Page } from "@playwright/test";
import { faker } from "@faker-js/faker";

// Route constants for navigation assertions
const LOGIN_ROUTE = "/login";
const PROJECTS_ROUTE = "/projects";
const NEW_PROJECT_ROUTE = "/projects/new";

// Maximum title length enforced by the project creation form
const TITLE_MAX_LENGTH = 30;

async function loginAsDefaultUser(page: Page): Promise<void> {
  await page.goto(LOGIN_ROUTE);
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL(new RegExp(`${PROJECTS_ROUTE}$`));
}

async function openCreateProjectPage(page: Page): Promise<void> {
  await page.goto(NEW_PROJECT_ROUTE);
  await expect(page.getByRole("dialog")).toBeVisible();
}

async function loginAndOpenCreateProject(page: Page): Promise<void> {
  await loginAsDefaultUser(page);
  await openCreateProjectPage(page);
}

// Helper to locate all selected user checkboxes in the project creation form
function getCheckedUsers(page: Page) {
  return page.locator('input[name="user"][data-state="checked"]');
}

// Generate a unique project name using timestamp + faker product name
// Timestamp prefix ensures uniqueness for parallel test runs and allows verification
function generateProjectName(): string {
  const timestamp = Date.now();
  const productName = faker.commerce.productName();
  return `${timestamp} ${productName}`.slice(0, TITLE_MAX_LENGTH);
}

test.describe("Create New Project", () => {
  test("creates a new project with timestamped Faker name", async ({ page }) => {
    await loginAndOpenCreateProject(page);

    const projectName = generateProjectName();
    const titleInput = page.locator('textarea[name="title"]');
    await titleInput.fill(projectName);

    // Verify form state before submission
    await expect(titleInput).toHaveValue(projectName);
    await expect(getCheckedUsers(page)).toHaveCount(1); // One user selected by default

    await page.getByRole("button", { name: "Accept changes" }).click();

    await expect(page).toHaveURL(new RegExp(`${PROJECTS_ROUTE}$`));

    // Verify the project appears in the list by checking for the timestamp prefix
    const timestampPrefix = projectName.split(" ")[0];
    await expect(page.getByText(new RegExp(timestampPrefix))).toBeVisible();
  });

  test("project name is truncated to 30 characters", async ({ page }) => {
    await loginAndOpenCreateProject(page);

    const longTimestamp = Date.now();
    const longProductName = faker.commerce.productName() + " " + faker.commerce.productName();
    const longName = `${longTimestamp} ${longProductName}`;

    const titleInput = page.locator('textarea[name="title"]');
    await titleInput.fill(longName);

    const actualValue = await titleInput.inputValue();
    expect(actualValue.length).toBeLessThanOrEqual(TITLE_MAX_LENGTH);
  });

  test("validates that at least one user is selected", async ({ page }) => {
    await loginAndOpenCreateProject(page);

    const projectName = generateProjectName();
    await page.locator('textarea[name="title"]').fill(projectName);

    // Uncheck the default user to trigger validation error
    const defaultUserCheckbox = page.locator('input[name="user"]').first();
    await defaultUserCheckbox.click();

    await expect(getCheckedUsers(page)).toHaveCount(0);

    await page.getByRole("button", { name: "Accept changes" }).click();

    // Form should remain on the same page and show validation error
    await expect(page).toHaveURL(new RegExp(`${NEW_PROJECT_ROUTE}$`));
    await expect(page.getByText(/at least one user is required/i)).toBeVisible();
  });

  test("validates that project name is required", async ({ page }) => {
    await loginAndOpenCreateProject(page);

    const titleInput = page.locator('textarea[name="title"]');
    // Fill with whitespace-only string to test validation
    await titleInput.fill("   ");

    await page.getByRole("button", { name: "Accept changes" }).click();

    // Form should remain on the same page and show validation error
    await expect(page).toHaveURL(new RegExp(`${NEW_PROJECT_ROUTE}$`));
    await expect(page.getByText(/name is required/i)).toBeVisible();
  });
});
