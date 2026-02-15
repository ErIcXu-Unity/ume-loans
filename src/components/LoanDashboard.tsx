"use client";

import { useState, useTransition, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [applications, setApplications] = useState(initialApplications);
  const selectedId = searchParams.get("app");
  const [mobileView, setMobileView] = useState<"list" | "detail">(
    selectedId ? "detail" : "list"
  );
  const [isPending, startTransition] = useTransition();

  const selectedApplication = applications.find((a) => a.id === selectedId) ?? null;

  const handleSelect = useCallback(
    (id: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("app", id);
      router.push(`${pathname}?${params.toString()}`);
      setMobileView("detail");
    },
    [router, pathname, searchParams]
  );

  const handleBack = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("app");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
    setMobileView("list");
  }, [router, pathname, searchParams]);

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
          ) : selectedId ? (
            <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-red-300 bg-red-50">
              <p className="text-sm font-medium text-red-600">
                Application &ldquo;{selectedId}&rdquo; not found
              </p>
              <button
                onClick={handleBack}
                className="cursor-pointer rounded-md bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-200"
              >
                Clear selection
              </button>
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
