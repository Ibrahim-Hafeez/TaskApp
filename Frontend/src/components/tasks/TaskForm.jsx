import { useEffect, useState } from "react";
import { createTask, updateMyTask } from "../../services/taskService";

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
    <form onSubmit={handleSubmit}>
      {/* Title */}
      <div style={{ marginBottom: "18px" }}>
        <label
          htmlFor="title"
          style={{
            display: "block",
            marginBottom: "7px",
            fontWeight: "600",
            color: "#374151",
          }}
        >
          Task Title
        </label>

        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter task title"
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "11px 12px",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            fontSize: "15px",
            outline: "none",
          }}
        />
      </div>

      {/* Description */}
      <div style={{ marginBottom: "18px" }}>
        <label
          htmlFor="description"
          style={{
            display: "block",
            marginBottom: "7px",
            fontWeight: "600",
            color: "#374151",
          }}
        >
          Description
        </label>

        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter task description"
          rows="4"
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "11px 12px",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            fontSize: "15px",
            resize: "vertical",
            fontFamily: "inherit",
          }}
        />
      </div>

      {/* Priority and Due Date */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "18px",
          marginBottom: "20px",
        }}
      >
        {/* Priority */}
        <div>
          <label
            htmlFor="priority"
            style={{
              display: "block",
              marginBottom: "7px",
              fontWeight: "600",
              color: "#374151",
            }}
          >
            Priority
          </label>

          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "11px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "15px",
              backgroundColor: "#fff",
            }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Due Date */}
        <div>
          <label
            htmlFor="dueDate"
            style={{
              display: "block",
              marginBottom: "7px",
              fontWeight: "600",
              color: "#374151",
            }}
          >
            Due Date
          </label>

          <input
            id="dueDate"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "10px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "15px",
              backgroundColor: "#fff",
            }}
          />
        </div>
      </div>

      {/* Error */}
      {errorMsg && (
        <div
          style={{
            marginBottom: "18px",
            padding: "11px 12px",
            borderRadius: "8px",
            backgroundColor: "#fee2e2",
            color: "#b91c1c",
            fontSize: "14px",
          }}
        >
          {errorMsg}
        </div>
      )}

      {/* Buttons */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <button
          type="submit"
          disabled={loading}
          style={{
            border: "none",
            borderRadius: "8px",
            padding: "11px 20px",
            backgroundColor: loading ? "#9ca3af" : "#2563eb",
            color: "#fff",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "600",
            fontSize: "14px",
          }}
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
            style={{
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              padding: "11px 20px",
              backgroundColor: "#fff",
              color: "#374151",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "600",
              fontSize: "14px",
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default TaskForm;
