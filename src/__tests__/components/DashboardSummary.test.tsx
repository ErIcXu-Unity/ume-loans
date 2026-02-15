// @vitest-environment happy-dom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DashboardSummary } from "@/components/DashboardSummary";
import { LoanApplication } from "@/types/loan";

const mockApplications: LoanApplication[] = [
  {
    id: "APP-001",
    applicantName: "Alice",
    loanAmount: 100000,
    loanPurpose: "Home",
    annualIncome: 80000,
    employmentStatus: "Full-time",
    creditScore: 700,
    applicationDate: "2024-12-01",
    currentStatus: "Pending",
    statusHistory: [{ status: "Pending", timestamp: "2024-12-01T00:00:00Z", notes: "Submitted" }],
  },
  {
    id: "APP-002",
    applicantName: "Bob",
    loanAmount: 200000,
    loanPurpose: "Car",
    annualIncome: 60000,
    employmentStatus: "Part-time",
    creditScore: 650,
    applicationDate: "2024-12-02",
    currentStatus: "Under Review",
    statusHistory: [{ status: "Under Review", timestamp: "2024-12-02T00:00:00Z", notes: "In review" }],
  },
  {
    id: "APP-003",
    applicantName: "Carol",
    loanAmount: 50000,
    loanPurpose: "Debt",
    annualIncome: 90000,
    employmentStatus: "Full-time",
    creditScore: 780,
    applicationDate: "2024-12-03",
    currentStatus: "Approved",
    statusHistory: [{ status: "Approved", timestamp: "2024-12-03T00:00:00Z", notes: "Approved" }],
  },
];

describe("DashboardSummary", () => {
  it("renders all four metric labels", () => {
    render(<DashboardSummary applications={mockApplications} />);
    expect(screen.getByText("Total")).toBeDefined();
    expect(screen.getByText("Pending")).toBeDefined();
    expect(screen.getByText("Under Review")).toBeDefined();
    expect(screen.getByText("Finalized")).toBeDefined();
  });

  it("shows correct total count", () => {
    render(<DashboardSummary applications={mockApplications} />);
    // Total = 3
    expect(screen.getByText("3")).toBeDefined();
  });

  it("shows correct pending count", () => {
    render(<DashboardSummary applications={mockApplications} />);
    // Pending = 1, Under Review = 1, Finalized = 1 (three "1"s exist)
    const ones = screen.getAllByText("1");
    expect(ones.length).toBe(3);
  });

  it("handles empty applications array", () => {
    render(<DashboardSummary applications={[]} />);
    // All counts should be 0
    const zeros = screen.getAllByText("0");
    expect(zeros.length).toBe(4);
  });

  it("counts Approved and Rejected together as Finalized", () => {
    const appsWithRejected: LoanApplication[] = [
      ...mockApplications,
      {
        id: "APP-004",
        applicantName: "Dave",
        loanAmount: 30000,
        loanPurpose: "Vehicle",
        annualIncome: 40000,
        employmentStatus: "Casual",
        creditScore: 550,
        applicationDate: "2024-12-04",
        currentStatus: "Rejected",
        statusHistory: [{ status: "Rejected", timestamp: "2024-12-04T00:00:00Z", notes: "Rejected" }],
      },
    ];
    render(<DashboardSummary applications={appsWithRejected} />);
    // Finalized = Approved(1) + Rejected(1) = 2
    expect(screen.getByText("4")).toBeDefined(); // Total
    expect(screen.getByText("2")).toBeDefined(); // Finalized
  });
});
