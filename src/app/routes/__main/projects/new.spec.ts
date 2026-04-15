import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

test.describe("Create New Project", () => {
  test("create project with dynamic name and verify redirect", async ({
    page,
  }) => {
    // Step 1: Login
    await page.goto("/login");
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page).toHaveURL(/.*projects/);

    // Step 2: Navigate to create project page
    await page.goto("/projects/new");

    // Step 3: Generate dynamic project name
    // Using epoch timestamp (13 chars) + space + product name
    // Truncate to 30 chars to respect Title component maxLength constraint
    const timestamp = Date.now().toString();
    const productName = faker.commerce.productName();
    const fullName = `${timestamp} ${productName}`;
    const projectName = fullName.substring(0, 30);

    // Step 4: Fill in the project name
    // The textarea has autoFocus, so it should be focused on dialog open
    const titleTextarea = page.locator('textarea[name="title"]');
    await titleTextarea.clear();
    await titleTextarea.fill(projectName);

    // Step 5: Verify at least one user is checked
    // The logged-in user (Daniel Serrano) is auto-checked by default
    // via defaultChecked={user.id === loggedUser?.id}
    const checkedUsers = page.locator('input[name="user"]:checked');
    await expect(checkedUsers).toHaveCount(1, { timeout: 5000 });

    // Step 6: Submit the form
    const acceptButton = page.getByRole("button", {
      name: "Accept changes",
    });
    await acceptButton.click();

    // Step 7: Verify redirect to /projects
    await expect(page).toHaveURL(/.*\/projects$/);

    // Step 8: Verify the project appears in the projects list
    // The project name might be truncated, so we search for a substring
    // or the full name if it fits within 30 chars
    await expect(
      page.locator("text=" + projectName.substring(0, 20))
    ).toBeVisible({ timeout: 10000 });
  });
});
