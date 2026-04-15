import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

test("create new project with timestamped faker name", async ({ page }) => {
  // Login flow
  await page.goto("/login");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL(/.*projects/);

  // Navigate to create project page
  await page.goto("/projects/new");

  // Wait for the dialog to appear
  await expect(
    page.getByRole("heading", { name: "Create new project" })
  ).toBeVisible();

  // Generate unique project name with timestamp and faker product name
  // Using a shorter timestamp format to maximize space for product name
  // (maxLength=30)
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const timestamp = `${year}${month}${day}-${hours}${minutes}${seconds}`;
  const fakerName = faker.commerce.productName();
  const fullName = `${timestamp} ${fakerName}`;

  // Truncate to 30 characters to respect maxLength constraint
  const projectName = fullName.substring(0, 30);

  // Fill the project name field
  const titleInput = page.locator('textarea[name="title"]');
  await titleInput.fill(projectName);

  // Verify the logged-in user is auto-checked (Daniel Serrano)
  // No additional checkbox interaction needed - the form auto-checks the
  // logged-in user

  // Submit the form
  await page.getByRole("button", { name: "Accept changes" }).click();

  // Wait for redirect to projects list
  await expect(page).toHaveURL(/.*\/projects$/);

  // Verify the created project appears on the projects list page
  await expect(page.getByText(projectName)).toBeVisible();
});
