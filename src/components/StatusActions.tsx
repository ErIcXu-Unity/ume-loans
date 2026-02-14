"use client";

import { useState } from "react";
import { ApplicationStatus } from "@/types/loan";
import { getValidTransitions, isTerminalStatus } from "@/lib/status-machine";

interface StatusActionsProps {
  currentStatus: ApplicationStatus;
  isPending: boolean;
  onAction: (newStatus: ApplicationStatus, notes: string) => void;
}

export function StatusActions({ currentStatus, isPending, onAction }: StatusActionsProps) {
  const [confirmingAction, setConfirmingAction] = useState<ApplicationStatus | null>(null);
  const [notes, setNotes] = useState("");

  const validTransitions = getValidTransitions(currentStatus);
  const isTerminal = isTerminalStatus(currentStatus);

  const handleConfirm = () => {
    if (!confirmingAction) return;
    onAction(confirmingAction, notes);
    setConfirmingAction(null);
    setNotes("");
  };

  const handleCancel = () => {
    setConfirmingAction(null);
    setNotes("");
  };

  if (isTerminal) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <p className="text-sm text-gray-600">
          This application has been finalized - no further changes are allowed.
        </p>
      </div>
    );
  }

  if (validTransitions.length === 0) return null;

  // Pending: simple "Start Review" button, no confirmation needed
  if (currentStatus === "Pending") {
    return (
      <div>
        <button
          onClick={() => onAction("Under Review", "Application moved to review")}
          disabled={isPending}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? "Updating..." : "Start Review"}
        </button>
        <p className="mt-2 text-xs text-gray-500">
          Application must be reviewed before a decision can be made.
        </p>
      </div>
    );
  }

  // Under Review: Approve / Reject with confirmation
  if (confirmingAction) {
    const isReject = confirmingAction === "Rejected";
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-3">
        <p className="text-sm font-medium text-gray-900">
          {isReject ? "Reject" : "Approve"} this application?
        </p>
        <p className="text-xs text-gray-500">This action cannot be undone.</p>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={isReject ? "Reason for rejection..." : "Approval notes..."}
          className="w-full rounded border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          rows={2}
        />
        <div className="flex gap-2">
          <button
            onClick={handleCancel}
            disabled={isPending}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isPending}
            className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50 ${
              isReject
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
            aria-label={`Confirm ${isReject ? "rejection" : "approval"} of application`}
          >
            {isPending ? "Updating..." : `Confirm ${isReject ? "Rejection" : "Approval"}`}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setConfirmingAction("Approved")}
        disabled={isPending}
        className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50"
      >
        Approve
      </button>
      <button
        onClick={() => setConfirmingAction("Rejected")}
        disabled={isPending}
        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
      >
        Reject
      </button>
    </div>
  );
}
