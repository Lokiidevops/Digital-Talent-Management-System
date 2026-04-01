import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell, CheckSquare, Trash2, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import DashboardLayout from "../layouts/DashboardLayout";
import { toast } from "react-hot-toast";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../services/api";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await getNotifications();
      setNotifications(data);
    } catch (err) {
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications(
        notifications.map((n) =>
          n._id === id ? { ...n, isRead: true } : n,
        ),
      );
    } catch (err) {
      toast.error("Failed to mark notification as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
      toast.success("All notifications marked as read");
    } catch (err) {
      toast.error("Failed to mark all as read");
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
              <Bell className="h-8 w-8 text-primary-600" />
              Notifications
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              You have {unreadCount} unread message{unreadCount !== 1 && "s"}.
            </p>
          </div>
          {unreadCount > 0 && (
            <Button onClick={handleMarkAllAsRead} variant="secondary" className="gap-2">
              <CheckCircle2 size={18} />
              Mark All as Read
            </Button>
          )}
        </div>

        <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm dark:bg-gray-900/50">
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {loading ? (
              <div className="p-8 text-center text-gray-500">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center">
                <div className="h-16 w-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <Bell className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  You're all caught up!
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  No new notifications to display right now.
                </p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif._id}
                  className={`p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 flex gap-4 items-start ${
                    !notif.isRead ? "bg-primary-50/30 dark:bg-primary-900/10" : ""
                  }`}
                  onClick={() => !notif.isRead && handleMarkAsRead(notif._id)}
                >
                  <div className="flex-shrink-0 mt-1">
                    <div
                      className={`h-2 w-2 rounded-full mt-2 ${
                        !notif.isRead
                          ? "bg-primary-600"
                          : "bg-transparent border border-gray-300 dark:border-gray-600"
                      }`}
                    ></div>
                  </div>
                  <div className="flex-1">
                    <p
                      className={`text-sm ${
                        !notif.isRead
                          ? "font-semibold text-gray-900 dark:text-white"
                          : "text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {notif.message}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-400">
                        {new Date(notif.createdAt).toLocaleString()}
                      </span>
                      {notif.relatedTaskId && (
                        <Link
                          to="/tasks"
                          className="text-xs text-primary-600 hover:underline flex items-center gap-1"
                        >
                          <CheckSquare size={12} />
                          View Task
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage;
