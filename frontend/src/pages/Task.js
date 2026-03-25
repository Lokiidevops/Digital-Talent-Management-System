import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import TaskLayout from "../components/TaskLayout";
import TaskForm from "../components/TaskForm";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editSaving, setEditSaving] = useState(false);
  const [submitOpenId, setSubmitOpenId] = useState(null);
  const [submitDraft, setSubmitDraft] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchTasks = async () => {
    const res = await API.get("/tasks");
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const openSubmit = (t) => {
    setSubmitOpenId(t._id);
    setSubmitDraft(t.submission || "");
  };

  const closeSubmit = () => {
    setSubmitOpenId(null);
    setSubmitDraft("");
    setSubmitLoading(false);
  };

  const confirmSubmit = async (id) => {
    if (!submitDraft.trim()) {
      alert("Describe what you’re submitting");
      return;
    }
    try {
      setSubmitLoading(true);
      await API.post(`/tasks/submit/${id}`, { submission: submitDraft });
      closeSubmit();
      await fetchTasks();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to submit task");
    } finally {
      setSubmitLoading(false);
    }
  };

  const deleteTask = async (id) => {
    const shouldDelete = window.confirm("Delete this task?");
    if (!shouldDelete) return;

    try {
      await API.delete(`/tasks/${id}`);
      if (submitOpenId === id) closeSubmit();
      await fetchTasks();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete task");
    }
  };

  const startEdit = (task) => {
    setEditingTaskId(task._id);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    closeSubmit();
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditTitle("");
    setEditDescription("");
    setEditSaving(false);
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    if (!editTitle.trim()) {
      alert("Title is required");
      return;
    }

    try {
      setEditSaving(true);
      await API.put(`/tasks/${editingTaskId}`, {
        title: editTitle,
        description: editDescription,
      });
      cancelEdit();
      await fetchTasks();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update task");
    } finally {
      setEditSaving(false);
    }
  };

  return (
    <TaskLayout
      title="Tasks"
      subtitle="Create, refine, submit, or remove tasks. Status colors help you scan progress at a glance."
    >
      <div className="ws-btn-row" style={{ marginBottom: "1.25rem" }}>
        <Link to="/tasks/create" className="ws-btn ws-btn--primary">
          + New task
        </Link>
        <Link to="/dashboard" className="ws-btn ws-btn--ghost">
          Dashboard
        </Link>
      </div>

      {tasks.length === 0 ? (
        <div className="ws-empty">
          No tasks yet. <Link to="/tasks/create">Create one</Link> to get
          started.
        </div>
      ) : (
        <div className="ws-card-grid">
          {tasks.map((t) => (
            <article key={t._id} className={`ws-card ws-card--${t.status}`}>
              {editingTaskId === t._id ? (
                <TaskForm
                  embedded
                  idPrefix={`edit-${t._id}`}
                  title={editTitle}
                  description={editDescription}
                  onTitleChange={setEditTitle}
                  onDescriptionChange={setEditDescription}
                  onSubmit={saveEdit}
                  submitLabel="Save changes"
                  loading={editSaving}
                  onCancel={cancelEdit}
                  cancelLabel="Cancel"
                />
              ) : (
                <>
                  <div className="ws-card-head">
                    <h3 className="ws-card-title">{t.title}</h3>
                    <span className={`ws-badge ws-badge--${t.status}`}>
                      {t.status}
                    </span>
                  </div>
                  {t.description ? (
                    <p className="ws-card-body">{t.description}</p>
                  ) : (
                    <p className="ws-card-body" style={{ fontStyle: "italic" }}>
                      No description
                    </p>
                  )}
                  {t.submission ? (
                    <div className="ws-card-meta">
                      <strong style={{ color: "var(--ws-text)" }}>
                        Submission:{" "}
                      </strong>
                      {t.submission}
                    </div>
                  ) : null}

                  {submitOpenId === t._id ? (
                    <div className="ws-submit-panel">
                      <label className="ws-label" htmlFor={`submit-${t._id}`}>
                        Your submission
                      </label>
                      <textarea
                        id={`submit-${t._id}`}
                        className="ws-textarea"
                        style={{ minHeight: "88px", marginBottom: "0.75rem" }}
                        value={submitDraft}
                        onChange={(e) => setSubmitDraft(e.target.value)}
                        placeholder="Paste summary, link, or notes for reviewers…"
                        disabled={submitLoading}
                      />
                      <div className="ws-btn-row">
                        <button
                          type="button"
                          className="ws-btn ws-btn--primary"
                          onClick={() => confirmSubmit(t._id)}
                          disabled={submitLoading}
                        >
                          {submitLoading ? "Submitting…" : "Submit work"}
                        </button>
                        <button
                          type="button"
                          className="ws-btn ws-btn--ghost"
                          onClick={closeSubmit}
                          disabled={submitLoading}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : null}

                  <div className="ws-btn-row">
                    <button
                      type="button"
                      className="ws-btn ws-btn--ghost"
                      onClick={() => startEdit(t)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="ws-btn ws-btn--danger"
                      onClick={() => deleteTask(t._id)}
                    >
                      Delete
                    </button>
                    {submitOpenId !== t._id ? (
                      <button
                        type="button"
                        className="ws-btn ws-btn--primary"
                        onClick={() => openSubmit(t)}
                      >
                        Submit
                      </button>
                    ) : null}
                  </div>
                </>
              )}
            </article>
          ))}
        </div>
      )}
    </TaskLayout>
  );
}

export default Tasks;
