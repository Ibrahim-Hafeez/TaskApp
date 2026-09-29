import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { createTask, updateMyTask } from "../../services/taskService";
import styles from "./TaskForm.module.css";

import "react-datepicker/dist/react-datepicker.css";

const emptyForm = {
  title: "",
  description: "",
  priority: "medium",
  dueDate: "",
};

function TaskForm({ onTaskCreated, editingTask, onTaskUpdated, onCancelEdit }) {
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title || "",
        description: editingTask.description || "",
        priority: editingTask.priority || "medium",
        dueDate: editingTask.dueDate
          ? new Date(editingTask.dueDate).toISOString().split("T")[0]
          : "",
      });
    } else {
      setFormData(emptyForm);
    }

    setErrorMsg("");
  }, [editingTask]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Convert the text string YYYY-MM-DD from state into a real JS Date object for the component
  const getSelectedDate = () => {
    if (!formData.dueDate) return null;
    const [year, month, day] = formData.dueDate.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  // Convert the selected JS Date object back into a clean YYYY-MM-DD string for your API
  const handleDateChange = (date) => {
    if (!date) {
      setFormData((prev) => ({ ...prev, dueDate: "" }));
      return;
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    setFormData((prev) => ({
      ...prev,
      dueDate: `${year}-${month}-${day}`,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMsg("");

    if (!formData.title.trim()) {
      setErrorMsg("Task title is required.");
      return;
    }

    try {
      setLoading(true);

      const taskData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        dueDate: formData.dueDate || null,
      };

      if (editingTask) {
        const response = await updateMyTask(editingTask._id, taskData);

        onTaskUpdated(response.data);
        onCancelEdit();
      } else {
        const response = await createTask(taskData);

        onTaskCreated(response.data);

        setFormData(emptyForm);
      }
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {/* Title */}
      <div className={styles.field}>
        <label htmlFor="title" className={styles.label}>
          Task Title
        </label>

        <div className={styles.inputWrapper}>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Buy Groceries"
            maxLength={100}
            autoComplete="off"
            className={styles.input}
          />

          <span className={styles.characterCount}>
            {formData.title.length}/100
          </span>
        </div>

        <p className={styles.fieldHint}>Keep it short and action-focused.</p>
      </div>

      {/* Description */}
      <div className={styles.field}>
        <label htmlFor="description" className={styles.label}>
          Description
        </label>

        <div className={styles.descriptionEditor}>
          <div className={styles.descriptionHeader}>
            <span className={styles.descriptionIcon}>✦</span>

            <span className={styles.descriptionTitle}>
              {formData.description.trim() ? "Task notes added" : "Task notes"}
            </span>

            <span className={styles.descriptionOptional}>Optional</span>
          </div>

          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="What needs to be done? Add useful details, links, or notes..."
            rows="4"
            maxLength={500}
            className={styles.textarea}
          />

          <div className={styles.descriptionFooter}>
            <span>Add anything that will help you complete this task.</span>

            <span>{formData.description.length}/500</span>
          </div>
        </div>
      </div>

      {/* Priority and Due Date */}
      <div className={styles.detailsRow}>
        {/* Priority */}
        <div className={styles.field}>
          <span className={styles.label}>Priority</span>

          <div className={styles.priorityOptions}>
            <button
              type="button"
              className={`${styles.priorityOption} ${
                formData.priority === "low" ? styles.priorityLowActive : ""
              }`}
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  priority: "low",
                }))
              }
            >
              <span className={styles.priorityDot} />
              <span>
                <strong>Low</strong>
                <small>Light workload</small>
              </span>
            </button>

            <button
              type="button"
              className={`${styles.priorityOption} ${
                formData.priority === "medium"
                  ? styles.priorityMediumActive
                  : ""
              }`}
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  priority: "medium",
                }))
              }
            >
              <span className={styles.priorityDot} />
              <span>
                <strong>Medium</strong>
                <small>Normal priority</small>
              </span>
            </button>

            <button
              type="button"
              className={`${styles.priorityOption} ${
                formData.priority === "high" ? styles.priorityHighActive : ""
              }`}
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  priority: "high",
                }))
              }
            >
              <span className={styles.priorityDot} />
              <span>
                <strong>High</strong>
                <small>Needs attention</small>
              </span>
            </button>
          </div>
        </div>

        {/* Due Date (Custom Safe React-DatePicker Integration) */}
        <div className={styles.field}>
          <label htmlFor="dueDate" className={styles.label}>
            Due Date
          </label>

          <DatePicker
            id="dueDate"
            selected={getSelectedDate()}
            onChange={handleDateChange}
            minDate={new Date()} // Blocks past dates completely
            placeholderText="Select due date..."
            dateFormat="MMMM d, yyyy" // Looks gorgeous: e.g. "October 24, 2026"
            className={styles.input} // Inherits your gorgeous custom text box styling
            wrapperClassName={styles.datePickerWrapper}
            isClearable={false}
          />

          <div className={styles.quickDates}>
            <button
              type="button"
              onClick={() => {
                const date = new Date();
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const day = String(date.getDate()).padStart(2, "0");
                setFormData((prev) => ({
                  ...prev,
                  dueDate: `${year}-${month}-${day}`,
                }));
              }}
            >
              Today
            </button>

            <button
              type="button"
              onClick={() => {
                const date = new Date();
                date.setDate(date.getDate() + 1);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const day = String(date.getDate()).padStart(2, "0");
                setFormData((prev) => ({
                  ...prev,
                  dueDate: `${year}-${month}-${day}`,
                }));
              }}
            >
              Tomorrow
            </button>

            <button
              type="button"
              onClick={() => {
                const date = new Date();
                date.setDate(date.getDate() + 7);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const day = String(date.getDate()).padStart(2, "0");
                setFormData((prev) => ({
                  ...prev,
                  dueDate: `${year}-${month}-${day}`,
                }));
              }}
            >
              Next 7 days
            </button>

            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  dueDate: "",
                }))
              }
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Error */}
      {errorMsg && (
        <div className={styles.error} role="alert">
          {errorMsg}
        </div>
      )}

      {/* Buttons */}
      <div className={styles.actions}>
        <button
          type="submit"
          disabled={loading}
          className={`${styles.button} ${styles.submitButton}`}
        >
          {loading
            ? editingTask
              ? "Updating task..."
              : "Adding task..."
            : editingTask
              ? "Update Task"
              : "Add Task"}
        </button>

        {editingTask && (
          <button
            type="button"
            onClick={onCancelEdit}
            disabled={loading}
            className={`${styles.button} ${styles.cancelButton}`}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default TaskForm;
