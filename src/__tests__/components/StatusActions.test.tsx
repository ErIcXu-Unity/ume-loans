// @vitest-environment happy-dom
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { StatusActions } from "@/components/StatusActions";

describe("StatusActions", () => {
  // ------ Pending status ------

  it("shows 'Start Review' button when status is Pending", () => {
    const onAction = vi.fn();
    render(<StatusActions currentStatus="Pending" isPending={false} onAction={onAction} />);
    expect(screen.getByText("Start Review")).toBeDefined();
  });

  it("shows hint text when status is Pending", () => {
    const onAction = vi.fn();
    render(<StatusActions currentStatus="Pending" isPending={false} onAction={onAction} />);
    expect(screen.getByText("Application must be reviewed before a decision can be made.")).toBeDefined();
  });

  it("does NOT show Approve or Reject buttons when Pending", () => {
    const onAction = vi.fn();
    render(<StatusActions currentStatus="Pending" isPending={false} onAction={onAction} />);
    expect(screen.queryByText("Approve")).toBeNull();
    expect(screen.queryByText("Reject")).toBeNull();
  });

  it("calls onAction with 'Under Review' when Start Review is clicked", () => {
    const onAction = vi.fn();
    render(<StatusActions currentStatus="Pending" isPending={false} onAction={onAction} />);
    fireEvent.click(screen.getByText("Start Review"));
    expect(onAction).toHaveBeenCalledWith("Under Review", "Application moved to review");
  });

  // ------ Under Review status ------

  it("shows Approve and Reject buttons when Under Review", () => {
    const onAction = vi.fn();
    render(<StatusActions currentStatus="Under Review" isPending={false} onAction={onAction} />);
    expect(screen.getByText("Approve")).toBeDefined();
    expect(screen.getByText("Reject")).toBeDefined();
  });

  it("shows confirmation panel when Approve is clicked", () => {
    const onAction = vi.fn();
    render(<StatusActions currentStatus="Under Review" isPending={false} onAction={onAction} />);
    fireEvent.click(screen.getByText("Approve"));
    expect(screen.getByText("Approve this application?")).toBeDefined();
    expect(screen.getByText("This action cannot be undone.")).toBeDefined();
    expect(screen.getByText("Cancel")).toBeDefined();
  });

  it("shows confirmation panel when Reject is clicked", () => {
    const onAction = vi.fn();
    render(<StatusActions currentStatus="Under Review" isPending={false} onAction={onAction} />);
    fireEvent.click(screen.getByText("Reject"));
    expect(screen.getByText("Reject this application?")).toBeDefined();
    expect(screen.getByText("This action cannot be undone.")).toBeDefined();
  });

  it("calls onAction with notes when confirm is clicked", () => {
    const onAction = vi.fn();
    render(<StatusActions currentStatus="Under Review" isPending={false} onAction={onAction} />);
    // Click Reject to open panel
    fireEvent.click(screen.getByText("Reject"));
    // Type notes
    const textarea = screen.getByPlaceholderText("Reason for rejection...");
    fireEvent.change(textarea, { target: { value: "Credit too low" } });
    // Click confirm
    fireEvent.click(screen.getByText("Confirm Rejection"));
    expect(onAction).toHaveBeenCalledWith("Rejected", "Credit too low");
  });

  it("calls onAction with empty notes when no notes typed", () => {
    const onAction = vi.fn();
    render(<StatusActions currentStatus="Under Review" isPending={false} onAction={onAction} />);
    fireEvent.click(screen.getByText("Approve"));
    fireEvent.click(screen.getByText("Confirm Approval"));
    expect(onAction).toHaveBeenCalledWith("Approved", "");
  });

  it("hides confirmation panel when Cancel is clicked", () => {
    const onAction = vi.fn();
    render(<StatusActions currentStatus="Under Review" isPending={false} onAction={onAction} />);
    fireEvent.click(screen.getByText("Reject"));
    expect(screen.getByText("Reject this application?")).toBeDefined();
    fireEvent.click(screen.getByText("Cancel"));
    // Panel should be gone, back to Approve/Reject buttons
    expect(screen.getByText("Approve")).toBeDefined();
    expect(screen.getByText("Reject")).toBeDefined();
    expect(screen.queryByText("Reject this application?")).toBeNull();
  });

  // ------ Terminal statuses ------

  it("shows finalized message when status is Approved", () => {
    const onAction = vi.fn();
    render(<StatusActions currentStatus="Approved" isPending={false} onAction={onAction} />);
    expect(screen.getByText("This application has been finalized - no further changes are allowed.")).toBeDefined();
  });

  it("shows finalized message when status is Rejected", () => {
    const onAction = vi.fn();
    render(<StatusActions currentStatus="Rejected" isPending={false} onAction={onAction} />);
    expect(screen.getByText("This application has been finalized - no further changes are allowed.")).toBeDefined();
  });

  it("does NOT show any action buttons when status is Approved", () => {
    const onAction = vi.fn();
    render(<StatusActions currentStatus="Approved" isPending={false} onAction={onAction} />);
    expect(screen.queryByText("Approve")).toBeNull();
    expect(screen.queryByText("Reject")).toBeNull();
    expect(screen.queryByText("Start Review")).toBeNull();
  });

  // ------ isPending state ------

  it("disables Start Review button when isPending is true", () => {
    const onAction = vi.fn();
    render(<StatusActions currentStatus="Pending" isPending={true} onAction={onAction} />);
    const button = screen.getByText("Updating...");
    expect(button).toBeDefined();
    expect((button as HTMLButtonElement).disabled).toBe(true);
  });

  it("disables Approve and Reject buttons when isPending is true", () => {
    const onAction = vi.fn();
    render(<StatusActions currentStatus="Under Review" isPending={true} onAction={onAction} />);
    const approveBtn = screen.getByText("Approve") as HTMLButtonElement;
    const rejectBtn = screen.getByText("Reject") as HTMLButtonElement;
    expect(approveBtn.disabled).toBe(true);
    expect(rejectBtn.disabled).toBe(true);
  });
});
