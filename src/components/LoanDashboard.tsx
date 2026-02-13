"use client";

import { LoanApplication } from "@/types/loan";

interface LoanDashboardProps {
  initialApplications: LoanApplication[];
}

export function LoanDashboard({ initialApplications }: LoanDashboardProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900">
        UME Loans — Application Portal
      </h1>
      <p className="mt-2 text-gray-600">
        {initialApplications.length} applications loaded
      </p>
      <ul className="mt-4 space-y-2">
        {initialApplications.map((app) => (
          <li key={app.id} className="rounded border p-3 bg-white">
            <span className="font-medium">{app.id}</span> —{" "}
            {app.applicantName} — ${app.loanAmount.toLocaleString()} —{" "}
            <span className="font-semibold">{app.currentStatus}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
