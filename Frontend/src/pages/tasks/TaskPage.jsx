import { useEffect, useRef, useState } from "react";
import TaskForm from "../../components/tasks/TaskForm";
import TaskList from "../../components/tasks/TaskList";
import {
  getMyTasks,
  getCachedTasks,
  clearTaskCache,
} from "../../services/taskService";
import { logoutUser } from "../../services/logoutService";
import { checkSession } from "../../services/sessionService";
import styles from "./TaskPage.module.css";
import FilterDropdown from "../../components/common/FilterDropdown";

function TaskPage() {
  const cachedTasks = getCachedTasks();

  const [tasks, setTasks] = useState(cachedTasks || []);
  const [loading, setLoading] = useState(!cachedTasks);
  const [error, setError] = useState("");
  const [editingTask, setEditingTask] = useState(null);

  const formSectionRef = useRef(null);
  const hasLoadedTasksRef = useRef(Boolean(cachedTasks));

  const [filters, setFilters] = useState({
    completed: "",
    priority: "",
    overdue: false,
  });

  const handleLogout = async () => {
    try {
      await logoutUser();
      clearTaskCache();
      window.location.href = "/login";
    } catch (err) {
      alert(err.message || "Logout failed");
    }
  };

  const fetchTasks = async () => {
    try {
      if (!hasLoadedTasksRef.current) {
        setLoading(true);
      }

      setError("");

      const response = await getMyTasks(filters);

      setTasks(response.data || []);

      hasLoadedTasksRef.current = true;
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

  useEffect(() => {
    if (editingTask && formSectionRef.current) {
      const element = formSectionRef.current;

      const elementTop = element.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: elementTop - 24,
        behavior: "smooth",
      });
    }
  }, [editingTask]);

  useEffect(() => {
    const handleSessionCheck = async () => {
      try {
        await checkSession();
      } catch (err) {
        if (err.status === 401) {
          window.location.href = "/login";
        }
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        handleSessionCheck();
      }
    };

    const handleWindowFocus = () => {
      handleSessionCheck();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    window.addEventListener("focus", handleWindowFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      window.removeEventListener("focus", handleWindowFocus);
    };
  }, []);

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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const taskId = params.get("edit");

    if (!taskId || tasks.length === 0) {
      return;
    }

    const taskToEdit = tasks.find((task) => task._id === taskId);

    if (taskToEdit) {
      setEditingTask(taskToEdit);

      params.delete("edit");

      const newUrl = `${window.location.pathname}${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      window.history.replaceState({}, "", newUrl);
    }
  }, [tasks]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFilters((prevFilters) => {
      const nextValue = type === "checkbox" ? checked : value;

      const nextFilters = {
        ...prevFilters,
        [name]: nextValue,
      };

      // Completed and Overdue cannot be active together.
      if (name === "completed" && value === "true") {
        nextFilters.overdue = false;
      }

      if (name === "overdue" && checked) {
        nextFilters.completed = "false";
      }

      return nextFilters;
    });
  };

  const clearFilters = () => {
    setFilters({
      completed: "",
      priority: "",
      overdue: false,
    });
  };

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter((task) => task.completed).length;

  const pendingTasks = tasks.filter((task) => !task.completed).length;

  const completionRate =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className={styles.dashboard}>
      <main className={styles.mainContent}>
        <div className={styles.container}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerContent}>
              <span className={styles.eyebrow}>WORKSPACE</span>

              <h1>My Tasks</h1>

              <p>Manage your tasks and stay organized.</p>
            </div>
          </div>

          {/* Statistics */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>▦</div>

              <div>
                <span className={styles.statLabel}>Total Tasks</span>
                <strong className={styles.statValue}>{totalTasks}</strong>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={`${styles.statIcon} ${styles.pendingIcon}`}>
                ◷
              </div>

              <div>
                <span className={styles.statLabel}>Pending</span>
                <strong className={styles.statValue}>{pendingTasks}</strong>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={`${styles.statIcon} ${styles.completedIcon}`}>
                ✓
              </div>

              <div>
                <span className={styles.statLabel}>Completed</span>
                <strong className={styles.statValue}>{completedTasks}</strong>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={`${styles.statIcon} ${styles.progressIcon}`}>
                %
              </div>

              <div>
                <span className={styles.statLabel}>Completion Rate</span>

                <strong className={styles.statValue}>{completionRate}%</strong>
              </div>
            </div>
          </div>

          <div className={styles.progressCard}>
            <div className={styles.progressHeader}>
              <div>
                <span className={styles.progressLabel}>Task Progress</span>

                <p className={styles.progressText}>
                  {completedTasks} of {totalTasks} task
                  {totalTasks !== 1 ? "s" : ""} completed
                </p>
              </div>

              <strong className={styles.progressPercentage}>
                {completionRate}%
              </strong>
            </div>

            <div className={styles.progressTrack}>
              <div
                className={styles.progressBar}
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>

          {/* Task Form */}
          <div
            ref={formSectionRef}
            className={`${styles.card} ${styles.taskFormCard}`}
          >
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
          <div className={`${styles.card} ${styles.filterCard}`}>
            <h2 className={styles.cardTitle}>Filters</h2>

            <div className={styles.filterRow}>
              <FilterDropdown
                label="Status:"
                value={filters.completed}
                options={[
                  { value: "", label: "All" },
                  { value: "false", label: "Pending" },
                  { value: "true", label: "Completed" },
                ]}
                onChange={(value) =>
                  setFilters((prevFilters) => ({
                    ...prevFilters,
                    completed: value,
                    overdue: value === "true" ? false : prevFilters.overdue,
                  }))
                }
              />

              <FilterDropdown
                label="Priority:"
                value={filters.priority}
                options={[
                  { value: "", label: "All" },
                  { value: "low", label: "Low" },
                  { value: "medium", label: "Medium" },
                  { value: "high", label: "High" },
                ]}
                onChange={(value) =>
                  setFilters((prevFilters) => ({
                    ...prevFilters,
                    priority: value,
                  }))
                }
              />

              <button
                type="button"
                className={`${styles.overdueToggle} ${
                  filters.overdue ? styles.overdueToggleActive : ""
                }`}
                onClick={() =>
                  setFilters((prevFilters) => {
                    const overdue = !prevFilters.overdue;

                    return {
                      ...prevFilters,
                      overdue,
                      completed: overdue ? "false" : prevFilters.completed,
                    };
                  })
                }
                aria-pressed={filters.overdue}
              >
                <span className={styles.overdueIndicator}>
                  {filters.overdue ? "✓" : ""}
                </span>

                <span>Overdue</span>
              </button>

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
              <div>
                <h2 className={styles.taskListTitle}>Your Tasks</h2>

                <p className={styles.taskListSubtitle}>
                  Keep track of everything you need to get done.
                </p>
              </div>

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
      </main>
    </div>
  );
}

export default TaskPage;
