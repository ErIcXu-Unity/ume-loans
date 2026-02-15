import { ApplicationStatus, LoanApplication } from "@/types/loan";

const applications: LoanApplication[] = [
  {
    id: "APP-2026-001",
    applicantName: "Sarah Mitchell",
    loanAmount: 247500.75,
    loanPurpose: "Home Purchase",
    annualIncome: 95200,
    employmentStatus: "Full-time",
    creditScore: 720,
    applicationDate: "2026-02-12",
    currentStatus: "Pending",
    statusHistory: [
      {
        status: "Pending",
        timestamp: "2026-02-12T09:30:00Z",
        notes: "Application submitted",
      },
    ],
  },
  {
    id: "APP-2026-002",
    applicantName: "James Chen",
    loanAmount: 485000.5,
    loanPurpose: "Business Expansion",
    annualIncome: 178500,
    employmentStatus: "Self-employed",
    creditScore: 680,
    applicationDate: "2026-02-10",
    currentStatus: "Under Review",
    statusHistory: [
      {
        status: "Pending",
        timestamp: "2026-02-10T14:00:00Z",
        notes: "Application submitted",
      },
      {
        status: "Under Review",
        timestamp: "2026-02-11T10:15:00Z",
        notes: "Assigned to senior loan officer",
      },
    ],
  },
  {
    id: "APP-2026-003",
    applicantName: "Maria Garcia",
    loanAmount: 72800.25,
    loanPurpose: "Debt Consolidation",
    annualIncome: 121000,
    employmentStatus: "Full-time",
    creditScore: 790,
    applicationDate: "2026-02-03",
    currentStatus: "Approved",
    statusHistory: [
      {
        status: "Pending",
        timestamp: "2026-02-03T08:00:00Z",
        notes: "Application submitted",
      },
      {
        status: "Under Review",
        timestamp: "2026-02-04T09:30:00Z",
        notes: "Assigned to senior loan officer",
      },
      {
        status: "Approved",
        timestamp: "2026-02-06T16:45:00Z",
        notes: "Strong credit history, stable employment",
      },
    ],
  },
  {
    id: "APP-2026-004",
    applicantName: "David Kim",
    loanAmount: 34750.0,
    loanPurpose: "Vehicle Purchase",
    annualIncome: 42300,
    employmentStatus: "Part-time",
    creditScore: 580,
    applicationDate: "2026-02-03",
    currentStatus: "Rejected",
    statusHistory: [
      {
        status: "Pending",
        timestamp: "2026-02-03T11:20:00Z",
        notes: "Application submitted",
      },
      {
        status: "Under Review",
        timestamp: "2026-02-04T13:00:00Z",
        notes: "Flagged for income verification",
      },
      {
        status: "Rejected",
        timestamp: "2026-02-06T15:30:00Z",
        notes: "Debt-to-income ratio exceeds threshold",
      },
    ],
  },
  {
    id: "APP-2026-005",
    applicantName: "Emma Thompson",
    loanAmount: 148200.6,
    loanPurpose: "Home Renovation",
    annualIncome: 87500,
    employmentStatus: "Contract",
    creditScore: 710,
    applicationDate: "2026-02-13",
    currentStatus: "Pending",
    statusHistory: [
      {
        status: "Pending",
        timestamp: "2026-02-13T10:00:00Z",
        notes: "Application submitted",
      },
    ],
  },
  {
    id: "APP-2026-006",
    applicantName: "Liam O'Connor",
    loanAmount: 320000.0,
    loanPurpose: "Investment Property",
    annualIncome: 145800,
    employmentStatus: "Full-time",
    creditScore: 755,
    applicationDate: "2026-02-13",
    currentStatus: "Pending",
    statusHistory: [
      {
        status: "Pending",
        timestamp: "2026-02-13T08:45:00Z",
        notes: "Application submitted",
      },
    ],
  },
  {
    id: "APP-2026-007",
    applicantName: "Priya Sharma",
    loanAmount: 62500.3,
    loanPurpose: "Education",
    annualIncome: 68400,
    employmentStatus: "Full-time",
    creditScore: 695,
    applicationDate: "2026-02-11",
    currentStatus: "Under Review",
    statusHistory: [
      {
        status: "Pending",
        timestamp: "2026-02-11T12:00:00Z",
        notes: "Application submitted",
      },
      {
        status: "Under Review",
        timestamp: "2026-02-12T09:00:00Z",
        notes: "Assigned for review - education loan assessment",
      },
    ],
  },
  {
    id: "APP-2026-008",
    applicantName: "Oliver Wright",
    loanAmount: 415750.25,
    loanPurpose: "Home Purchase",
    annualIncome: 210000,
    employmentStatus: "Full-time",
    creditScore: 810,
    applicationDate: "2026-02-04",
    currentStatus: "Approved",
    statusHistory: [
      {
        status: "Pending",
        timestamp: "2026-02-04T10:30:00Z",
        notes: "Application submitted",
      },
      {
        status: "Under Review",
        timestamp: "2026-02-05T08:15:00Z",
        notes: "Priority review - high value application",
      },
      {
        status: "Approved",
        timestamp: "2026-02-09T14:00:00Z",
        notes: "Excellent credit, high income, low debt-to-income ratio",
      },
    ],
  },
  {
    id: "APP-2026-009",
    applicantName: "Sophie Nguyen",
    loanAmount: 28900.5,
    loanPurpose: "Vehicle Purchase",
    annualIncome: 55200,
    employmentStatus: "Casual",
    creditScore: 620,
    applicationDate: "2026-02-09",
    currentStatus: "Under Review",
    statusHistory: [
      {
        status: "Pending",
        timestamp: "2026-02-09T15:20:00Z",
        notes: "Application submitted",
      },
      {
        status: "Under Review",
        timestamp: "2026-02-10T11:45:00Z",
        notes: "Employment verification in progress",
      },
    ],
  },
  {
    id: "APP-2026-010",
    applicantName: "Michael Patel",
    loanAmount: 190000.0,
    loanPurpose: "Business Startup",
    annualIncome: 38500,
    employmentStatus: "Self-employed",
    creditScore: 545,
    applicationDate: "2026-02-02",
    currentStatus: "Rejected",
    statusHistory: [
      {
        status: "Pending",
        timestamp: "2026-02-02T09:00:00Z",
        notes: "Application submitted",
      },
      {
        status: "Under Review",
        timestamp: "2026-02-03T10:30:00Z",
        notes: "Flagged - loan amount exceeds 4x annual income",
      },
      {
        status: "Rejected",
        timestamp: "2026-02-05T16:00:00Z",
        notes: "Insufficient income for requested amount, credit score below threshold",
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
