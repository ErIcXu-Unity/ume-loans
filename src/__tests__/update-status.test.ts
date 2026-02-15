import { describe, it, expect } from "vitest";
import { updateApplicationStatusAction } from "@/actions/update-status";
import type { ApplicationStatus } from "@/types/loan";

describe("updateApplicationStatusAction", () => {
  // ------ Valid transitions ------

  it("successfully transitions Pending -> Under Review", async () => {
    const result = await updateApplicationStatusAction(
      "APP-2026-001",
      "Under Review",
      "Starting review"
    );
    expect(result.success).toBe(true);
    expect(result.application).toBeDefined();
    expect(result.application!.currentStatus).toBe("Under Review");
  });

  it("successfully transitions Under Review -> Approved", async () => {
    // APP-2026-001 is now Under Review from the test above
    const result = await updateApplicationStatusAction(
      "APP-2026-001",
      "Approved",
      "All checks passed"
    );
    expect(result.success).toBe(true);
    expect(result.application!.currentStatus).toBe("Approved");
  });

  it("successfully transitions Under Review -> Rejected", async () => {
    // APP-2026-009 is Under Review in mock data
    const result = await updateApplicationStatusAction(
      "APP-2026-009",
      "Rejected",
      "Income too low"
    );
    expect(result.success).toBe(true);
    expect(result.application!.currentStatus).toBe("Rejected");
  });

  // ------ Invalid transitions ------

  it("rejects Pending -> Approved (cannot skip steps)", async () => {
    // APP-2026-006 is Pending
    const result = await updateApplicationStatusAction(
      "APP-2026-006",
      "Approved",
      "Trying to skip"
    );
    expect(result.success).toBe(false);
    expect(result.error).toBe("Cannot transition from Pending to Approved");
  });

  it("rejects Pending -> Rejected (cannot skip steps)", async () => {
    const result = await updateApplicationStatusAction(
      "APP-2026-006",
      "Rejected",
      "Trying to skip"
    );
    expect(result.success).toBe(false);
    expect(result.error).toBe("Cannot transition from Pending to Rejected");
  });

  it("rejects changes from terminal status Approved", async () => {
    // APP-2026-003 is Approved
    const result = await updateApplicationStatusAction(
      "APP-2026-003",
      "Under Review",
      "Trying to revert"
    );
    expect(result.success).toBe(false);
    expect(result.error).toBe("Cannot transition from Approved to Under Review");
  });

  it("rejects changes from terminal status Rejected", async () => {
    // APP-2026-004 is Rejected
    const result = await updateApplicationStatusAction(
      "APP-2026-004",
      "Pending",
      "Trying to revert"
    );
    expect(result.success).toBe(false);
    expect(result.error).toBe("Cannot transition from Rejected to Pending");
  });

  // ------ Invalid inputs ------

  it("rejects a non-existent application ID", async () => {
    const result = await updateApplicationStatusAction(
      "APP-9999-999",
      "Under Review",
      "Does not exist"
    );
    expect(result.success).toBe(false);
    expect(result.error).toBe("Application APP-9999-999 not found");
  });

  it("rejects an invalid status value", async () => {
    const result = await updateApplicationStatusAction(
      "APP-2026-006",
      "Denied" as unknown as ApplicationStatus,
      "Bad status"
    );
    expect(result.success).toBe(false);
    expect(result.error).toBe("Invalid status: Denied");
  });

  it("rejects an empty status value", async () => {
    const result = await updateApplicationStatusAction(
      "APP-2026-006",
      "" as unknown as ApplicationStatus,
      "Empty status"
    );
    expect(result.success).toBe(false);
    expect(result.error).toContain("Invalid status");
  });

  // ------ Empty notes ------

  it("succeeds with empty notes (notes are optional)", async () => {
    // APP-2026-006 is still Pending
    const result = await updateApplicationStatusAction(
      "APP-2026-006",
      "Under Review",
      ""
    );
    expect(result.success).toBe(true);
    expect(result.application!.currentStatus).toBe("Under Review");
    // mock-db defaults empty notes to "Status updated"
    const lastEntry =
      result.application!.statusHistory[
        result.application!.statusHistory.length - 1
      ];
    expect(lastEntry.notes).toBe("Status updated");
  });

  // ------ Response shape ------

  it("returns the full updated application on success", async () => {
    // APP-2026-007 is Under Review
    const result = await updateApplicationStatusAction(
      "APP-2026-007",
      "Approved",
      "Approved for education"
    );
    expect(result.success).toBe(true);
    expect(result.application).toHaveProperty("id", "APP-2026-007");
    expect(result.application).toHaveProperty("applicantName", "Priya Sharma");
    expect(result.application).toHaveProperty("currentStatus", "Approved");
    expect(result.application!.statusHistory.length).toBeGreaterThanOrEqual(3);
  });

  it("does not return an application object on failure", async () => {
    const result = await updateApplicationStatusAction(
      "APP-9999-999",
      "Under Review",
      "Nope"
    );
    expect(result.success).toBe(false);
    expect(result.application).toBeUndefined();
  });
});
