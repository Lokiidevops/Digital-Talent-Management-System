import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import TaskLayout from "../components/TaskLayout";
import TaskForm from "../components/TaskForm";

function CreateTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("medium");
  const [assignedUserEmail, setAssignedUserEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Title is required");
      return;
    }
    if (!assignedUserEmail.trim()) {
      alert("Assigned user email is required");
      return;
    }

    try {
      setLoading(true);
      await API.post("/tasks", {
        title,
        description,
        deadline: deadline || null,
        priority,
        assignedUserEmail,
      });
      navigate("/tasks");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TaskLayout
      title="Create task"
      subtitle="Add a clear title and enough detail so assignees know what done looks like."
    >
      <TaskForm
        title={title}
        description={description}
        deadline={deadline}
        priority={priority}
        assignedUserEmail={assignedUserEmail}
        onTitleChange={setTitle}
        onDescriptionChange={setDescription}
        onDeadlineChange={setDeadline}
        onPriorityChange={setPriority}
        onAssignedUserEmailChange={setAssignedUserEmail}
        onSubmit={handleSubmit}
        submitLabel="Create task"
        loading={loading}
        idPrefix="create"
        showAdvanced
      />
      <p className="ws-hint">
        After creating, you’ll land on the task list where you can edit, submit
        work, or remove items.
      </p>
    </TaskLayout>
  );
}

export default CreateTask;
