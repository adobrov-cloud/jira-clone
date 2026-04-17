import { test, expect, type Page } from "@playwright/test";
import { faker } from "@faker-js/faker";

const LOGIN_ROUTE = "/login";
const PROJECTS_ROUTE = "/projects";
const NEW_PROJECT_ROUTE = "/projects/new";
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

function getCheckedUsers(page: Page) {
  return page.locator('input[name="user"][data-state="checked"]');
}

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

    await expect(titleInput).toHaveValue(projectName);
    await expect(getCheckedUsers(page)).toHaveCount(1);

    await page.getByRole("button", { name: "Accept changes" }).click();

    await expect(page).toHaveURL(new RegExp(`${PROJECTS_ROUTE}$`));

    const timestampPrefix = projectName.split(" ")[0];
    await expect(page.getByText(new RegExp(timestampPrefix))).toBeVisible();
  });

  test("project name is truncated to 30 characters", async ({ page }) => {
    await loginAndOpenCreateProject(page);

    const longTimestamp = Date.now();
    const longProductName =
      faker.commerce.productName() + " " + faker.commerce.productName();
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

    const defaultUserCheckbox = page.locator('input[name="user"]').first();
    await defaultUserCheckbox.click();

    await expect(getCheckedUsers(page)).toHaveCount(0);

    await page.getByRole("button", { name: "Accept changes" }).click();

    await expect(page).toHaveURL(new RegExp(`${NEW_PROJECT_ROUTE}$`));
    await expect(
      page.getByText(/at least one user is required/i)
    ).toBeVisible();
  });

  test("validates that project name is required", async ({ page }) => {
    await loginAndOpenCreateProject(page);

    const titleInput = page.locator('textarea[name="title"]');
    await titleInput.fill("   ");

    await page.getByRole("button", { name: "Accept changes" }).click();

    await expect(page).toHaveURL(new RegExp(`${NEW_PROJECT_ROUTE}$`));
    await expect(page.getByText(/name is required/i)).toBeVisible();
  });
});
