import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  getCachedTasks,
  getMyTasks,
  updateMyTask,
} from "../../services/taskService";
import styles from "./FocusPage.module.css";

const FOCUS_DURATION = 25 * 60;

function FocusPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const taskId = searchParams.get("task");

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  const [remainingSeconds, setRemainingSeconds] = useState(FOCUS_DURATION);

  const [isRunning, setIsRunning] = useState(false);
  const [sessionFinished, setSessionFinished] = useState(false);
  const [completing, setCompleting] = useState(false);

  const endTimeRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const loadTask = async () => {
      const cachedTasks = getCachedTasks();

      if (cachedTasks) {
        const cachedTask = cachedTasks.find(
          (currentTask) => currentTask._id === taskId,
        );

        if (cachedTask) {
          setTask(cachedTask);
          setLoading(false);
          return;
        }
      }

      try {
        const response = await getMyTasks();

        const foundTask = (response.data || []).find(
          (currentTask) => currentTask._id === taskId,
        );

        setTask(foundTask || null);
      } catch (err) {
        if (err.status === 401) {
          window.location.href = "/login";
          return;
        }
      } finally {
        setLoading(false);
      }
    };

    if (taskId) {
      loadTask();
    } else {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const updateTimer = () => {
    if (!endTimeRef.current) return;

    const secondsLeft = Math.max(
      0,
      Math.ceil((endTimeRef.current - Date.now()) / 1000),
    );

    setRemainingSeconds(secondsLeft);

    if (secondsLeft <= 0) {
      setIsRunning(false);
      setSessionFinished(true);
      endTimeRef.current = null;

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  const handleStartPause = () => {
    if (sessionFinished) return;

    if (isRunning) {
      updateTimer();

      if (endTimeRef.current) {
        const secondsLeft = Math.max(
          0,
          Math.ceil((endTimeRef.current - Date.now()) / 1000),
        );

        setRemainingSeconds(secondsLeft);
      }

      endTimeRef.current = null;

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      setIsRunning(false);
      return;
    }

    if (remainingSeconds <= 0) {
      return;
    }

    endTimeRef.current = Date.now() + remainingSeconds * 1000;

    setIsRunning(true);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(updateTimer, 250);
  };

  const handleReset = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    endTimeRef.current = null;

    setRemainingSeconds(FOCUS_DURATION);
    setIsRunning(false);
    setSessionFinished(false);
  };

  const handleComplete = async () => {
    if (!task || completing) return;

    try {
      setCompleting(true);

      const response = await updateMyTask(task._id, {
        completed: true,
      });

      setTask(response.data);

      navigate("/today");
    } catch (err) {
      if (err.status === 401) {
        window.location.href = "/login";
        return;
      }

      alert(err.message || "Failed to complete task");
    } finally {
      setCompleting(false);
    }
  };

  const handleExit = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    endTimeRef.current = null;

    navigate("/today");
  };

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  const formattedTime = `${String(minutes).padStart(
    2,
    "0",
  )}:${String(seconds).padStart(2, "0")}`;

  if (loading) {
    return null;
  }

  if (!task) {
    return (
      <div className={styles.page}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🎯</div>

          <h1>No focus task selected</h1>

          <p>Choose a task from Today and start a focused work session.</p>

          <button
            type="button"
            onClick={() => navigate("/today")}
            className={styles.backButton}
          >
            Back to Today
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.focusContainer}>
        <button
          type="button"
          className={styles.exitButton}
          onClick={handleExit}
        >
          ← Exit Focus
        </button>

        <div className={styles.focusContent}>
          <span className={styles.label}>
            {sessionFinished ? "SESSION COMPLETE" : "FOCUS SESSION"}
          </span>

          <h1>{task.title}</h1>

          {task.description && (
            <p className={styles.description}>{task.description}</p>
          )}

          <div className={styles.meta}>
            <span>
              {task.priority
                ? `${task.priority
                    .charAt(0)
                    .toUpperCase()}${task.priority.slice(1)} priority`
                : "Medium priority"}
            </span>

            {task.dueDate && (
              <span>
                Due {new Date(task.dueDate).toLocaleDateString("en-IN")}
              </span>
            )}
          </div>

          <div
            className={`${styles.timer} ${
              isRunning ? styles.timerRunning : ""
            } ${sessionFinished ? styles.timerFinished : ""}`}
          >
            <span>{formattedTime}</span>
          </div>

          <p className={styles.timerHint}>
            {sessionFinished
              ? "Nice work. Your focus session is complete."
              : isRunning
                ? "Stay with this task until the timer ends."
                : "One task. One session. Full focus."}
          </p>

          {!sessionFinished && (
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.startButton}
                onClick={handleStartPause}
              >
                {isRunning
                  ? "Pause"
                  : remainingSeconds === FOCUS_DURATION
                    ? "Start Focus"
                    : "Resume"}
              </button>

              <button
                type="button"
                className={styles.resetButton}
                onClick={handleReset}
              >
                Reset
              </button>
            </div>
          )}

          <button
            type="button"
            className={styles.completeButton}
            onClick={handleComplete}
            disabled={completing || task.completed}
          >
            {completing
              ? "Completing..."
              : task.completed
                ? "Task Completed"
                : "Mark Task Complete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default FocusPage;
