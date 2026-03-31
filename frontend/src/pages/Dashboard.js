import React from "react";
import {
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import DashboardLayout from "../layouts/DashboardLayout";
import { motion } from "framer-motion";

const KPICard = ({ title, value, icon: Icon, trend, trendValue, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {title}
            </p>
            <h3 className="text-3xl font-bold mt-1 text-gray-900 dark:text-white">
              {value}
            </h3>
          </div>
          <div
            className={`p-3 rounded-xl bg-${color}-100 dark:bg-${color}-900/30 text-${color}-600 dark:text-${color}-400`}
          >
            <Icon size={24} />
          </div>
        </div>
        <div className="flex items-center mt-4 gap-1">
          {trend === "up" ? (
            <ArrowUpRight className="text-green-500" size={16} />
          ) : (
            <ArrowDownRight className="text-red-500" size={16} />
          )}
          <span
            className={
              trend === "up"
                ? "text-green-500 font-medium"
                : "text-red-500 font-medium"
            }
          >
            {trendValue}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
            vs last month
          </span>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const barData = [
  { name: "Mon", tasks: 12 },
  { name: "Tue", tasks: 19 },
  { name: "Wed", tasks: 15 },
  { name: "Thu", tasks: 22 },
  { name: "Fri", tasks: 30 },
  { name: "Sat", tasks: 10 },
  { name: "Sun", tasks: 8 },
];

const pieData = [
  { name: "Completed", value: 65, color: "#10b981" },
  { name: "Pending", value: 25, color: "#f59e0b" },
  { name: "Overdue", value: 10, color: "#ef4444" },
];

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <div className="flex gap-3">
          <Badge variant="success" className="px-3 py-1">
            System Online
          </Badge>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Tasks"
          value="124"
          icon={Users}
          trend="up"
          trendValue="+12%"
          color="blue"
        />
        <KPICard
          title="Completed"
          value="86"
          icon={CheckCircle}
          trend="up"
          trendValue="+18%"
          color="green"
        />
        <KPICard
          title="Pending"
          value="24"
          icon={Clock}
          trend="down"
          trendValue="-5%"
          color="yellow"
        />
        <KPICard
          title="Overdue"
          value="14"
          icon={AlertCircle}
          trend="up"
          trendValue="+2%"
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Performance Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg font-semibold">
                Weekly Productivity
              </CardTitle>
              <CardDescription>
                Number of tasks completed per day
              </CardDescription>
            </div>
            <TrendingUp className="text-primary-600" size={20} />
          </CardHeader>
          <CardContent className="h-[300px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e5e7eb"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                />
                <Tooltip
                  cursor={{ fill: "#f3f4f6" }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar
                  dataKey="tasks"
                  fill="#6366f1"
                  radius={[4, 4, 0, 0]}
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Task Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Task Distribution
            </CardTitle>
            <CardDescription>Breakdown by status</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">
              Recent Activity
            </CardTitle>
            <CardDescription>Latest updates from your team</CardDescription>
          </div>
          <button className="text-sm text-primary-600 font-medium hover:underline">
            View All
          </button>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[
              {
                user: "John Doe",
                action: "completed task",
                target: "UI Redesign",
                time: "2 hours ago",
                initial: "JD",
                color: "blue",
              },
              {
                user: "Sarah Smith",
                action: "created new task",
                target: "API Integration",
                time: "4 hours ago",
                initial: "SS",
                color: "green",
              },
              {
                user: "Mike Johnson",
                action: "commented on",
                target: "Bug Report #102",
                time: "Yesterday",
                initial: "MJ",
                color: "purple",
              },
            ].map((activity, i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`h-10 w-10 rounded-full bg-${activity.color}-100 dark:bg-${activity.color}-900/30 flex items-center justify-center text-${activity.color}-600 dark:text-${activity.color}-400 font-bold`}
                  >
                    {activity.initial}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      <span className="font-bold">{activity.user}</span>{" "}
                      {activity.action}{" "}
                      <span className="text-primary-600 dark:text-primary-400 font-semibold">
                        {activity.target}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.time}
                    </p>
                  </div>
                </div>
                <MoreVertical className="text-gray-400 h-5 w-5 cursor-pointer hover:text-gray-600" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Dashboard;
