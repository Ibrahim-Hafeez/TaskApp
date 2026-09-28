import { deleteMyTask, updateMyTask } from "../../services/taskService";
import styles from "./TaskList.module.css";

const TaskList = ({ tasks, onTaskUpdated, onTaskDeleted, onEditTask }) => {
  if (tasks.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyTitle}>No tasks found.</p>

        <p className={styles.emptyDescription}>
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
      if (err.status === 401) {
        window.location.href = "/login";
        return;
      }

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
      if (err.status === 401) {
        window.location.href = "/login";
        return;
      }

      alert(err.message || "Failed to delete task");
    }
  };

  const getPriorityClass = (priority) => {
    if (priority === "high") {
      return styles.highPriority;
    }

    if (priority === "low") {
      return styles.lowPriority;
    }

    return styles.mediumPriority;
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

        return (
          <div
            key={task._id}
            className={`
              ${styles.taskCard}
              ${task.completed ? styles.completedCard : ""}
              ${overdue ? styles.overdueCard : ""}
            `}
          >
            {/* Top section */}
            <div className={styles.topSection}>
              <div className={styles.taskContent}>
                <h3
                  className={`
                    ${styles.taskTitle}
                    ${task.completed ? styles.completedTitle : ""}
                  `}
                >
                  {task.title}
                </h3>

                {task.description && (
                  <p className={styles.description}>{task.description}</p>
                )}
              </div>

              {/* Status */}
              <span
                className={`
                  ${styles.status}
                  ${
                    task.completed
                      ? styles.completedStatus
                      : styles.pendingStatus
                  }
                `}
              >
                {task.completed ? "Completed" : "Pending"}
              </span>
            </div>

            {/* Task information */}
            <div className={styles.taskInfo}>
              {/* Priority */}
              <span
                className={`${styles.priority} ${getPriorityClass(
                  task.priority,
                )}`}
              >
                {getPriorityLabel(task.priority)} Priority
              </span>

              {/* Due date */}
              {task.dueDate && (
                <span
                  className={`${styles.dueDate} ${
                    overdue ? styles.overdueDate : ""
                  }`}
                >
                  {overdue ? "Overdue" : "Due"}{" "}
                  {new Date(task.dueDate).toLocaleDateString()}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className={styles.actions}>
              <button
                onClick={() => handleComplete(task)}
                className={`${styles.actionButton} ${
                  task.completed ? styles.pendingButton : styles.completeButton
                }`}
              >
                {task.completed ? "Mark Pending" : "Complete"}
              </button>

              <button
                onClick={() => onEditTask(task)}
                className={`${styles.actionButton} ${styles.editButton}`}
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(task)}
                className={`${styles.actionButton} ${styles.deleteButton}`}
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
