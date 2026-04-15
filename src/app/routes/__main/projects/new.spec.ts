import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

/**
 * Helper to format current timestamp in local ISO-like format (YYYY-MM-DDTHH:mm:ss.sss)
 * without the trailing 'Z' that Date.prototype.toISOString() produces.
 * Used to create unique project names in tests to avoid collisions when tests run in parallel
 * or in quick succession.
 */
function getLocalTimestamp(): string {
  const now = new Date();
  const pad = (n: number, digits = 2): string => String(n).padStart(digits, "0");

  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());
  const milliseconds = pad(now.getMilliseconds(), 3);

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
}

test("create a new project with timestamped faker name", async ({ page }) => {
  // Generate a unique project name combining timestamp and faker data
  // Format: "YYYY-MM-DDTHH:mm:ss.sss ProductName"
  // This ensures each test run creates a unique project without collisions
  const timestamp = getLocalTimestamp();
  const productName = faker.commerce.productName();
  const projectName = `${timestamp} ${productName}`;

  // Step 1: Navigate to login page and authenticate
  await page.goto("/login");
  await page.getByRole("button", { name: "Login" }).click();

  // Step 2: Wait for redirect to /projects after successful login
  await expect(page).toHaveURL(/.*projects/);

  // Step 3: Navigate to new project page
  await page.goto("/projects/new");

  // Step 4: Fill in the project title
  // The title input is a textarea with autofocus
  const titleInput = page.locator('textarea[name="title"]');
  await expect(titleInput).toBeVisible();

  // Clear any existing content and type the generated project name
  await titleInput.clear();
  await titleInput.fill(projectName);

  // Step 5: Verify at least one user checkbox is checked
  // The logged-in user is automatically assigned to the project (pre-checked)
  const checkedUsers = page.locator('input[name="user"]:checked');
  await expect(checkedUsers).toHaveCount(1);

  // Step 6: Submit the form by clicking the Accept button
  await page.getByRole("button", { name: "Accept" }).click();

  // Step 7: Verify redirect to /projects list page
  await expect(page).toHaveURL(/.*\/projects$/);

  // Step 8: Verify the newly created project appears in the projects list
  // The project name appears as a heading in the project card
  await expect(page.getByRole("heading", { name: projectName })).toBeVisible();
});
