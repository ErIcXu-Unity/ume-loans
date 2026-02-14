import { ApplicationStatus } from "@/types/loan";

const TRANSITIONS: Record<ApplicationStatus, ApplicationStatus[]> = {
  Pending: ["Under Review"],
  "Under Review": ["Approved", "Rejected"],
  Approved: [],
  Rejected: [],
};

export function getValidTransitions(
  status: ApplicationStatus
): ApplicationStatus[] {
  return TRANSITIONS[status] ?? [];
}

export function isValidTransition(
  from: ApplicationStatus,
  to: ApplicationStatus
): boolean {
  return TRANSITIONS[from]?.includes(to) ?? false;
}

export function isTerminalStatus(status: ApplicationStatus): boolean {
  return TRANSITIONS[status]?.length === 0;
}
