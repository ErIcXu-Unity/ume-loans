"use server";

import { getApplicationById, updateApplicationStatus } from "@/lib/mock-db";
import { isValidTransition } from "@/lib/status-machine";
import { ApplicationStatus, ActionResult } from "@/types/loan";

const VALID_STATUSES: ApplicationStatus[] = [
  "Pending",
  "Under Review",
  "Approved",
  "Rejected",
];

export async function updateApplicationStatusAction(
  id: string,
  newStatus: ApplicationStatus,
  notes: string
): Promise<ActionResult> {
  try {
    if (!newStatus || !VALID_STATUSES.includes(newStatus)) {
      return { success: false, error: `Invalid status: ${newStatus}` };
    }

    const application = getApplicationById(id);
    if (!application) {
      return { success: false, error: `Application ${id} not found` };
    }

    if (!isValidTransition(application.currentStatus, newStatus)) {
      return {
        success: false,
        error: `Cannot transition from ${application.currentStatus} to ${newStatus}`,
      };
    }

    const updated = updateApplicationStatus(id, newStatus, notes);
    if (!updated) {
      return { success: false, error: "Failed to update application" };
    }

    return { success: true, application: updated };
  } catch {
    return { success: false, error: "An unexpected error occurred" };
  }
}
