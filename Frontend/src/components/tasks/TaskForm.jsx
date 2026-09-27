import { useEffect, useState } from "react";
import { createTask, updateMyTask } from "../../services/taskService";
import styles from "./TaskForm.module.css";

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

        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter task title"
          className={styles.input}
        />
      </div>

      {/* Description */}
      <div className={styles.field}>
        <label htmlFor="description" className={styles.label}>
          Description
        </label>

        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter task description"
          rows="4"
          className={styles.textarea}
        />
      </div>

      {/* Priority and Due Date */}
      <div className={styles.detailsRow}>
        {/* Priority */}
        <div className={styles.field}>
          <label htmlFor="priority" className={styles.label}>
            Priority
          </label>

          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className={styles.select}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Due Date */}
        <div className={styles.field}>
          <label htmlFor="dueDate" className={styles.label}>
            Due Date
          </label>

          <input
            id="dueDate"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
            className={styles.input}
          />
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
              ? "Updating..."
              : "Adding..."
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
