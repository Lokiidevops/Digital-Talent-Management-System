import React, { useEffect, useMemo, useRef, useState } from "react";

function ProfileMenu({ theme, onToggleTheme, onLogout }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const user = useMemo(() => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }, []);

  const displayName = user?.name || user?.email || "User";
  const email = user?.email || "";

  useEffect(() => {
    if (!open) return;

    const onDocMouseDown = (e) => {
      if (!wrapperRef.current) return;
      const inside = wrapperRef.current.contains(e.target);
      if (!inside) setOpen(false);
    };

    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [open]);

  return (
    <div className="ws-profile" ref={wrapperRef}>
      <button
        type="button"
        className="ws-btn ws-btn--ghost ws-profile-btn"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="ws-profile-avatar" aria-hidden="true">
          {String(displayName).slice(0, 1).toUpperCase()}
        </span>
        <span className="ws-profile-name">{displayName}</span>
      </button>

      {open ? (
        <div className="ws-profile-menu" role="menu" aria-label="Profile menu">
          <div className="ws-profile-menu-head">
            <div className="ws-profile-avatar-lg" aria-hidden="true">
              {String(displayName).slice(0, 1).toUpperCase()}
            </div>
            <div>
              <div className="ws-profile-user">{displayName}</div>
              {email ? <div className="ws-profile-email">{email}</div> : null}
            </div>
          </div>

          <div className="ws-profile-divider" />

          <button
            type="button"
            className="ws-profile-action"
            onClick={() => onToggleTheme()}
          >
            <span>Theme</span>
            <span className="ws-profile-action-value">
              {theme === "dark" ? "Dark" : "Light"}
            </span>
          </button>

          <button
            type="button"
            className="ws-profile-action"
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
          >
            <span>Logout</span>
            <span className="ws-profile-action-value ws-profile-danger">
              Sign out
            </span>
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default ProfileMenu;
