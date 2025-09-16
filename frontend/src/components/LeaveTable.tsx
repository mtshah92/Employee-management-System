import { useState } from "react";
import { LeaveRequest } from "@/types";
import { CheckCircle, Clock, XCircle, Calendar, Eye } from "lucide-react";
import LeaveDetailModal from "./LeaveDetailModal";

interface LeaveTableProps {
  leaves: LeaveRequest[];
  isAdmin: boolean;
  onStatusUpdate: (id: number, status: "approved" | "rejected") => void;
  pagination?: {
    currentPage: number;
    totalPages: number;
    total: number;
    onPageChange: (page: number) => void;
  };
}

const STATUS_CONFIG: Record<string, { icon: JSX.Element; color: string }> = {
  approved: {
    icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    color: "bg-green-100 text-green-800",
  },
  rejected: {
    icon: <XCircle className="h-5 w-5 text-red-500" />,
    color: "bg-red-100 text-red-800",
  },
  pending: {
    icon: <Clock className="h-5 w-5 text-yellow-500" />,
    color: "bg-yellow-100 text-yellow-800",
  },
};

const COLUMNS = [
  { key: "employee", label: "Employee", adminOnly: true },
  { key: "leaveType", label: "Leave Type" },
  { key: "dates", label: "Dates" },
  { key: "status", label: "Status" },
  { key: "reason", label: "Reason" },
  { key: "actions", label: "Actions" },
];

export default function LeaveTable({
  leaves,
  isAdmin,
  onStatusUpdate,
  pagination,
}: LeaveTableProps) {
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const visibleColumns = COLUMNS.filter((col) => !col.adminOnly || isAdmin);

  const handleStatusUpdate = async (
    id: number,
    status: "approved" | "rejected"
  ) => {
    setLoadingId(id);
    try {
      await onStatusUpdate(id, status);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  {visibleColumns.map((col) => (
                    <th
                      key={col.key}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide"
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaves.length === 0 ? (
                  <tr>
                    <td
                      colSpan={visibleColumns.length}
                      className="px-6 py-12 text-center text-sm text-gray-500"
                    >
                      <div className="flex flex-col items-center">
                        <Calendar className="h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                          No leave requests
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {isAdmin
                            ? "No leave requests have been submitted yet."
                            : "You haven't applied for any leave yet."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  leaves.map((leave) => {
                    const status =
                      STATUS_CONFIG[leave.status] || STATUS_CONFIG.pending;
                    return (
                      <tr key={leave.id}>
                        {isAdmin && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {leave.firstName} {leave.lastName}
                          </td>
                        )}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {leave.leaveType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(leave.startDate).toLocaleDateString()} –{" "}
                          {new Date(leave.endDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {status.icon}
                            <span
                              className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${status.color}`}
                            >
                              {leave.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                          {leave.reason}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setSelectedLeave(leave)}
                              className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </button>
                            {isAdmin && leave.status === "pending" && (
                              <>
                                <button
                                  onClick={() => handleStatusUpdate(leave.id, "approved")}
                                  disabled={loadingId === leave.id}
                                  className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                  {loadingId === leave.id ? (
                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                                  ) : (
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                  )}
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleStatusUpdate(leave.id, "rejected")}
                                  disabled={loadingId === leave.id}
                                  className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                  {loadingId === leave.id ? (
                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                                  ) : (
                                    <XCircle className="h-3 w-3 mr-1" />
                                  )}
                                  Reject
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="mt-4 text-xs text-gray-500">
          Page {pagination.currentPage} of {pagination.totalPages} (Total:{" "}
          {pagination.total} results)
        </div>
      )}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() =>
                pagination.onPageChange(pagination.currentPage - 1)
              }
              disabled={pagination.currentPage === 1}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() =>
                pagination.onPageChange(pagination.currentPage + 1)
              }
              disabled={pagination.currentPage === pagination.totalPages}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {(pagination.currentPage - 1) * 10 + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(pagination.currentPage * 10, pagination.total)}
                </span>{" "}
                of <span className="font-medium">{pagination.total}</span>{" "}
                results
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                <button
                  onClick={() =>
                    pagination.onPageChange(pagination.currentPage - 1)
                  }
                  disabled={pagination.currentPage === 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from(
                  { length: Math.min(pagination.totalPages, 5) },
                  (_, i) => {
                    const page = i + Math.max(1, pagination.currentPage - 2);
                    if (page > pagination.totalPages) return null;
                    return (
                      <button
                        key={page}
                        onClick={() => pagination.onPageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                          page === pagination.currentPage
                            ? "bg-blue-600 text-white"
                            : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  }
                )}
                <button
                  onClick={() =>
                    pagination.onPageChange(pagination.currentPage + 1)
                  }
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
      
      {/* Leave Detail Modal */}
      {selectedLeave && (
        <LeaveDetailModal
          leave={selectedLeave}
          isAdmin={isAdmin}
          onClose={() => setSelectedLeave(null)}
        />
      )}
    </div>
  );
}
