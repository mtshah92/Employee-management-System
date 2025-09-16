"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import { getAllLeaves, getMyLeaves, updateLeave } from "@/lib/api";
import { LeaveRequest, LeaveRequestsResponse } from "@/types";
import LeaveRequestForm from "@/components/LeaveRequestForm";
import LeaveTable from "@/components/LeaveTable";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Dashboard() {
  const { user, requireAuth, isAdmin } = useAuth();
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!requireAuth()) return;
    fetchLeaves(1);
  }, [user]);

  const fetchLeaves = async (page = 1) => {
    try {
      setLoading(true);
      const response = isAdmin
        ? await getAllLeaves(page, 10)
        : await getMyLeaves(page, 10);
      const data: LeaveRequestsResponse = response.data;
      setLeaves(data.leaveRequests);
      setCurrentPage(data.pagination.page);
      setTotalPages(data.pagination.pages);
      setTotal(data.pagination.total);
    } catch (error) {
      console.error("Failed to fetch leaves:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (
    id: number,
    status: "approved" | "rejected"
  ) => {
    try {
      await updateLeave(id, { status });
      fetchLeaves(currentPage);
    } catch (error) {
      console.error("Failed to update leave status:", error);
    }
  };

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <div className="flex items-center space-x-2 mb-2">
              <h1 className="text-2xl font-semibold text-gray-900">
                {isAdmin ? "All Leave Requests" : "My Leave Requests"}
              </h1>
            </div>
            <p className="mt-2 text-sm text-gray-700">
              {isAdmin
                ? "Manage all employee leave requests"
                : "View your leave history and apply for new leave"}
            </p>
          </div>
          {!isAdmin && (
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Apply for Leave
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSpinner />
        ) : (
          <LeaveTable
            leaves={leaves}
            isAdmin={isAdmin}
            onStatusUpdate={handleStatusUpdate}
            pagination={
              totalPages > 1
                ? {
                    currentPage,
                    totalPages,
                    total,
                    onPageChange: fetchLeaves,
                  }
                : undefined
            }
          />
        )}
      </div>

      {showForm && (
        <LeaveRequestForm
          onClose={() => setShowForm(false)}
          onSuccess={() => fetchLeaves(currentPage)}
        />
      )}
    </Layout>
  );
}
