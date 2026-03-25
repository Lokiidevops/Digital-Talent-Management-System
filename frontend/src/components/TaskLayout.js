import React from "react";
import { NavLink, Link } from "react-router-dom";
import "../styles/workspace.css";

function TaskLayout({ title, subtitle, children }) {
  return (
    <div className="ws-root">
      <aside className="ws-sidebar" aria-label="Workspace navigation">
        <Link to="/dashboard" className="ws-brand">
          <span className="ws-brand-mark" aria-hidden="true">
            DT
          </span>
          <span className="ws-brand-text">
            <span className="ws-brand-name">DTMS</span>
            <span className="ws-brand-tag">Talent workspace</span>
          </span>
        </Link>
        <nav className="ws-nav">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => (isActive ? "ws-nav-active" : "")}
            end
          >
            <span className="ws-nav-icon" aria-hidden="true">
              ◆
            </span>
            Dashboard
          </NavLink>
          <NavLink
            to="/tasks"
            className={({ isActive }) => (isActive ? "ws-nav-active" : "")}
          >
            <span className="ws-nav-icon" aria-hidden="true">
              ≡
            </span>
            All tasks
          </NavLink>
          <NavLink
            to="/tasks/create"
            className={({ isActive }) => (isActive ? "ws-nav-active" : "")}
          >
            <span className="ws-nav-icon" aria-hidden="true">
              +
            </span>
            New task
          </NavLink>
        </nav>
      </aside>
      <div className="ws-main">
        <div className="ws-main-inner">
          {(title || subtitle) && (
            <header className="ws-page-header">
              {title ? <h1 className="ws-page-title">{title}</h1> : null}
              {subtitle ? <p className="ws-page-sub">{subtitle}</p> : null}
            </header>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

export default TaskLayout;
