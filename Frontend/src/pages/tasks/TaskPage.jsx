import { useEffect, useRef, useState } from "react";
import TaskForm from "../../components/tasks/TaskForm";
import TaskList from "../../components/tasks/TaskList";
import Sidebar from "../../components/layout/Sidebar";
import { getMyTasks } from "../../services/taskService";
import { logoutUser } from "../../services/logoutService";
import { checkSession } from "../../services/sessionService";
import styles from "./TaskPage.module.css";

function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingTask, setEditingTask] = useState(null);

  const formSectionRef = useRef(null);
  const hasLoadedTasksRef = useRef(false);

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

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter((task) => task.completed).length;

  const pendingTasks = tasks.filter((task) => !task.completed).length;

  const completionRate =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className={styles.dashboard}>
      <Sidebar onLogout={handleLogout} />

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
          <div ref={formSectionRef} className={styles.card}>
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
