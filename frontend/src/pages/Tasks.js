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
  CheckCircle2,
  Send,
  Eye,
  FileText,
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
import { 
  getTasks, 
  getAllTasksAdmin, 
  createTask, 
  deleteTask, 
  getUsers, 
  updateTaskStatus, 
  updateTaskAdmin, 
  submitTask 
} from "../services/api";

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "admin";

  // Forms
  const [newTask, setNewTask] = useState({ title: "", priority: "medium", deadline: "", description: "", assignedUser: "" });
  const [submission, setSubmission] = useState({ text: "", file: null });
  const [adminFile, setAdminFile] = useState(null);

  useEffect(() => {
    fetchTasks();
    if (isAdmin) fetchUsers();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = isAdmin ? await getAllTasksAdmin() : await getTasks();
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

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
      toast.success(`Status updated to ${newStatus}`);
      fetchTasks();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleCreateTask = async () => {
    if (!newTask.title || !newTask.assignedUser) {
      return toast.error("Title and Assigned User are required");
    }
    try {
      const formData = new FormData();
      Object.keys(newTask).forEach(key => formData.append(key, newTask[key]));
      if (adminFile) formData.append("file", adminFile);

      await createTask(formData);
      toast.success("Task assigned successfully!");
      setIsModalOpen(false);
      setNewTask({ title: "", priority: "medium", deadline: "", description: "", assignedUser: "" });
      setAdminFile(null);
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating task");
    }
  };

  const handleSubmitTask = async () => {
    if (!submission.text && !submission.file) {
      return toast.error("Please provide a description or upload a file");
    }
    try {
      const formData = new FormData();
      formData.append("submissionText", submission.text);
      if (submission.file) formData.append("file", submission.file);

      await submitTask(selectedTask._id, formData);
      toast.success("Task submitted for review!");
      setIsSubmitModalOpen(false);
      setSubmission({ text: "", file: null });
      fetchTasks();
    } catch (err) {
      toast.error("Submission failed");
    }
  };

  const handleApproveTask = async (taskId) => {
    try {
      await updateTaskAdmin(taskId, { status: "completed" });
      toast.success("Task marked as completed");
      setIsReviewModalOpen(false);
      fetchTasks();
    } catch (err) {
      toast.error("Approval failed");
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(id);
        toast.success("Task deleted");
        fetchTasks();
      } catch (err) {
        toast.error("Delete failed");
      }
    }
  };

  const getPriorityBadge = (priority) => {
    const variants = { high: "danger", medium: "warning", low: "success" };
    return <Badge variant={variants[priority] || "secondary"}>{priority}</Badge>;
  };

  const getStatusBadge = (status) => {
    const configs = {
      completed: { variant: "success", label: "Completed" },
      submitted: { variant: "default", label: "Under Review", className: "bg-blue-100 text-blue-800" },
      "in-progress": { variant: "default", label: "In Progress", className: "bg-purple-100 text-purple-800" },
      pending: { variant: "warning", label: "Pending" },
      overdue: { variant: "danger", label: "Overdue" },
    };
    const config = configs[status] || { variant: "secondary", label: status };
    return <Badge variant={config.variant} className={`rounded-md ${config.className || ""}`}>{config.label}</Badge>;
  };

  const filteredTasks = tasks.filter(t => 
    (t.title?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterStatus === "all" || t.status === filterStatus)
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tasks</h1>
            <p className="text-gray-500 dark:text-gray-400">
              {isAdmin ? "Oversee and manage team performance." : "Track and complete your assigned goals."}
            </p>
          </div>
          {isAdmin && (
            <Button onClick={() => setIsModalOpen(true)} className="gap-2">
              <Plus size={18} /> Assign Task
            </Button>
          )}
        </div>

        {/* Search & Filter */}
        <Card className="bg-white/50 backdrop-blur-md dark:bg-gray-900/50">
          <CardContent className="p-4 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by title..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 dark:bg-gray-950 focus:ring-2 focus:ring-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 dark:bg-gray-950"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              {["pending", "in-progress", "submitted", "completed"].map(s => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </CardContent>
        </Card>

        {/* Task List */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-800/50 border-b">
                <tr>
                  <th className="px-6 py-4 font-semibold">Details</th>
                  <th className="px-6 py-4 font-semibold">Priority</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Deadline</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredTasks.map((task) => (
                  <tr key={task._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 group animate-in fade-in duration-300">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          {task.title}
                          {task.taskFileUrl && <Paperclip size={14} className="text-gray-400" />}
                        </span>
                        <span className="text-xs text-gray-500 italic">
                          {isAdmin ? `To: ${task.assignedUser?.name}` : "From: Admin"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{getPriorityBadge(task.priority)}</td>
                    <td className="px-6 py-4">{getStatusBadge(task.status)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {task.deadline ? new Date(task.deadline).toLocaleDateString() : "No deadline"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {!isAdmin && task.status === "pending" && (
                          <Button variant="secondary" size="sm" onClick={() => handleStatusChange(task._id, "in-progress")}>
                            Start
                          </Button>
                        )}
                        {!isAdmin && (task.status === "pending" || task.status === "in-progress") && (
                          <Button size="sm" className="gap-1 bg-green-600 hover:bg-green-700" onClick={() => { setSelectedTask(task); setIsSubmitModalOpen(true); }}>
                            <Send size={14} /> Submit
                          </Button>
                        )}
                        {isAdmin && task.status === "submitted" && (
                          <Button variant="success" size="sm" className="gap-1" onClick={() => { setSelectedTask(task); setIsReviewModalOpen(true); }}>
                            <Eye size={14} /> Review
                          </Button>
                        )}
                        {isAdmin && (
                          <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50" onClick={() => handleDeleteTask(task._id)}>
                            <Trash2 size={16} />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredTasks.length === 0 && !loading && (
            <div className="p-12 text-center text-gray-500">No tasks found. Try relaxing your filters.</div>
          )}
        </Card>
      </div>

      {/* Admin: Create Task Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Assign New Task">
        <div className="space-y-4">
          <Input label="Task Title" placeholder="What needs to be done?" value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} />
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Assign To</label>
            <select className="w-full px-3 py-2 rounded-md border dark:bg-gray-950" value={newTask.assignedUser} onChange={(e) => setNewTask({...newTask, assignedUser: e.target.value})}>
              <option value="">Select Talent...</option>
              {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Priority</label>
              <select className="w-full h-10 px-3 border rounded-md dark:bg-gray-950" value={newTask.priority} onChange={(e) => setNewTask({...newTask, priority: e.target.value})}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <Input label="Deadline" type="date" value={newTask.deadline} onChange={(e) => setNewTask({...newTask, deadline: e.target.value})} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Resources / Instructions (File)</label>
            <input type="file" onChange={(e) => setAdminFile(e.target.files[0])} className="w-full text-sm" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Detailed Description</label>
            <textarea className="w-full p-2 border rounded-md min-h-[100px] dark:bg-gray-950" value={newTask.description} onChange={(e) => setNewTask({...newTask, description: e.target.value})} />
          </div>
          <div className="flex gap-2 justify-end pt-4">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateTask}>Send Out Task</Button>
          </div>
        </div>
      </Modal>

      {/* User: Submit Task Modal */}
      <Modal isOpen={isSubmitModalOpen} onClose={() => setIsSubmitModalOpen(false)} title="Submit Work Evidence">
        <div className="space-y-4">
          <p className="text-sm text-gray-500">Provide details of your completed work for admin review.</p>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Submission Notes</label>
            <textarea className="w-full p-2 border rounded-md min-h-[150px] dark:bg-gray-950" placeholder="Describe what you've accomplished..." value={submission.text} onChange={(e) => setSubmission({...submission, text: e.target.value})} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Upload File / Screenshot</label>
            <input type="file" onChange={(e) => setSubmission({...submission, file: e.target.files[0]})} className="w-full text-sm" />
          </div>
          <div className="flex gap-2 justify-end pt-4">
            <Button variant="secondary" onClick={() => setIsSubmitModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmitTask} className="bg-green-600 hover:bg-green-700">Submit Work</Button>
          </div>
        </div>
      </Modal>

      {/* Admin: Review Submission Modal */}
      <Modal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} title="Review Submission">
        {selectedTask && (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-500 uppercase">Task Context</h4>
              <p className="text-lg font-bold">{selectedTask.title}</p>
              <p className="text-sm text-gray-600 mt-1">{selectedTask.description}</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <h4 className="text-sm font-semibold text-gray-500 uppercase flex items-center gap-2">
                <FileText size={16} /> Submission Details
              </h4>
              <p className="mt-2 text-gray-900 dark:text-white whitespace-pre-wrap">{selectedTask.submissionText || "No text provided."}</p>
              {selectedTask.submissionFileUrl && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <a href={`http://localhost:5000${selectedTask.submissionFileUrl}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 p-2 bg-white dark:bg-gray-950 rounded border text-primary-600 hover:underline">
                    <Paperclip size={16} /> View Attached Evidence
                  </a>
                </div>
              )}
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="secondary" onClick={() => setIsReviewModalOpen(false)}>Later</Button>
              <Button onClick={() => handleApproveTask(selectedTask._id)} className="bg-green-600 hover:bg-green-700 gap-2">
                <CheckCircle2 size={18} /> Approve & Complete
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default TaskPage;
