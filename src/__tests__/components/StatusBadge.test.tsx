// @vitest-environment happy-dom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusBadge } from "@/components/StatusBadge";

describe("StatusBadge", () => {
  it("renders the status text", () => {
    render(<StatusBadge status="Pending" />);
    expect(screen.getByText("Pending")).toBeDefined();
  });

  it("renders all four statuses correctly", () => {
    const statuses = ["Pending", "Under Review", "Approved", "Rejected"] as const;
    for (const status of statuses) {
      const { unmount } = render(<StatusBadge status={status} />);
      expect(screen.getByText(status)).toBeDefined();
      unmount();
    }
  });

  it("has role=status for accessibility", () => {
    render(<StatusBadge status="Approved" />);
    expect(screen.getByRole("status")).toBeDefined();
  });

  it("has aria-label with the status name", () => {
    render(<StatusBadge status="Rejected" />);
    expect(screen.getByLabelText("Status: Rejected")).toBeDefined();
  });

  it("applies small size class by default", () => {
    render(<StatusBadge status="Pending" />);
    const badge = screen.getByText("Pending");
    expect(badge.className).toContain("text-xs");
  });

  it("applies large size class when size=lg", () => {
    render(<StatusBadge status="Pending" size="lg" />);
    const badge = screen.getByText("Pending");
    expect(badge.className).toContain("text-sm");
    expect(badge.className).toContain("font-semibold");
  });

  it("applies amber styling for Pending", () => {
    render(<StatusBadge status="Pending" />);
    const badge = screen.getByText("Pending");
    expect(badge.className).toContain("bg-amber-100");
  });

  it("applies green styling for Approved", () => {
    render(<StatusBadge status="Approved" />);
    const badge = screen.getByText("Approved");
    expect(badge.className).toContain("bg-green-100");
  });

  it("applies red styling for Rejected", () => {
    render(<StatusBadge status="Rejected" />);
    const badge = screen.getByText("Rejected");
    expect(badge.className).toContain("bg-red-100");
  });

  it("applies blue styling for Under Review", () => {
    render(<StatusBadge status="Under Review" />);
    const badge = screen.getByText("Under Review");
    expect(badge.className).toContain("bg-blue-100");
  });
});
