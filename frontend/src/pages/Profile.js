import React, { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Camera,
  CheckCircle,
  Clock,
  Award,
  Save,
  Shield,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import DashboardLayout from "../layouts/DashboardLayout";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

const ProfilePage = () => {
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Senior Developer",
    joinDate: "January 2024",
    avatar: null,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Profile updated successfully!");
    }, 1000);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Profile Settings
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your personal information and preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Sidebar */}
          <div className="space-y-6">
            <Card className="text-center p-6 border-none shadow-sm">
              <div className="relative inline-block group">
                <div className="h-32 w-32 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 text-4xl font-bold border-4 border-white dark:border-gray-800 shadow-lg mx-auto">
                  {user.name?.[0]?.toUpperCase() || "U"}
                </div>
                <button className="absolute bottom-0 right-0 p-2 rounded-full bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all group-hover:scale-110">
                  <Camera
                    size={18}
                    className="text-gray-600 dark:text-gray-300"
                  />
                </button>
              </div>
              <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">
                {user.name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user.role}
              </p>

              <div className="mt-6 flex flex-col gap-2">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CheckCircle size={16} className="text-green-500" />
                    <span>Tasks Completed</span>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white">
                    48
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Clock size={16} className="text-blue-500" />
                    <span>Hours Tracked</span>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white">
                    164h
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Award size={16} className="text-yellow-500" />
                    <span>Efficiency</span>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white">
                    94%
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-none shadow-sm">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Account Security
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                    <Shield size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Two-Factor Auth
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Currently enabled
                    </p>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4">
                Manage Security
              </Button>
            </Card>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details and how others see you on the
                    platform.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleUpdateProfile}>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Full Name"
                        value={user.name}
                        onChange={(e) =>
                          setUser({ ...user, name: e.target.value })
                        }
                        placeholder="John Doe"
                      />
                      <Input
                        label="Email Address"
                        type="email"
                        value={user.email}
                        onChange={(e) =>
                          setUser({ ...user, email: e.target.value })
                        }
                        placeholder="john@example.com"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Role / Position"
                        value={user.role}
                        onChange={(e) =>
                          setUser({ ...user, role: e.target.value })
                        }
                        placeholder="Senior Developer"
                      />
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Joined Date
                        </label>
                        <div className="h-10 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-sm flex items-center">
                          {user.joinDate}
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-800 pt-6 mt-6">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                        Change Password
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                          label="New Password"
                          type="password"
                          placeholder="••••••••"
                        />
                        <Input
                          label="Confirm New Password"
                          type="password"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="justify-end gap-3 border-t border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 py-4">
                    <Button variant="secondary" type="button">
                      Discard Changes
                    </Button>
                    <Button
                      type="submit"
                      isLoading={isLoading}
                      className="gap-2"
                    >
                      <Save size={18} />
                      Save Changes
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
