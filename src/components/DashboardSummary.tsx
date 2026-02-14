import { LoanApplication } from "@/types/loan";

interface DashboardSummaryProps {
  applications: LoanApplication[];
}

export function DashboardSummary({ applications }: DashboardSummaryProps) {
  const total = applications.length;
  const pending = applications.filter((a) => a.currentStatus === "Pending").length;
  const underReview = applications.filter((a) => a.currentStatus === "Under Review").length;
  const finalized = applications.filter(
    (a) => a.currentStatus === "Approved" || a.currentStatus === "Rejected"
  ).length;

  const metrics = [
    { label: "Total", value: total, color: "bg-gray-50 text-gray-900" },
    { label: "Pending", value: pending, color: "bg-amber-50 text-amber-900" },
    { label: "Under Review", value: underReview, color: "bg-blue-50 text-blue-900" },
    { label: "Finalized", value: finalized, color: "bg-green-50 text-green-900" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {metrics.map((m) => (
        <div
          key={m.label}
          className={`rounded-lg border p-4 ${m.color}`}
        >
          <p className="text-sm font-medium opacity-70">{m.label}</p>
          <p className="mt-1 text-2xl font-bold">{m.value}</p>
        </div>
      ))}
    </div>
  );
}
