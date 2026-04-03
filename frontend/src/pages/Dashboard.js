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
  { name: "Mon", tasks: 0 },
  { name: "Tue", tasks: 0 },
  { name: "Wed", tasks: 0 },
  { name: "Thu", tasks: 0 },
  { name: "Fri", tasks: 0 },
  { name: "Sat", tasks: 0 },
  { name: "Sun", tasks: 0 },
];

const pieData = [
  { name: "Completed", value: 0, color: "#10b981" },
  { name: "Pending", value: 0, color: "#f59e0b" },
  { name: "Overdue", value: 0, color: "#ef4444" },
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
          value="0"
          icon={Users}
          trend="up"
          trendValue="0%"
          color="blue"
        />
        <KPICard
          title="Completed"
          value="0"
          icon={CheckCircle}
          trend="up"
          trendValue="0%"
          color="green"
        />
        <KPICard
          title="Pending"
          value="0"
          icon={Clock}
          trend="down"
          trendValue="0%"
          color="yellow"
        />
        <KPICard
          title="Overdue"
          value="0"
          icon={AlertCircle}
          trend="up"
          trendValue="0%"
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
            <CardDescription>No active logs found.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center text-gray-400">
            Select a task to see recent updates or create your first one.
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Dashboard;
