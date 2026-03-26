import React, { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import TaskLayout from "../components/TaskLayout";
import TaskForm from "../components/TaskForm";

function toDateInputValue(dateLike) {
  if (!dateLike) return "";
  const d = new Date(dateLike);
  if (Number.isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function formatDeadline(dateLike) {
  if (!dateLike) return "—";
  const d = new Date(dateLike);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString();
}

function Tasks() {
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  const role = user?.role || "user";
  const isAdmin = role === "admin";

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState({ type: "info", message: "" });

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDeadline, setEditDeadline] = useState("");
  const [editPriority, setEditPriority] = useState("medium");
  const [editAssignedUserEmail, setEditAssignedUserEmail] = useState("");
  const [editSaving, setEditSaving] = useState(false);

  const [submitOpenId, setSubmitOpenId] = useState(null);
  const [submitText, setSubmitText] = useState("");
  const [submitFile, setSubmitFile] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = isAdmin ? await API.get("/tasks") : await API.get("/tasks/mine");
      setTasks(res.data);
    } catch (error) {
      setNotice({
        type: "error",
        message: error.response?.data?.message || "Failed to load tasks",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();

  }, [isAdmin]);

  const openSubmit = (t) => {
    setSubmitOpenId(t._id);
    setSubmitText(t.submissionText || "");
    setSubmitFile(null);
  };

  const closeSubmit = () => {
    setSubmitOpenId(null);
    setSubmitText("");
    setSubmitFile(null);
    setSubmitLoading(false);
  };

  const confirmSubmit = async (id) => {
    if (!submitText.trim() && !submitFile) {
      setNotice({ type: "error", message: "Add submission text or attach a file." });
      return;
    }

    try {
      setSubmitLoading(true);
      const formData = new FormData();
      formData.append("submissionText", submitText);
      if (submitFile) formData.append("file", submitFile);

      await API.post(`/tasks/submit/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      closeSubmit();
      await fetchTasks();
      setNotice({ type: "success", message: "Submission saved." });
    } catch (error) {
      setNotice({
        type: "error",
        message: error.response?.data?.message || "Failed to submit task",
      });
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
      setNotice({ type: "success", message: "Task deleted." });
    } catch (error) {
      setNotice({
        type: "error",
        message: error.response?.data?.message || "Failed to delete task",
      });
    }
  };

  const startEdit = (task) => {
    setEditingTaskId(task._id);
    setEditTitle(task.title || "");
    setEditDescription(task.description || "");
    setEditDeadline(toDateInputValue(task.deadline));
    setEditPriority(task.priority || "medium");
    setEditAssignedUserEmail(task.assignedUser?.email || "");
    closeSubmit();
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditTitle("");
    setEditDescription("");
    setEditDeadline("");
    setEditPriority("medium");
    setEditAssignedUserEmail("");
    setEditSaving(false);
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    if (!editTitle.trim()) {
      setNotice({ type: "error", message: "Title is required." });
      return;
    }
    if (!editAssignedUserEmail.trim()) {
      setNotice({ type: "error", message: "Assigned user email is required." });
      return;
    }

    try {
      setEditSaving(true);
      await API.put(`/tasks/${editingTaskId}`, {
        title: editTitle,
        description: editDescription,
        deadline: editDeadline || null,
        priority: editPriority,
        assignedUserEmail: editAssignedUserEmail,
      });
      cancelEdit();
      await fetchTasks();
      setNotice({ type: "success", message: "Task updated." });
    } catch (error) {
      setNotice({
        type: "error",
        message: error.response?.data?.message || "Failed to update task",
      });
    } finally {
      setEditSaving(false);
    }
  };

  const markCompleted = async (id) => {
    try {
      await API.put(`/tasks/${id}`, { status: "completed" });
      await fetchTasks();
      setNotice({ type: "success", message: "Task marked completed." });
    } catch (error) {
      setNotice({
        type: "error",
        message: error.response?.data?.message || "Failed to update status",
      });
    }
  };

  return (
    <TaskLayout
      title="Tasks"
      subtitle="Admin can manage tasks. Users can submit text/files and track status."
    >
      {notice.message ? (
        <div
          className="ws-card"
          style={{
            marginBottom: "1rem",
            borderLeftColor:
              notice.type === "success"
                ? "var(--ws-accent)"
                : notice.type === "error"
                  ? "var(--ws-danger)"
                  : "var(--ws-border)",
          }}
        >
          {notice.message}
        </div>
      ) : null}

      <div className="ws-btn-row" style={{ marginBottom: "1.25rem" }}>
        {isAdmin ? (
          <Link to="/tasks/create" className="ws-btn ws-btn--primary">
            + New task
          </Link>
        ) : null}
        <Link to="/dashboard" className="ws-btn ws-btn--ghost">
          Dashboard
        </Link>
      </div>

      {loading ? (
        <div className="ws-empty">Loading tasks…</div>
      ) : tasks.length === 0 ? (
        <div className="ws-empty">
          No tasks yet.
          {isAdmin ? <div style={{ marginTop: "0.5rem" }}>Create one to begin.</div> : null}
        </div>
      ) : isAdmin ? (
        <div style={{ overflowX: "auto" }}>
          <table className="ws-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Priority</th>
                <th>Deadline</th>
                <th>Assigned</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) =>
                editingTaskId === t._id ? (
                  <tr key={`edit-${t._id}`}>
                    <td colSpan={6}>
                      <TaskForm
                        embedded
                        idPrefix={`edit-${t._id}`}
                        title={editTitle}
                        description={editDescription}
                        deadline={editDeadline}
                        priority={editPriority}
                        assignedUserEmail={editAssignedUserEmail}
                        onTitleChange={setEditTitle}
                        onDescriptionChange={setEditDescription}
                        onDeadlineChange={setEditDeadline}
                        onPriorityChange={setEditPriority}
                        onAssignedUserEmailChange={setEditAssignedUserEmail}
                        onSubmit={saveEdit}
                        submitLabel="Save changes"
                        loading={editSaving}
                        onCancel={cancelEdit}
                        cancelLabel="Cancel"
                        showAdvanced
                      />
                    </td>
                  </tr>
                ) : (
                  <tr key={t._id}>
                    <td style={{ fontWeight: 700 }}>{t.title}</td>
                    <td>{String(t.priority || "medium")}</td>
                    <td>{formatDeadline(t.deadline)}</td>
                    <td>{t.assignedUser?.email || "—"}</td>
                    <td>
                      <span className={`ws-badge ws-badge--${t.status}`}>
                        {t.status}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {t.status !== "completed" ? (
                        <button
                          type="button"
                          className="ws-btn ws-btn--primary"
                          style={{ marginRight: "0.4rem" }}
                          onClick={() => markCompleted(t._id)}
                        >
                          Complete
                        </button>
                      ) : null}
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
                        style={{ marginLeft: "0.4rem" }}
                        onClick={() => deleteTask(t._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="ws-card-grid">
          {tasks.map((t) => (
            <article key={t._id} className={`ws-card ws-card--${t.status}`}>
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

              <div className="ws-card-meta">
                <strong style={{ color: "var(--ws-text)" }}>Deadline:</strong> {formatDeadline(t.deadline)}
                <div style={{ marginTop: "0.3rem" }}>
                  <strong style={{ color: "var(--ws-text)" }}>Priority:</strong> {t.priority || "medium"}
                </div>
              </div>

              {t.submissionText || t.submissionFileUrl ? (
                <div className="ws-card-meta">
                  <strong style={{ color: "var(--ws-text)" }}>Submission:</strong>
                  {t.submissionText ? <div style={{ marginTop: "0.35rem" }}>{t.submissionText}</div> : null}
                  {t.submissionFileUrl ? (
                    <div style={{ marginTop: "0.6rem" }}>
                      <a href={t.submissionFileUrl} target="_blank" rel="noreferrer">
                        View file
                      </a>
                    </div>
                  ) : null}
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
                    value={submitText}
                    onChange={(e) => setSubmitText(e.target.value)}
                    placeholder="Paste summary, link, or notes…"
                    disabled={submitLoading}
                  />
                  <div style={{ marginBottom: "0.75rem" }}>
                    <label className="ws-label" htmlFor={`file-${t._id}`}>
                      Attach file (optional)
                    </label>
                    <input
                      id={`file-${t._id}`}
                      type="file"
                      className="ws-input"
                      onChange={(e) => setSubmitFile(e.target.files?.[0] || null)}
                      disabled={submitLoading}
                    />
                  </div>

                  <div className="ws-btn-row">
                    <button
                      type="button"
                      className="ws-btn ws-btn--primary"
                      onClick={() => confirmSubmit(t._id)}
                      disabled={submitLoading}
                    >
                      {submitLoading ? "Submitting…" : "Submit"}
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

              {t.status !== "completed" && submitOpenId !== t._id ? (
                <div className="ws-btn-row" style={{ marginTop: "0.9rem" }}>
                  <button
                    type="button"
                    className="ws-btn ws-btn--primary"
                    onClick={() => openSubmit(t)}
                  >
                    Submit
                  </button>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </TaskLayout>
  );
}

export default Tasks;
