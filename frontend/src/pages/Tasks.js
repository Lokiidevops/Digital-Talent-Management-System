import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit2,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Calendar,
  AlertCircle,
  Paperclip,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Input } from "../components/ui/Input";
import DashboardLayout from "../layouts/DashboardLayout";
import Modal from "../components/ui/Modal";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { getTasks, createTask, deleteTask, getUsers } from "../services/api";

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  // New task form state
  const [newTask, setNewTask] = useState({
    title: "",
    priority: "medium",
    deadline: "",
    description: "",
    assignedUser: "",
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await getTasks();
      setTasks(data);
    } catch (err) {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await getUsers();
      setUsers(data);
    } catch (err) {
      toast.error("Failed to load users");
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "high":
        return <Badge variant="danger">High</Badge>;
      case "medium":
        return <Badge variant="warning">Medium</Badge>;
      case "low":
        return <Badge variant="success">Low</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="success" className="rounded-md">
            Completed
          </Badge>
        );
      case "in-progress":
        return (
          <Badge
            variant="default"
            className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-md"
          >
            In Progress
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="warning" className="rounded-md">
            Pending
          </Badge>
        );
      case "submitted":
        return (
          <Badge variant="success" className="bg-green-100 text-green-800 rounded-md">
            Submitted
          </Badge>
        );
      case "overdue":
        return (
          <Badge variant="danger" className="rounded-md">
            Overdue
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="rounded-md">
            {status}
          </Badge>
        );
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || task.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleDeleteTask = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(id);
        setTasks(tasks.filter((t) => t._id !== id));
        toast.success("Task deleted successfully");
      } catch (err) {
        toast.error("Failed to delete task");
      }
    }
  };

  const handleCreateTask = async () => {
    if (!newTask.title || !newTask.assignedUser) {
      return toast.error("Title and Assigned User are required");
    }

    try {
      const formData = new FormData();
      formData.append("title", newTask.title);
      formData.append("priority", newTask.priority);
      if (newTask.deadline) formData.append("deadline", newTask.deadline);
      formData.append("description", newTask.description);
      formData.append("assignedUser", newTask.assignedUser);
      if (file) {
        formData.append("file", file);
      }

      await createTask(formData);
      toast.success("Task created successfully!");
      setIsModalOpen(false);
      setNewTask({ title: "", priority: "medium", deadline: "", description: "", assignedUser: "" });
      setFile(null);
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating task");
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Tasks
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage and track your team's progress.
            </p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto gap-2"
          >
            <Plus size={18} />
            Create Task
          </Button>
        </div>

        {/* Filters and Search */}
        <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm dark:bg-gray-900/50">
          <CardContent className="p-4 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search tasks..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 dark:border-gray-800 dark:bg-gray-950 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                className="px-3 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-800 dark:bg-gray-950"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="submitted">Submitted</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
              </select>
              <Button variant="secondary" size="icon">
                <Filter size={18} />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Task Table */}
        <Card className="overflow-hidden border-none shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Task Title
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Priority
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Status
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Due Date
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                <AnimatePresence mode="popLayout">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                        Loading tasks...
                      </td>
                    </tr>
                  ) : filteredTasks.map((task) => (
                    <motion.tr
                      key={task._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      layout
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium flex items-center gap-1 text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">
                            {task.title}
                            {task.taskFileUrl && <Paperclip size={14} className="text-gray-400" />}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Assigned to {task.assignedUser?.name || "Unassigned"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getPriorityBadge(task.priority)}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(task.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Calendar size={14} />
                          {task.deadline ? new Date(task.deadline).toLocaleDateString() : "No Deadline"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {task.taskFileUrl && (
                            <a 
                              href={`http://localhost:5000${task.taskFileUrl}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center h-8 w-8 rounded-md text-gray-500 hover:text-primary-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                              <Paperclip size={16} />
                            </a>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-red-600"
                            onClick={() => handleDeleteTask(task._id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          {!loading && filteredTasks.length === 0 && (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 mb-4">
                <AlertCircle size={24} />
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                No tasks found matching your criteria.
              </p>
            </div>
          )}
          <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/20">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Showing{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {filteredTasks.length}
              </span>{" "}
              tasks
            </span>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" className="gap-1">
                <ChevronLeft size={16} /> Previous
              </Button>
              <Button variant="secondary" size="sm" className="gap-1">
                Next <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Create Task Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Task"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTask}>Create Task</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input 
            label="Task Title" 
            placeholder="Enter task name" 
            value={newTask.title} 
            onChange={(e) => setNewTask({...newTask, title: e.target.value})} 
          />
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Assigned User
            </label>
            <select 
              className="w-full h-10 px-3 py-2 rounded-md border border-gray-200 bg-white text-sm dark:border-gray-800 dark:bg-gray-950"
              value={newTask.assignedUser}
              onChange={(e) => setNewTask({...newTask, assignedUser: e.target.value})}
            >
              <option value="">Select a user</option>
              {users.map(u => (
                <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Priority
              </label>
              <select 
                className="w-full h-10 px-3 py-2 rounded-md border border-gray-200 bg-white text-sm dark:border-gray-800 dark:bg-gray-950"
                value={newTask.priority}
                onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <Input 
              label="Due Date" 
              type="date" 
              value={newTask.deadline}
              onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Upload File (Image/Document)
            </label>
            <input 
              type="file" 
              accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full px-3 py-2 rounded-md border border-gray-200 bg-white text-sm dark:border-gray-800 dark:bg-gray-950"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              className="w-full min-h-[100px] px-3 py-2 rounded-md border border-gray-200 bg-white text-sm dark:border-gray-800 dark:bg-gray-950 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              placeholder="What needs to be done?"
              value={newTask.description}
              onChange={(e) => setNewTask({...newTask, description: e.target.value})}
            />
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default TaskPage;
