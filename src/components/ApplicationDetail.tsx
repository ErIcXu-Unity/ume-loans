import { ApplicationStatus, LoanApplication } from "@/types/loan";
import { StatusBadge } from "./StatusBadge";
import { StatusActions } from "./StatusActions";
import { StatusTimeline } from "./StatusTimeline";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(amount);

const formatDate = (dateStr: string) => {
  try {
    return new Intl.DateTimeFormat("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
};

const creditScoreColor = (score: number) => {
  if (score >= 700) return "text-green-700";
  if (score >= 600) return "text-amber-600";
  return "text-red-600";
};

interface ApplicationDetailProps {
  application: LoanApplication;
  isPending: boolean;
  onUpdateStatus: (newStatus: ApplicationStatus, notes: string) => void;
  onBack?: () => void;
}

export function ApplicationDetail({
  application,
  isPending,
  onUpdateStatus,
  onBack,
}: ApplicationDetailProps) {
  return (
    <div className="space-y-6">
      {/* Mobile back button */}
      {onBack && (
        <button
          onClick={onBack}
          className="text-sm text-blue-600 hover:text-blue-800 sm:hidden"
        >
          &larr; Back to list
        </button>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">{application.id}</h2>
        <div aria-live="polite">
          <StatusBadge status={application.currentStatus} size="lg" />
        </div>
      </div>

      {/* Applicant Details */}
      <section>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Applicant Details</h3>
        <div className="grid grid-cols-2 gap-4 rounded-lg border border-gray-200 bg-white p-4">
          <div>
            <p className="text-xs text-gray-500">Name</p>
            <p className="font-medium text-gray-900">{application.applicantName ?? "N/A"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Annual Income</p>
            <p className="font-medium text-gray-900">
              {application.annualIncome ? formatCurrency(application.annualIncome) : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Employment Status</p>
            <p className="font-medium text-gray-900">{application.employmentStatus ?? "N/A"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Credit Score</p>
            <p className={`font-medium ${application.creditScore ? creditScoreColor(application.creditScore) : "text-gray-900"}`}>
              {application.creditScore ?? "-"}
            </p>
          </div>
        </div>
      </section>

      {/* Loan Details */}
      <section>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Loan Details</h3>
        <div className="grid grid-cols-2 gap-4 rounded-lg border border-gray-200 bg-white p-4">
          <div>
            <p className="text-xs text-gray-500">Loan Amount</p>
            <p className="font-medium text-gray-900">
              {application.loanAmount ? formatCurrency(application.loanAmount) : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Purpose</p>
            <p className="font-medium text-gray-900">{application.loanPurpose ?? "N/A"}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-gray-500">Application Date</p>
            <p className="font-medium text-gray-900">
              {application.applicationDate ? formatDate(application.applicationDate) : "N/A"}
            </p>
          </div>
        </div>
      </section>

      {/* Status Actions */}
      <section>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Actions</h3>
        <StatusActions
          currentStatus={application.currentStatus}
          isPending={isPending}
          onAction={onUpdateStatus}
        />
      </section>

      {/* Status Timeline */}
      <section>
        <StatusTimeline history={application.statusHistory} />
      </section>
    </div>
  );
}
