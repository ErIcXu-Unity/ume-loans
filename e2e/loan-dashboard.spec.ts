import { test, expect } from "@playwright/test";

test.describe("Loan Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  // ------ Page load ------

  test("page loads with the correct title", async ({ page }) => {
    await expect(page).toHaveTitle("UME Loans - Loan Application Portal");
  });

  test("displays the dashboard header", async ({ page }) => {
    await expect(page.getByText("UME Loans - Application Portal")).toBeVisible();
  });

  test("displays all 10 applications in the sidebar", async ({ page }) => {
    await expect(page.getByText("APP-2026-001")).toBeVisible();
    await expect(page.getByText("APP-2026-010")).toBeVisible();
  });

  // ------ Dashboard summary ------

  test("displays summary metrics", async ({ page }) => {
    const summary = page.locator(".grid.sm\\:grid-cols-4");
    await expect(summary.getByText("Total")).toBeVisible();
    await expect(summary.getByText("Pending")).toBeVisible();
    await expect(summary.getByText("Under Review")).toBeVisible();
    await expect(summary.getByText("Finalized")).toBeVisible();
  });

  // ------ Selecting an application ------

  test("shows placeholder when no application is selected", async ({ page }) => {
    await expect(page.getByText("Select an application to view details")).toBeVisible();
  });

  test("shows application details when an app is clicked", async ({ page }) => {
    await page.getByText("Sarah Mitchell").click();
    await expect(page.getByText("Applicant Details")).toBeVisible();
    await expect(page.getByText("Loan Details")).toBeVisible();
    await expect(page.getByText("Actions")).toBeVisible();
    await expect(page.getByText("Status History")).toBeVisible();
  });

  test("displays correct applicant information", async ({ page }) => {
    await page.getByText("Sarah Mitchell").click();
    await expect(page.getByText("Home Purchase")).toBeVisible();
    await expect(page.getByText("720")).toBeVisible();
  });

  // ------ Status workflow: Pending -> Under Review ------

  test("Pending app shows Start Review button", async ({ page }) => {
    await page.getByText("Sarah Mitchell").click();
    await expect(page.getByRole("button", { name: "Start Review" })).toBeVisible();
    await expect(page.getByText("Application must be reviewed before a decision can be made.")).toBeVisible();
  });

  test("clicking Start Review changes status to Under Review", async ({ page }) => {
    await page.getByText("Sarah Mitchell").click();
    await page.getByRole("button", { name: "Start Review" }).click();
    // Should now see Approve and Reject buttons in the detail panel
    await expect(page.getByRole("button", { name: "Approve", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Reject", exact: true })).toBeVisible();
  });

  // ------ Status workflow: Under Review -> Approved ------

  test("approving an application with notes", async ({ page }) => {
    // Use James Chen who is Under Review
    await page.getByText("James Chen").click();
    await page.getByRole("button", { name: "Approve", exact: true }).click();
    // Confirmation panel should appear
    await expect(page.getByText("Approve this application?")).toBeVisible();
    await expect(page.getByText("This action cannot be undone.")).toBeVisible();
    // Type notes
    await page.getByPlaceholder("Approval notes...").fill("Strong business plan");
    // Confirm
    await page.getByText("Confirm Approval").click();
    // Should show finalized message
    await expect(page.getByText("This application has been finalized")).toBeVisible();
  });

  // ------ Status workflow: Under Review -> Rejected ------

  test("rejecting an application with notes", async ({ page }) => {
    // Use Priya Sharma who is Under Review
    await page.getByText("Priya Sharma").click();
    await page.getByRole("button", { name: "Reject", exact: true }).click();
    // Confirmation panel
    await expect(page.getByText("Reject this application?")).toBeVisible();
    await page.getByPlaceholder("Reason for rejection...").fill("Insufficient collateral");
    await page.getByText("Confirm Rejection").click();
    // Should show finalized message
    await expect(page.getByText("This application has been finalized")).toBeVisible();
  });

  // ------ Cancel confirmation ------

  test("cancelling a confirmation returns to action buttons", async ({ page }) => {
    await page.getByText("Sophie Nguyen").click();
    await page.getByRole("button", { name: "Reject", exact: true }).click();
    await expect(page.getByText("Reject this application?")).toBeVisible();
    await page.getByRole("button", { name: "Cancel" }).click();
    // Should be back to Approve/Reject buttons
    await expect(page.getByRole("button", { name: "Approve", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Reject", exact: true })).toBeVisible();
  });

  // ------ Terminal states ------

  test("Approved application shows finalized message", async ({ page }) => {
    await page.getByText("Maria Garcia").click();
    await expect(page.getByText("This application has been finalized")).toBeVisible();
    // No action buttons should exist in the detail panel
    await expect(page.getByRole("button", { name: "Start Review" })).not.toBeVisible();
    await expect(page.getByRole("button", { name: "Approve", exact: true })).not.toBeVisible();
    await expect(page.getByRole("button", { name: "Reject", exact: true })).not.toBeVisible();
  });

  test("Rejected application shows finalized message", async ({ page }) => {
    await page.getByText("David Kim").click();
    await expect(page.getByText("This application has been finalized")).toBeVisible();
    await expect(page.getByRole("button", { name: "Start Review" })).not.toBeVisible();
  });

  // ------ Empty notes ------

  test("submitting with empty notes still works", async ({ page }) => {
    await page.getByText("Sophie Nguyen").click();
    await page.getByRole("button", { name: "Approve", exact: true }).click();
    // Don't type anything in the textarea, just confirm
    await page.getByText("Confirm Approval").click();
    await expect(page.getByText("This application has been finalized")).toBeVisible();
  });

  // ------ Toast notifications ------

  test("shows success toast after status update", async ({ page }) => {
    await page.getByText("Liam O'Connor").click();
    await page.getByRole("button", { name: "Start Review" }).click();
    // Toast should appear
    await expect(page.getByText(/updated to Under Review/)).toBeVisible();
  });
});
