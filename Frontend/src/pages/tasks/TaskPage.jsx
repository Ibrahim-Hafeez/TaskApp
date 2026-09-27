import { useEffect, useState } from "react";
import TaskForm from "../../components/tasks/TaskForm";
import TaskList from "../../components/tasks/TaskList";
import { getMyTasks } from "../../services/taskService";
import { logoutUser } from "../../services/logoutService";
import styles from "./TaskPage.module.css";

function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingTask, setEditingTask] = useState(null);

  const [filters, setFilters] = useState({
    completed: "",
    priority: "",
    overdue: false,
  });

  const handleLogout = async () => {
    try {
      await logoutUser();
      window.location.href = "/login";
    } catch (err) {
      alert(err.message || "Logout failed");
    }
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMyTasks(filters);

      setTasks(response.data || []);
    } catch (err) {
      if (err.status === 401) {
        window.location.href = "/login";
        return;
      }

      setError(err.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const handleTaskCreated = (newTask) => {
    setTasks((prevTasks) => [newTask, ...prevTasks]);
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === updatedTask._id ? updatedTask : task,
      ),
    );
  };

  const handleTaskDeleted = (deletedTaskId) => {
    setTasks((prevTasks) =>
      prevTasks.filter((task) => task._id !== deletedTaskId),
    );
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      completed: "",
      priority: "",
      overdue: false,
    });
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1>My Tasks</h1>

            <p>Manage your tasks and stay organized.</p>
          </div>

          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>

        {/* Task Form */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            {editingTask ? "Edit Task" : "Add a New Task"}
          </h2>

          <TaskForm
            onTaskCreated={handleTaskCreated}
            editingTask={editingTask}
            onTaskUpdated={handleTaskUpdated}
            onCancelEdit={() => setEditingTask(null)}
          />
        </div>

        {/* Filters */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Filters</h2>

          <div className={styles.filterRow}>
            <div className={styles.filterGroup}>
              <label htmlFor="completedFilter">
                <strong>Status:</strong>
              </label>

              <select
                id="completedFilter"
                name="completed"
                value={filters.completed}
                onChange={handleFilterChange}
                className={styles.filterSelect}
              >
                <option value="">All</option>
                <option value="false">Pending</option>
                <option value="true">Completed</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label htmlFor="priorityFilter">
                <strong>Priority:</strong>
              </label>

              <select
                id="priorityFilter"
                name="priority"
                value={filters.priority}
                onChange={handleFilterChange}
                className={styles.filterSelect}
              >
                <option value="">All</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <label htmlFor="overdueFilter" className={styles.overdueLabel}>
              <input
                id="overdueFilter"
                name="overdue"
                type="checkbox"
                checked={filters.overdue}
                onChange={handleFilterChange}
              />

              <strong>Overdue</strong>
            </label>

            <button
              type="button"
              onClick={clearFilters}
              className={styles.clearButton}
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Task List */}
        <div className={styles.card}>
          <div className={styles.taskListHeader}>
            <h2 className={styles.taskListTitle}>Your Tasks</h2>

            <span className={styles.taskCount}>
              {tasks.length} task{tasks.length !== 1 ? "s" : ""}
            </span>
          </div>

          {loading && <p className={styles.loading}>Loading tasks...</p>}

          {error && <p className={styles.error}>{error}</p>}

          {!loading && !error && (
            <TaskList
              tasks={tasks}
              onTaskUpdated={handleTaskUpdated}
              onTaskDeleted={handleTaskDeleted}
              onEditTask={handleEditTask}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskPage;
