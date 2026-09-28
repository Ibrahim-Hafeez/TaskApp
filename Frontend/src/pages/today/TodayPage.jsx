import { useEffect, useMemo, useState } from "react";
import {
  getMyTasks,
  updateMyTask,
  getCachedTasks,
} from "../../services/taskService";
import styles from "./TodayPage.module.css";

function TodayPage() {
  const cachedTasks = getCachedTasks();

  const [tasks, setTasks] = useState(cachedTasks || []);
  const [loading, setLoading] = useState(!cachedTasks);
  const [error, setError] = useState("");

  const handleComplete = async (task) => {
    try {
      const response = await updateMyTask(task._id, {
        completed: !task.completed,
      });

      setTasks((prevTasks) =>
        prevTasks.map((currentTask) =>
          currentTask._id === task._id ? response.data : currentTask,
        ),
      );
    } catch (err) {
      if (err.status === 401) {
        window.location.href = "/login";
        return;
      }

      alert(err.message || "Failed to update task");
    }
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        if (!cachedTasks) {
          setLoading(true);
        }

        setError("");

        const response = await getMyTasks();

        setTasks(response.data || []);
      } catch (err) {
        if (err.status === 401) {
          window.location.href = "/login";
          return;
        }

        setError(err.message || "Failed to load today's tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const todayStart = useMemo(() => {
    const date = new Date();

    date.setHours(0, 0, 0, 0);

    return date;
  }, []);

  const tomorrowStart = useMemo(() => {
    const date = new Date(todayStart);

    date.setDate(date.getDate() + 1);

    return date;
  }, [todayStart]);

  const todayTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (!task.dueDate) {
        return false;
      }

      const dueDate = new Date(task.dueDate);

      return dueDate >= todayStart && dueDate < tomorrowStart;
    });
  }, [tasks, todayStart, tomorrowStart]);

  const overdueTasks = useMemo(() => {
    const now = new Date();

    return tasks.filter((task) => {
      if (!task.dueDate || task.completed) {
        return false;
      }

      return new Date(task.dueDate) < now;
    });
  }, [tasks]);

  const highPriorityTasks = useMemo(() => {
    return tasks.filter((task) => {
      return task.priority === "high" && !task.completed;
    });
  }, [tasks]);

  const completedToday = useMemo(() => {
    return todayTasks.filter((task) => task.completed);
  }, [todayTasks]);

  const todayProgress =
    todayTasks.length === 0
      ? 0
      : Math.round((completedToday.length / todayTasks.length) * 100);

  const focusTask = useMemo(() => {
    const pendingTodayTask = todayTasks.find((task) => !task.completed);

    if (pendingTodayTask) {
      return pendingTodayTask;
    }

    const pendingHighPriorityTask = highPriorityTasks[0];

    if (pendingHighPriorityTask) {
      return pendingHighPriorityTask;
    }

    return overdueTasks[0] || null;
  }, [todayTasks, highPriorityTasks, overdueTasks]);

  const formattedDate = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const getPriorityLabel = (priority) => {
    if (!priority) {
      return "Medium";
    }

    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  return (
    <div className={styles.page}>
      <main className={styles.mainContent}>
        <div className={styles.container}>
          <header className={styles.header}>
            <div>
              <span className={styles.eyebrow}>TODAY</span>

              <h1>
                Here's your day <span>👋</span>
              </h1>

              <p>{formattedDate}</p>
            </div>
          </header>

          {error && (
            <div className={styles.errorCard}>
              <strong>Something went wrong</strong>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && (
            <>
              <section className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <span className={styles.statIcon}>🔴</span>

                  <div>
                    <span className={styles.statLabel}>Overdue</span>
                    <strong>{overdueTasks.length}</strong>
                  </div>
                </div>

                <div className={styles.statCard}>
                  <span className={styles.statIcon}>🟠</span>

                  <div>
                    <span className={styles.statLabel}>High Priority</span>
                    <strong>{highPriorityTasks.length}</strong>
                  </div>
                </div>

                <div className={styles.statCard}>
                  <span className={styles.statIcon}>✅</span>

                  <div>
                    <span className={styles.statLabel}>Completed Today</span>
                    <strong>{completedToday.length}</strong>
                  </div>
                </div>

                <div className={styles.statCard}>
                  <span className={styles.statIcon}>🎯</span>

                  <div>
                    <span className={styles.statLabel}>Today's Progress</span>
                    <strong>{todayProgress}%</strong>
                  </div>
                </div>
              </section>

              <section className={styles.focusCard}>
                <div className={styles.focusContent}>
                  <span className={styles.focusEyebrow}>FOCUS NOW</span>

                  {focusTask ? (
                    <>
                      <h2>{focusTask.title}</h2>

                      <div className={styles.focusMeta}>
                        <span>
                          {getPriorityLabel(focusTask.priority)} priority
                        </span>

                        {focusTask.dueDate && (
                          <span>
                            Due{" "}
                            {new Date(focusTask.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        className={styles.focusButton}
                        onClick={() => {
                          window.location.href = `/tasks?edit=${focusTask._id}`;
                        }}
                      >
                        Open Task
                      </button>
                    </>
                  ) : (
                    <>
                      <h2>You're all caught up 🎉</h2>

                      <p>
                        There is no urgent task demanding your attention right
                        now.
                      </p>

                      <button
                        type="button"
                        className={styles.focusButton}
                        onClick={() => {
                          window.location.href = "/tasks";
                        }}
                      >
                        View My Tasks
                      </button>
                    </>
                  )}
                </div>

                <div className={styles.focusDecoration}>✦</div>
              </section>

              <section className={styles.progressCard}>
                <div className={styles.progressHeader}>
                  <div>
                    <span className={styles.progressLabel}>
                      Today's Progress
                    </span>

                    <p>
                      {completedToday.length} of {todayTasks.length} task
                      {todayTasks.length !== 1 ? "s" : ""} completed
                    </p>
                  </div>

                  <strong>{todayProgress}%</strong>
                </div>

                <div className={styles.progressTrack}>
                  <div
                    className={styles.progressBar}
                    style={{ width: `${todayProgress}%` }}
                  />
                </div>
              </section>

              <section className={styles.tasksCard}>
                <div className={styles.sectionHeader}>
                  <div>
                    <span className={styles.sectionEyebrow}>YOUR DAY</span>

                    <h2>Today's Tasks</h2>

                    <p>Everything scheduled for today.</p>
                  </div>

                  <span className={styles.taskCount}>{todayTasks.length}</span>
                </div>

                {todayTasks.length === 0 ? (
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>☀️</div>

                    <h3>Your day is open</h3>

                    <p>You don't have any tasks scheduled for today yet.</p>

                    <button
                      type="button"
                      className={styles.secondaryButton}
                      onClick={() => {
                        window.location.href = "/tasks";
                      }}
                    >
                      Add a Task
                    </button>
                  </div>
                ) : (
                  <div className={styles.taskList}>
                    {todayTasks.map((task) => (
                      <div
                        key={task._id}
                        className={`${styles.taskItem} ${
                          task.completed ? styles.completedTask : ""
                        }`}
                      >
                        <button
                          type="button"
                          className={`${styles.taskStatus} ${
                            task.completed
                              ? styles.completedStatus
                              : styles.pendingStatus
                          }`}
                          onClick={() => handleComplete(task)}
                          aria-label={
                            task.completed
                              ? `Mark ${task.title} as pending`
                              : `Complete ${task.title}`
                          }
                        >
                          {task.completed ? "✓" : ""}
                        </button>

                        <div className={styles.taskDetails}>
                          <h3>{task.title}</h3>

                          {task.description && <p>{task.description}</p>}
                        </div>

                        <span className={styles.priorityBadge}>
                          {getPriorityLabel(task.priority)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default TodayPage;
