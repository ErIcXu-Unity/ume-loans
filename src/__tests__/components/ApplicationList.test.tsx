// @vitest-environment happy-dom
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ApplicationList } from "@/components/ApplicationList";
import { LoanApplication } from "@/types/loan";

const mockApps: LoanApplication[] = [
  {
    id: "APP-001",
    applicantName: "Alice Test",
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
    applicantName: "Bob Test",
    loanAmount: 250000.5,
    loanPurpose: "Car",
    annualIncome: 60000,
    employmentStatus: "Part-time",
    creditScore: 650,
    applicationDate: "2024-12-02",
    currentStatus: "Approved",
    statusHistory: [{ status: "Approved", timestamp: "2024-12-02T00:00:00Z", notes: "Approved" }],
  },
];

describe("ApplicationList", () => {
  it("renders all application IDs", () => {
    const onSelect = vi.fn();
    render(<ApplicationList applications={mockApps} selectedId={null} onSelect={onSelect} />);
    expect(screen.getByText("APP-001")).toBeDefined();
    expect(screen.getByText("APP-002")).toBeDefined();
  });

  it("renders applicant names", () => {
    const onSelect = vi.fn();
    render(<ApplicationList applications={mockApps} selectedId={null} onSelect={onSelect} />);
    expect(screen.getByText("Alice Test")).toBeDefined();
    expect(screen.getByText("Bob Test")).toBeDefined();
  });

  it("renders formatted AUD currency", () => {
    const onSelect = vi.fn();
    render(<ApplicationList applications={mockApps} selectedId={null} onSelect={onSelect} />);
    // Intl formats as A$100,000.00 or $100,000.00 depending on environment
    const list = screen.getByRole("navigation");
    expect(list.textContent).toContain("100,000");
    expect(list.textContent).toContain("250,000");
  });

  it("calls onSelect with the correct ID when clicked", () => {
    const onSelect = vi.fn();
    render(<ApplicationList applications={mockApps} selectedId={null} onSelect={onSelect} />);
    fireEvent.click(screen.getByText("Alice Test"));
    expect(onSelect).toHaveBeenCalledWith("APP-001");
  });

  it("calls onSelect with second app ID when second item clicked", () => {
    const onSelect = vi.fn();
    render(<ApplicationList applications={mockApps} selectedId={null} onSelect={onSelect} />);
    fireEvent.click(screen.getByText("Bob Test"));
    expect(onSelect).toHaveBeenCalledWith("APP-002");
  });

  it("highlights the selected application", () => {
    const onSelect = vi.fn();
    render(<ApplicationList applications={mockApps} selectedId="APP-001" onSelect={onSelect} />);
    const buttons = screen.getAllByRole("button");
    // Component sorts by most-recent update, so APP-002 (Dec 2) is first, APP-001 (Dec 1) is second
    // Second button (APP-001) should have the selected styling
    expect(buttons[1].className).toContain("border-blue-500");
    // First button (APP-002) should not
    expect(buttons[0].className).not.toContain("border-blue-500");
  });

  it("renders an empty list when no applications", () => {
    const onSelect = vi.fn();
    render(<ApplicationList applications={[]} selectedId={null} onSelect={onSelect} />);
    const buttons = screen.queryAllByRole("button");
    expect(buttons.length).toBe(0);
  });

  it("has navigation landmark for accessibility", () => {
    const onSelect = vi.fn();
    render(<ApplicationList applications={mockApps} selectedId={null} onSelect={onSelect} />);
    expect(screen.getByRole("navigation")).toBeDefined();
  });
});
