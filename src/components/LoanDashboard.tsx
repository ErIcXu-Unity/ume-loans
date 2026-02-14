"use client";

import { useState, useTransition } from "react";
import { LoanApplication, ApplicationStatus } from "@/types/loan";
import { updateApplicationStatusAction } from "@/actions/update-status";
import { DashboardSummary } from "./DashboardSummary";
import { ApplicationList } from "./ApplicationList";
import { ApplicationDetail } from "./ApplicationDetail";
import { Toaster, toast } from "sonner";

interface LoanDashboardProps {
  initialApplications: LoanApplication[];
}

export function LoanDashboard({ initialApplications }: LoanDashboardProps) {
  const [applications, setApplications] = useState(initialApplications);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"list" | "detail">("list");
  const [isPending, startTransition] = useTransition();

  const selectedApplication = applications.find((a) => a.id === selectedId) ?? null;

  function handleSelect(id: string) {
    setSelectedId(id);
    setMobileView("detail");
  }

  function handleBack() {
    setMobileView("list");
  }

  function handleStatusUpdate(newStatus: ApplicationStatus, notes: string) {
    if (!selectedId) return;
    const id = selectedId;

    startTransition(async () => {
      try {
        const result = await updateApplicationStatusAction(id, newStatus, notes);

        if (result.success && result.application) {
          setApplications((prev) =>
            prev.map((app) => (app.id === id ? result.application! : app))
          );
          toast.success(`Application ${id} updated to ${newStatus}`);
        } else {
          toast.error(result.error ?? "Something went wrong");
        }
      } catch {
        toast.error("An unexpected error occurred");
      }
    });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <Toaster position="top-right" richColors />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          UME Loans - Application Portal
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage and review loan applications
        </p>
      </div>

      {/* Summary Metrics */}
      <div className="mb-6">
        <DashboardSummary applications={applications} />
      </div>

      {/* Main Content: Sidebar + Detail */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {/* Sidebar -- hidden on mobile when viewing detail */}
        <div className={`sm:col-span-1 ${mobileView === "detail" ? "hidden sm:block" : ""}`}>
          <ApplicationList
            applications={applications}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        </div>

        {/* Detail -- hidden on mobile when viewing list */}
        <div className={`sm:col-span-2 ${mobileView === "list" ? "hidden sm:block" : ""}`}>
          {selectedApplication ? (
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <ApplicationDetail
                application={selectedApplication}
                isPending={isPending}
                onUpdateStatus={handleStatusUpdate}
                onBack={handleBack}
              />
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white">
              <p className="text-sm text-gray-500">
                Select an application to view details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
