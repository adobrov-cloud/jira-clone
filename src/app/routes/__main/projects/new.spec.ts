import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

test("create new project with timestamped faker name", async ({ page }) => {
  // Login as default user (Daniel Serrano - first user)
  await page.goto("/login");
  await page.getByRole("button", { name: "Login" }).click();

  // Wait for redirect to projects page
  await expect(page).toHaveURL(/.*projects$/);

  // Navigate to create new project page
  await page.goto("/projects/new");

  // Generate unique project name using timestamp and faker
  const timestamp = new Date().toISOString();
  const productName = faker.commerce.productName();
  const fullName = `${timestamp} ${productName}`;

  // Truncate to 30 characters to respect Title component's maxLength
  const projectName = fullName.substring(0, 30);

  // Fill the project title
  const titleTextarea = page.locator('textarea[name="title"]');
  await titleTextarea.fill(projectName);

  // Verify the title was set correctly
  await expect(titleTextarea).toHaveValue(projectName);

  // The logged-in user is pre-selected via defaultChecked, satisfying "at least one user" requirement
  await page.getByRole("button", { name: "Accept changes" }).click();

  // Wait for redirect back to projects page
  await expect(page).toHaveURL(/.*projects$/);

  // Verify the new project appears on the projects list page
  await expect(page.getByRole("heading", { name: projectName })).toBeVisible();
});
