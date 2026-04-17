import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

test("create new project with dynamic name", async ({ page }) => {
  // Login flow
  await page.goto("/login");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL(/.*projects/);

  // Navigate to create project page
  await page.goto("/projects/new");

  // Generate dynamic project name
  const timestamp = new Date().toISOString();
  const productName = faker.commerce.productName();
  const fullName = `${timestamp} ${productName}`;
  const projectName = fullName.substring(0, 30);

  // Fill in the project name
  await page.locator('textarea[name="title"]').fill(projectName);

  // The logged-in user (Daniel Serrano) is already pre-selected by default
  // No need to manually select a user

  // Submit the form
  await page.getByRole("button", { name: "Accept changes" }).click();

  // Wait for redirect to projects list
  await expect(page).toHaveURL(/^(?!.*\/new).*\/projects$/);

  // Verify the project appears in the list
  await expect(page.getByText(projectName)).toBeVisible();
});
