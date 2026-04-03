import React, { useEffect, useState } from "react";
import { getPendingAdmins, respondToAdminRequest } from "../services/api";
import { toast } from "react-hot-toast";
import { UserCheck, UserX, Loader2, Clock } from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";

const AdminApprovalPage = () => {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    try {
      const { data } = await getPendingAdmins();
      setPending(data);
    } catch (err) {
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleAction = async (id, status) => {
    try {
      await respondToAdminRequest(id, status);
      toast.success(`Admin ${status === "active" ? "approved" : "rejected"}!`);
      fetchPending();
    } catch (err) {
      toast.error("Process failed");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Admin Approvals
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Review and manage admin account requests.
          </p>
        </div>

        <Card className="border-none shadow-md overflow-hidden">
          <CardHeader className="bg-gray-50/50 dark:bg-gray-800/50">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock size={20} className="text-primary-600" />
              Pending Requests ({pending.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-12 flex justify-center">
                <Loader2 className="animate-spin h-8 w-8 text-primary-600" />
              </div>
            ) : pending.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                No pending admin applications found.
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {pending.map((user) => (
                  <div
                    key={user._id}
                    className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors"
                  >
                    <div className="flex gap-4 items-center">
                      <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {user.name}
                        </h4>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <Badge className="mt-1" variant="outline">
                          Verified Email
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleAction(user._id, "rejected")}
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        <UserX className="mr-2" size={16} /> Reject
                      </Button>
                      <Button
                        onClick={() => handleAction(user._id, "active")}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <UserCheck className="mr-2" size={16} /> Approve
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminApprovalPage;
