import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";

function getLocalTimestamp(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

test("create new project with faker-generated name", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL(/.*projects$/);

  await page.goto("/projects/new");

  const projectName = `${getLocalTimestamp()} ${faker.commerce.productName()}`.slice(
    0,
    30
  );

  const titleTextarea = page.locator('textarea[name="title"]');
  await expect(titleTextarea).toBeVisible();
  await titleTextarea.fill(projectName);

  await page.getByRole("button", { name: "Accept changes" }).click();
  await expect(page).toHaveURL(/.*projects$/);
  await expect(page.getByText(projectName)).toBeVisible();
});
