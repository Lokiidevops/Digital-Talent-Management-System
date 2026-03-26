import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import TaskLayout from "../components/TaskLayout";

function Dashboard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    API.get("/tasks").then((res) => setTasks(res.data));
  }, []);

  const total = tasks.length;
  const pending = tasks.filter((t) => t.status === "pending").length;
  const submitted = tasks.filter((t) => t.status === "submitted").length;
  const completed = tasks.filter((t) => t.status === "completed").length;

  return (
    <TaskLayout
      title="Overview"
      subtitle="Snapshot of work in the Digital Talent Management System. Counts update from live task data."
    >
      <div className="ws-stats">
        <div className="ws-stat">
          <div className="ws-stat-value">{total}</div>
          <div className="ws-stat-label">Total</div>
        </div>
        <div className="ws-stat">
          <div className="ws-stat-value">{pending}</div>
          <div className="ws-stat-label">Pending</div>
        </div>
        <div className="ws-stat">
          <div className="ws-stat-value">{submitted}</div>
          <div className="ws-stat-label">Submitted</div>
        </div>
        <div className="ws-stat">
          <div className="ws-stat-value">{completed}</div>
          <div className="ws-stat-label">Completed</div>
        </div>
      </div>

      <div
        className="ws-card"
        style={{ marginBottom: "1.25rem", borderLeftColor: "#0d9488" }}
      >
        <div className="ws-card-head" style={{ marginBottom: 0 }}>
          <h2 className="ws-card-title" style={{ fontSize: "1rem" }}>
            Quick actions
          </h2>
        </div>
        <div className="ws-btn-row" style={{ marginTop: "0.85rem" }}>
          <Link to="/tasks" className="ws-btn ws-btn--primary">
            View all tasks
          </Link>
          <Link to="/tasks/create" className="ws-btn ws-btn--ghost">
            New task
          </Link>
        </div>
      </div>

      <h2
        className="ws-page-title"
        style={{ fontSize: "1.15rem", marginBottom: "0.75rem" }}
      >
        Recent tasks
      </h2>
      {tasks.length === 0 ? (
        <div className="ws-empty">
          No tasks yet. <Link to="/tasks/create">Create your first task</Link>.
        </div>
      ) : (
        <div className="ws-card ws-recent">
          {tasks.slice(0, 5).map((task) => (
            <div key={task._id} className="ws-recent-item">
              <span className="ws-recent-title">{task.title}</span>
              <span className={`ws-badge ws-badge--${task.status}`}>
                {task.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </TaskLayout>
  );
}

export default Dashboard;
