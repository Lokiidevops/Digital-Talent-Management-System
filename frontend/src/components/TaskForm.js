import React from "react";

/**
 * Reusable task form — create & inline edit.
 */
function TaskForm({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  onSubmit,
  submitLabel = "Save",
  loading = false,
  onCancel,
  cancelLabel = "Cancel",
  disabled = false,
  idPrefix = "task",
  embedded = false,
}) {
  const titleId = `${idPrefix}-title`;
  const descId = `${idPrefix}-description`;
  const formClass = embedded ? "ws-form ws-form--embedded" : "ws-form";

  return (
    <form className={formClass} onSubmit={onSubmit} noValidate>
      <div className="ws-form-group">
        <label className="ws-label" htmlFor={titleId}>
          Title
        </label>
        <input
          id={titleId}
          className="ws-input"
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Short, clear task name"
          disabled={disabled || loading}
          autoComplete="off"
        />
      </div>
      <div className="ws-form-group">
        <label className="ws-label" htmlFor={descId}>
          Description
        </label>
        <textarea
          id={descId}
          className="ws-textarea"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Context, acceptance criteria, or links…"
          disabled={disabled || loading}
        />
      </div>
      <div className="ws-form-actions">
        <button
          type="submit"
          className="ws-btn ws-btn--primary"
          disabled={loading || disabled}
        >
          {loading ? "Saving…" : submitLabel}
        </button>
        {onCancel ? (
          <button
            type="button"
            className="ws-btn ws-btn--ghost"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelLabel}
          </button>
        ) : null}
      </div>
    </form>
  );
}

export default TaskForm;
