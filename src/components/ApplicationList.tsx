import { LoanApplication } from "@/types/loan";
import { StatusBadge } from "./StatusBadge";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(amount);

interface ApplicationListProps {
  applications: LoanApplication[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function ApplicationList({ applications, selectedId, onSelect }: ApplicationListProps) {
  return (
    <nav aria-label="Application list">
      <ul className="space-y-2">
        {applications.map((app) => (
          <li key={app.id}>
            <button
              onClick={() => onSelect(app.id)}
              className={`w-full rounded-lg border p-3 text-left transition-colors hover:bg-gray-50 ${
                selectedId === app.id
                  ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{app.id}</span>
                <StatusBadge status={app.currentStatus} />
              </div>
              <p className="mt-1 font-medium text-gray-900">
                {app.applicantName ?? "Unknown Applicant"}
              </p>
              <p className="mt-0.5 text-sm text-gray-600">
                {app.loanAmount ? formatCurrency(app.loanAmount) : "N/A"}
              </p>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
