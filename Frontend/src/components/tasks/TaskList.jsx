import { deleteMyTask, updateMyTask } from "../../services/taskService";

const TaskList = ({ tasks, onTaskUpdated, onTaskDeleted, onEditTask }) => {
  if (tasks.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "35px 20px",
          color: "#6b7280",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "16px",
          }}
        >
          No tasks found.
        </p>

        <p
          style={{
            marginTop: "8px",
            fontSize: "14px",
          }}
        >
          Add a new task above to get started.
        </p>
      </div>
    );
  }

  const handleComplete = async (task) => {
    try {
      const response = await updateMyTask(task._id, {
        completed: !task.completed,
      });

      onTaskUpdated(response.data);
    } catch (err) {
      alert(err.message || "Failed to update task");
    }
  };

  const handleDelete = async (task) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${task.title}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteMyTask(task._id);

      onTaskDeleted(task._id);
    } catch (err) {
      alert(err.message || "Failed to delete task");
    }
  };

  const getPriorityStyle = (priority) => {
    if (priority === "high") {
      return {
        backgroundColor: "#fee2e2",
        color: "#b91c1c",
      };
    }

    if (priority === "medium") {
      return {
        backgroundColor: "#fef3c7",
        color: "#92400e",
      };
    }

    return {
      backgroundColor: "#dcfce7",
      color: "#166534",
    };
  };

  const getPriorityLabel = (priority) => {
    if (!priority) {
      return "Medium";
    }

    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  const isOverdue = (task) => {
    if (!task.dueDate || task.completed) {
      return false;
    }

    return new Date(task.dueDate) < new Date();
  };

  return (
    <div>
      {tasks.map((task) => {
        const overdue = isOverdue(task);
        const priorityStyle = getPriorityStyle(task.priority);

        return (
          <div
            key={task._id}
            style={{
              border: overdue ? "1px solid #fca5a5" : "1px solid #e5e7eb",
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "16px",
              backgroundColor: task.completed ? "#f9fafb" : "#fff",
              boxShadow: "0 1px 4px rgba(0, 0, 0, 0.05)",
            }}
          >
            {/* Top section */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "15px",
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "20px",
                    color: task.completed ? "#6b7280" : "#111827",
                    textDecoration: task.completed ? "line-through" : "none",
                  }}
                >
                  {task.title}
                </h3>

                {task.description && (
                  <p
                    style={{
                      marginTop: "8px",
                      marginBottom: 0,
                      color: "#6b7280",
                      lineHeight: "1.5",
                    }}
                  >
                    {task.description}
                  </p>
                )}
              </div>

              {/* Status */}
              <span
                style={{
                  padding: "5px 10px",
                  borderRadius: "999px",
                  fontSize: "12px",
                  fontWeight: "600",
                  backgroundColor: task.completed ? "#dcfce7" : "#e5e7eb",
                  color: task.completed ? "#166534" : "#374151",
                  whiteSpace: "nowrap",
                }}
              >
                {task.completed ? "Completed" : "Pending"}
              </span>
            </div>

            {/* Task information */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                flexWrap: "wrap",
                marginTop: "18px",
              }}
            >
              {/* Priority */}
              <span
                style={{
                  ...priorityStyle,
                  padding: "5px 10px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              >
                {getPriorityLabel(task.priority)} Priority
              </span>

              {/* Due date */}
              {task.dueDate && (
                <span
                  style={{
                    padding: "5px 10px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: "600",
                    backgroundColor: overdue ? "#fee2e2" : "#f3f4f6",
                    color: overdue ? "#b91c1c" : "#4b5563",
                  }}
                >
                  {overdue ? "Overdue" : "Due"}{" "}
                  {new Date(task.dueDate).toLocaleDateString()}
                </span>
              )}
            </div>

            {/* Actions */}
            <div
              style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
                marginTop: "18px",
                paddingTop: "15px",
                borderTop: "1px solid #f0f0f0",
              }}
            >
              <button
                onClick={() => handleComplete(task)}
                style={{
                  border: "none",
                  borderRadius: "7px",
                  padding: "9px 14px",
                  backgroundColor: task.completed ? "#f59e0b" : "#16a34a",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "13px",
                }}
              >
                {task.completed ? "Mark Pending" : "Complete"}
              </button>

              <button
                onClick={() => onEditTask(task)}
                style={{
                  border: "1px solid #d1d5db",
                  borderRadius: "7px",
                  padding: "9px 14px",
                  backgroundColor: "#fff",
                  color: "#374151",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "13px",
                }}
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(task)}
                style={{
                  border: "none",
                  borderRadius: "7px",
                  padding: "9px 14px",
                  backgroundColor: "#dc2626",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "13px",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaskList;
