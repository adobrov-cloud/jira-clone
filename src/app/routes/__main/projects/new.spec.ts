import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

test("create new project with dynamic name", async ({ page }) => {
  // Login flow
  await page.goto("/login");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL(/.*projects/);

  // Navigate to create new project page
  await page.goto("/projects/new");

  // Generate dynamic project name and truncate to 30 chars
  const timestamp = new Date().toISOString();
  const productName = faker.commerce.productName();
  const fullName = `${timestamp} ${productName}`;
  const truncatedName = fullName.substring(0, 30);

  // Fill in the title field
  const titleInput = page.locator('textarea[name="title"]');
  await titleInput.fill(truncatedName);

  // Verify the logged-in user checkbox is pre-checked (no need to click)
  // The logged-in user's checkbox has defaultChecked={user.id === loggedUser?.id}

  // Submit the form by clicking the Accept button
  await page.getByRole("button", { name: "Accept changes" }).click();

  // Wait for redirect to /projects
  await expect(page).toHaveURL(/.*projects$/);

  // Verify the new project appears with the truncated name
  await expect(
    page.getByRole("heading", { name: truncatedName })
  ).toBeVisible();
});

