import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";
import { faker } from "@faker-js/faker";

/**
 * Helper function to log in as the default user (Daniel Serrano)
 */
async function login(page: Page) {
  await page.goto("/login");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL(/.*projects/);
}

test(
  "create project with timestamp and faker product name",
  async ({ page }) => {
    // Step 1: Log in
    await login(page);

    // Step 2: Navigate to the create project page
    await page.goto("/projects/new");

    // Step 3: Wait for the dialog to appear
    await expect(page.getByRole("dialog")).toBeVisible();

    // Step 4: Generate project name with timestamp and faker product
    // name
    const timestamp = Date.now().toString();
    const productName = faker.commerce.productName();
    const projectName = `${timestamp} ${productName}`.substring(0, 30);

    // Step 5: Fill in the title field
    // The textarea is auto-focused and has name="title"
    const titleTextarea = page.getByRole("textbox", { name: /title/i });
    await titleTextarea.fill(projectName);

    // Step 6: Verify the logged-in user checkbox is
    // auto-checked
    // The logged-in user (Daniel Serrano) is auto-checked by
    // default
    // No need to manually check any user

    // Step 7: Submit the form
    await page.getByRole("button", { name: "Accept changes" }).click();

    // Step 8: Wait for redirect to /projects
    await expect(page).toHaveURL(/.*projects$/);

    // Step 9: Verify the newly created project appears in the
    // project list
    await expect(page.getByText(projectName)).toBeVisible();
  }
);
