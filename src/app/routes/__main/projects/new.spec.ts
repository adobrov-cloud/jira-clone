import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

// Project title is constrained by the Title component's maxLength prop
const PROJECT_NAME_MAX_LENGTH = 30;

test.describe("Create New Project", () => {
  test.beforeEach(async ({ page }) => {
    // Login as default user (Daniel Serrano) using the one-click login flow
    await page.goto("/login");
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page).toHaveURL(/.*projects/);
  });

  test("creates a project with dynamically generated name", async ({ page }) => {
    // Generate unique project name using timestamp to avoid conflicts across test runs
    const projectName = generateUniqueProjectName();

    await navigateToCreateProjectPage(page);
    await fillProjectTitle(page, projectName);
    await ensureAtLeastOneUserSelected(page);
    await submitProjectForm(page);
    await verifyProjectCreated(page, projectName);
  });
});

/**
 * Generates a unique project name by combining timestamp with a random product name.
 * Truncated to PROJECT_NAME_MAX_LENGTH to respect form validation constraints.
 */
function generateUniqueProjectName(): string {
  const timestamp = Date.now().toString();
  const productName = faker.commerce.productName();
  const fullProjectName = `${timestamp} ${productName}`;
  return fullProjectName.substring(0, PROJECT_NAME_MAX_LENGTH);
}

function navigateToCreateProjectPage(page: any): Promise<void> {
  return page.goto("/projects/new");
}

async function fillProjectTitle(page: any, projectName: string): Promise<void> {
  const titleTextarea = page.locator('textarea[name="title"]');
  await titleTextarea.fill(projectName);
  await expect(titleTextarea).toHaveValue(projectName);
}

/**
 * Ensures at least one user is selected before form submission.
 * Project creation requires at least one team member to be assigned.
 */
async function ensureAtLeastOneUserSelected(page: any): Promise<void> {
  const userCheckboxes = page.locator('input[name="user"]');
  const checkedUserCount = await userCheckboxes.evaluateAll(
    (checkboxes: HTMLInputElement[]) =>
      checkboxes.filter((checkbox: HTMLInputElement) => checkbox.checked).length
  );

  // If no users are pre-selected, select the first available user
  if (checkedUserCount === 0) {
    await page.locator('label[for^="checkbox-"]').first().click();
  }
}

function submitProjectForm(page: any): Promise<void> {
  return page.getByRole("button", { name: "Accept changes" }).click();
}

/**
 * Verifies that the project was successfully created by checking:
 * 1. Redirect to the projects list page
 * 2. New project appears in the list with the expected name
 */
async function verifyProjectCreated(page: any, projectName: string): Promise<void> {
  await expect(page).toHaveURL(/^.*\/projects$/);

  // Project names are rendered as h2 headings within ProjectCard components
  await expect(page.getByRole("heading", { name: projectName, level: 2 })).toBeVisible();
}
