export type ApplicationStatus =
  | "Pending"
  | "Under Review"
  | "Approved"
  | "Rejected";

export interface StatusHistoryEntry {
  status: ApplicationStatus;
  timestamp: string; // ISO 8601
  notes: string;
}

export interface LoanApplication {
  id: string;
  applicantName: string;
  loanAmount: number;
  loanPurpose: string;
  annualIncome: number;
  employmentStatus: string;
  creditScore: number;
  applicationDate: string;
  currentStatus: ApplicationStatus;
  statusHistory: StatusHistoryEntry[];
}

export interface ActionResult {
  success: boolean;
  error?: string;
  application?: LoanApplication;
}
