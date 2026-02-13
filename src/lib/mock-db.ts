import { ApplicationStatus, LoanApplication } from "@/types/loan";

const applications: LoanApplication[] = [
  {
    id: "APP-2024-001",
    applicantName: "Sarah Mitchell",
    loanAmount: 250000,
    loanPurpose: "Home Purchase",
    annualIncome: 95000,
    employmentStatus: "Full-time",
    creditScore: 720,
    applicationDate: "2024-12-15",
    currentStatus: "Pending",
    statusHistory: [
      {
        status: "Pending",
        timestamp: "2024-12-15T09:30:00Z",
        notes: "Application submitted",
      },
    ],
  },
  {
    id: "APP-2024-002",
    applicantName: "James Chen",
    loanAmount: 500000,
    loanPurpose: "Business Expansion",
    annualIncome: 180000,
    employmentStatus: "Self-employed",
    creditScore: 680,
    applicationDate: "2024-12-12",
    currentStatus: "Under Review",
    statusHistory: [
      {
        status: "Pending",
        timestamp: "2024-12-12T14:00:00Z",
        notes: "Application submitted",
      },
      {
        status: "Under Review",
        timestamp: "2024-12-13T10:15:00Z",
        notes: "Assigned to senior loan officer",
      },
    ],
  },
  {
    id: "APP-2024-003",
    applicantName: "Maria Garcia",
    loanAmount: 75000,
    loanPurpose: "Debt Consolidation",
    annualIncome: 120000,
    employmentStatus: "Full-time",
    creditScore: 790,
    applicationDate: "2024-12-10",
    currentStatus: "Approved",
    statusHistory: [
      {
        status: "Pending",
        timestamp: "2024-12-10T08:00:00Z",
        notes: "Application submitted",
      },
      {
        status: "Under Review",
        timestamp: "2024-12-11T09:30:00Z",
        notes: "Assigned to senior loan officer",
      },
      {
        status: "Approved",
        timestamp: "2024-12-13T16:45:00Z",
        notes: "Strong credit history, stable employment",
      },
    ],
  },
  {
    id: "APP-2024-004",
    applicantName: "David Kim",
    loanAmount: 35000,
    loanPurpose: "Vehicle Purchase",
    annualIncome: 42000,
    employmentStatus: "Part-time",
    creditScore: 580,
    applicationDate: "2024-12-08",
    currentStatus: "Rejected",
    statusHistory: [
      {
        status: "Pending",
        timestamp: "2024-12-08T11:20:00Z",
        notes: "Application submitted",
      },
      {
        status: "Under Review",
        timestamp: "2024-12-09T13:00:00Z",
        notes: "Flagged for income verification",
      },
      {
        status: "Rejected",
        timestamp: "2024-12-10T15:30:00Z",
        notes: "Debt-to-income ratio exceeds threshold",
      },
    ],
  },
  {
    id: "APP-2024-005",
    applicantName: "Emma Thompson",
    loanAmount: 150000,
    loanPurpose: "Home Renovation",
    annualIncome: 88000,
    employmentStatus: "Contract",
    creditScore: 710,
    applicationDate: "2024-12-16",
    currentStatus: "Pending",
    statusHistory: [
      {
        status: "Pending",
        timestamp: "2024-12-16T10:00:00Z",
        notes: "Application submitted",
      },
    ],
  },
];

export function getApplications(): LoanApplication[] {
  return applications;
}

export function getApplicationById(id: string): LoanApplication | undefined {
  return applications.find((app) => app.id === id);
}

export function updateApplicationStatus(
  id: string,
  newStatus: ApplicationStatus,
  notes: string
): LoanApplication | null {
  const app = applications.find((a) => a.id === id);
  if (!app) return null;

  app.currentStatus = newStatus;
  app.statusHistory.push({
    status: newStatus,
    timestamp: new Date().toISOString(),
    notes: notes || "Status updated",
  });

  return app;
}
