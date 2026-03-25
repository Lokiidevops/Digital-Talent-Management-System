import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import TaskLayout from "../components/TaskLayout";
import TaskForm from "../components/TaskForm";

function CreateTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    try {
      setLoading(true);
      await API.post("/tasks", { title, description });
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
        onTitleChange={setTitle}
        onDescriptionChange={setDescription}
        onSubmit={handleSubmit}
        submitLabel="Create task"
        loading={loading}
        idPrefix="create"
      />
      <p className="ws-hint">
        After creating, you’ll land on the task list where you can edit, submit
        work, or remove items.
      </p>
    </TaskLayout>
  );
}

export default CreateTask;
