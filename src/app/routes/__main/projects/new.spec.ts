import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

test("create project with dynamic name", async ({ page }) => {
  // Login first
  await page.goto("/login");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL(/.*projects/);

  // Navigate to new project page
  await page.goto("/projects/new");

  // Generate dynamic project name
  // Use local ISO-style timestamp (not UTC toISOString() which ends in Z)
  const timestamp = new Date()
    .toLocaleString("sv-SE")
    .replace(/[T]/g, " ")
    .replace(/:\d{2}$/, ""); // Remove seconds for cleaner format
  const productName = faker.commerce.productName();
  const fullName = `${timestamp} ${productName}`;

  // Truncate to 30 chars because Title component has maxLength={30}
  const truncatedName = fullName.substring(0, 30);

  // Clear the title textarea and type the dynamic name
  const titleInput = page.locator('textarea[name="title"]');
  await titleInput.clear();
  await titleInput.fill(truncatedName);

  // Submit the form
  await page.getByRole("button", { name: "Accept changes" }).click();

  // Wait for redirect to /projects
  await expect(page).toHaveURL(/.*\/projects$/);

  // Verify the newly created project appears in the project list
  await expect(page.getByText(truncatedName)).toBeVisible();
});

