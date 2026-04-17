import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

test("create new project with dynamic name", async ({ page }) => {
  // Step 1: Login as default user (Daniel Serrano)
  await page.goto("/login");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL(/.*\/projects$/);

  // Step 2: Navigate to create project page
  await page.goto("/projects/new");
  await expect(page).toHaveURL(/.*\/projects\/new$/);

  // Step 3: Generate dynamic project name with local timestamp + faker product name
  const timestamp = new Date().toLocaleString("sv-SE");
  const productName = faker.commerce.productName();
  const fullName = `${timestamp} ${productName}`;

  // Truncate to 30 chars to match Title component maxLength
  const projectName = fullName.substring(0, 30);

  // Step 4: Fill in the project title
  // The Title component uses a textarea with name="title"
  const titleTextarea = page.locator('textarea[name="title"]');
  await titleTextarea.clear();
  await titleTextarea.fill(projectName);

  // Step 5: Verify at least one user is checked
  // The logged-in user (Daniel Serrano) is auto-checked via defaultChecked
  const checkedUsers = page.locator('button[role="checkbox"][data-state="checked"]');
  await expect.poll(() => checkedUsers.count()).toBeGreaterThan(0);

  // Step 6: Submit the form
  await page.getByRole("button", { name: "Accept changes" }).click();

  // Step 7: Verify redirect to projects list
  await expect(page).toHaveURL(/.*\/projects$/);

  // Step 8: Verify the newly created project appears in the list
  // ProjectCard renders project name in an h2 element
  await expect(page.getByRole("heading", { name: projectName })).toBeVisible();
});
