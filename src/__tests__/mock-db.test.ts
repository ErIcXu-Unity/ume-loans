import { describe, it, expect } from "vitest";
import {
  getApplications,
  getApplicationById,
  updateApplicationStatus,
} from "@/lib/mock-db";

describe("getApplications", () => {
  it("returns all 10 applications", () => {
    const apps = getApplications();
    expect(apps).toHaveLength(10);
  });

  it("every application has the required fields", () => {
    const apps = getApplications();
    for (const app of apps) {
      expect(app).toHaveProperty("id");
      expect(app).toHaveProperty("applicantName");
      expect(app).toHaveProperty("loanAmount");
      expect(app).toHaveProperty("loanPurpose");
      expect(app).toHaveProperty("annualIncome");
      expect(app).toHaveProperty("employmentStatus");
      expect(app).toHaveProperty("creditScore");
      expect(app).toHaveProperty("applicationDate");
      expect(app).toHaveProperty("currentStatus");
      expect(app).toHaveProperty("statusHistory");
    }
  });

  it("every application has at least one status history entry", () => {
    const apps = getApplications();
    for (const app of apps) {
      expect(app.statusHistory.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("covers all four statuses", () => {
    const apps = getApplications();
    const statuses = new Set(apps.map((a) => a.currentStatus));
    expect(statuses).toContain("Pending");
    expect(statuses).toContain("Under Review");
    expect(statuses).toContain("Approved");
    expect(statuses).toContain("Rejected");
  });
});

describe("getApplicationById", () => {
  it("returns the correct application for a valid ID", () => {
    const app = getApplicationById("APP-2026-001");
    expect(app).toBeDefined();
    expect(app!.applicantName).toBe("Sarah Mitchell");
  });

  it("returns undefined for a non-existent ID", () => {
    const app = getApplicationById("APP-9999-999");
    expect(app).toBeUndefined();
  });

  it("returns undefined for an empty string", () => {
    const app = getApplicationById("");
    expect(app).toBeUndefined();
  });
});

describe("updateApplicationStatus", () => {
  it("updates the status and appends to history", () => {
    const updated = updateApplicationStatus(
      "APP-2026-005",
      "Under Review",
      "Moved to review for testing"
    );
    expect(updated).not.toBeNull();
    expect(updated!.currentStatus).toBe("Under Review");
    expect(updated!.statusHistory.length).toBe(2);
    expect(updated!.statusHistory[1].status).toBe("Under Review");
    expect(updated!.statusHistory[1].notes).toBe("Moved to review for testing");
  });

  it("adds an ISO timestamp to the new history entry", () => {
    const app = getApplicationById("APP-2026-005");
    const lastEntry = app!.statusHistory[app!.statusHistory.length - 1];
    // ISO 8601 format check
    expect(() => new Date(lastEntry.timestamp)).not.toThrow();
    expect(new Date(lastEntry.timestamp).toISOString()).toBe(lastEntry.timestamp);
  });

  it("returns null for a non-existent application", () => {
    const result = updateApplicationStatus("APP-9999-999", "Approved", "Test");
    expect(result).toBeNull();
  });

  it("defaults notes to 'Status updated' when notes is empty", () => {
    const updated = updateApplicationStatus(
      "APP-2026-006",
      "Under Review",
      ""
    );
    expect(updated).not.toBeNull();
    const lastEntry = updated!.statusHistory[updated!.statusHistory.length - 1];
    expect(lastEntry.notes).toBe("Status updated");
  });

  it("preserves the provided notes when not empty", () => {
    const updated = updateApplicationStatus(
      "APP-2026-002",
      "Approved",
      "Credit check passed"
    );
    expect(updated).not.toBeNull();
    const lastEntry = updated!.statusHistory[updated!.statusHistory.length - 1];
    expect(lastEntry.notes).toBe("Credit check passed");
  });
});
