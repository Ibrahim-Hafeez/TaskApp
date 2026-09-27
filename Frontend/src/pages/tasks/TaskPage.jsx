import { useEffect, useMemo, useState } from "react";
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
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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

  const statistics = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    const pending = tasks.filter((task) => !task.completed).length;

    const overdue = tasks.filter((task) => {
      if (!task.dueDate || task.completed) {
        return false;
      }

      return new Date(task.dueDate) < new Date();
    }).length;

    return {
      total,
      completed,
      pending,
      overdue,
    };
  }, [tasks]);

  return (
    <div className={styles.appShell}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.brandIcon}>T</div>

          <div>
            <div className={styles.brandName}>TaskApp</div>
            <div className={styles.brandSubtitle}>Productivity</div>
          </div>
        </div>

        <nav className={styles.navigation}>
          <div className={styles.navigationLabel}>WORKSPACE</div>

          <div className={`${styles.navItem} ${styles.navItemActive}`}>
            <span className={styles.navIcon}>✓</span>
            <span>My Tasks</span>
          </div>
        </nav>

        <div className={styles.sidebarBottom}>
          <div className={styles.sidebarDivider} />

          <button
            type="button"
            onClick={handleLogout}
            className={styles.sidebarLogout}
          >
            <span className={styles.navIcon}>↪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main workspace */}
      <main className={styles.workspace}>
        <div className={styles.workspaceInner}>
          {/* Header */}
          <header className={styles.pageHeader}>
            <div>
              <div className={styles.eyebrow}>YOUR WORKSPACE</div>

              <h1>My Tasks</h1>

              <p>Organize your work and stay focused on what matters.</p>
            </div>

            <div className={styles.headerActions}>
              <div className={styles.profile}>
                <div className={styles.profileAvatar}>U</div>

                <div className={styles.profileInfo}>
                  <span className={styles.profileName}>Workspace</span>

                  <span className={styles.profileRole}>Personal tasks</span>
                </div>
              </div>
            </div>
          </header>

          {/* Statistics */}
          <section className={styles.statsGrid}>
            <div className={`${styles.statCard} ${styles.totalStat}`}>
              <div className={styles.statTop}>
                <span className={styles.statLabel}>Total Tasks</span>

                <span className={styles.statIcon}>◈</span>
              </div>

              <div className={styles.statValue}>{statistics.total}</div>

              <div className={styles.statDescription}>
                Tasks currently visible
              </div>
            </div>

            <div className={`${styles.statCard} ${styles.pendingStat}`}>
              <div className={styles.statTop}>
                <span className={styles.statLabel}>Pending</span>

                <span className={styles.statIcon}>○</span>
              </div>

              <div className={styles.statValue}>{statistics.pending}</div>

              <div className={styles.statDescription}>
                Tasks waiting for action
              </div>
            </div>

            <div className={`${styles.statCard} ${styles.completedStat}`}>
              <div className={styles.statTop}>
                <span className={styles.statLabel}>Completed</span>

                <span className={styles.statIcon}>✓</span>
              </div>

              <div className={styles.statValue}>{statistics.completed}</div>

              <div className={styles.statDescription}>Finished tasks</div>
            </div>

            <div className={`${styles.statCard} ${styles.overdueStat}`}>
              <div className={styles.statTop}>
                <span className={styles.statLabel}>Overdue</span>

                <span className={styles.statIcon}>!</span>
              </div>

              <div className={styles.statValue}>{statistics.overdue}</div>

              <div className={styles.statDescription}>Need your attention</div>
            </div>
          </section>

          {/* Task creation */}
          <section className={styles.mainCard}>
            <div className={styles.sectionHeader}>
              <div>
                <div className={styles.sectionEyebrow}>
                  {editingTask ? "EDIT TASK" : "CREATE TASK"}
                </div>

                <h2>{editingTask ? "Edit your task" : "Add a new task"}</h2>

                <p>
                  {editingTask
                    ? "Update the details of your task."
                    : "Capture something you need to get done."}
                </p>
              </div>

              <div className={styles.sectionBadge}>
                {editingTask ? "Editing" : "New"}
              </div>
            </div>

            <div className={styles.formArea}>
              <TaskForm
                onTaskCreated={handleTaskCreated}
                editingTask={editingTask}
                onTaskUpdated={handleTaskUpdated}
                onCancelEdit={() => setEditingTask(null)}
              />
            </div>
          </section>

          {/* Filters */}
          <section className={styles.filterCard}>
            <div className={styles.filterHeader}>
              <div>
                <h2>Filter tasks</h2>
                <p>Quickly narrow down your workspace.</p>
              </div>

              {(filters.completed || filters.priority || filters.overdue) && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className={styles.clearButton}
                >
                  Clear filters
                </button>
              )}
            </div>

            <div className={styles.filterControls}>
              <div className={styles.filterControl}>
                <label htmlFor="completedFilter">Status</label>

                <select
                  id="completedFilter"
                  name="completed"
                  value={filters.completed}
                  onChange={handleFilterChange}
                >
                  <option value="">All tasks</option>
                  <option value="false">Pending</option>
                  <option value="true">Completed</option>
                </select>
              </div>

              <div className={styles.filterControl}>
                <label htmlFor="priorityFilter">Priority</label>

                <select
                  id="priorityFilter"
                  name="priority"
                  value={filters.priority}
                  onChange={handleFilterChange}
                >
                  <option value="">All priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <label htmlFor="overdueFilter" className={styles.overdueToggle}>
                <input
                  id="overdueFilter"
                  name="overdue"
                  type="checkbox"
                  checked={filters.overdue}
                  onChange={handleFilterChange}
                />

                <span className={styles.customCheckbox}>
                  {filters.overdue ? "✓" : ""}
                </span>

                <span>Show overdue only</span>
              </label>
            </div>
          </section>

          {/* Task list */}
          <section className={styles.taskSection}>
            <div className={styles.taskSectionHeader}>
              <div>
                <div className={styles.sectionEyebrow}>TASK MANAGEMENT</div>

                <h2>Your Tasks</h2>

                <p>
                  {statistics.total === 0
                    ? "Your workspace is clear."
                    : `You have ${statistics.total} task${
                        statistics.total !== 1 ? "s" : ""
                      } in this view.`}
                </p>
              </div>

              <div className={styles.taskCount}>{statistics.total}</div>
            </div>

            {loading && (
              <div className={styles.loadingState}>
                <div className={styles.loadingSpinner} />
                <span>Loading your tasks...</span>
              </div>
            )}

            {error && <div className={styles.errorState}>{error}</div>}

            {!loading && !error && (
              <TaskList
                tasks={tasks}
                onTaskUpdated={handleTaskUpdated}
                onTaskDeleted={handleTaskDeleted}
                onEditTask={handleEditTask}
              />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default TaskPage;
