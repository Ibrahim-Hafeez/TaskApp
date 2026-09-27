import { useEffect, useState } from "react";
import TaskForm from "../../components/tasks/TaskForm";
import TaskList from "../../components/tasks/TaskList";
import { getMyTasks } from "../../services/taskService";
import { logoutUser } from "../../services/logoutService";

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
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f4f6f8",
        padding: "30px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "32px",
                color: "#111827",
              }}
            >
              My Tasks
            </h1>

            <p
              style={{
                marginTop: "8px",
                marginBottom: 0,
                color: "#6b7280",
              }}
            >
              Manage your tasks and stay organized.
            </p>
          </div>

          <button
            onClick={handleLogout}
            style={{
              border: "none",
              borderRadius: "8px",
              padding: "10px 18px",
              backgroundColor: "#dc2626",
              color: "#fff",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Logout
          </button>
        </div>

        {/* Task Form */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            padding: "24px",
            marginBottom: "25px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              color: "#111827",
            }}
          >
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
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "25px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              color: "#111827",
            }}
          >
            Filters
          </h2>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <label htmlFor="completedFilter">
                <strong>Status:</strong>
              </label>

              <select
                id="completedFilter"
                name="completed"
                value={filters.completed}
                onChange={handleFilterChange}
                style={{
                  marginLeft: "8px",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #d1d5db",
                }}
              >
                <option value="">All</option>
                <option value="false">Pending</option>
                <option value="true">Completed</option>
              </select>
            </div>

            <div>
              <label htmlFor="priorityFilter">
                <strong>Priority:</strong>
              </label>

              <select
                id="priorityFilter"
                name="priority"
                value={filters.priority}
                onChange={handleFilterChange}
                style={{
                  marginLeft: "8px",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #d1d5db",
                }}
              >
                <option value="">All</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <label
              htmlFor="overdueFilter"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
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
              style={{
                padding: "8px 14px",
                borderRadius: "6px",
                border: "1px solid #d1d5db",
                backgroundColor: "#fff",
                cursor: "pointer",
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Task List */}
        <div
          style={{
            backgroundColor: "#fff",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h2
              style={{
                margin: 0,
                color: "#111827",
              }}
            >
              Your Tasks
            </h2>

            <span
              style={{
                color: "#6b7280",
                fontSize: "14px",
              }}
            >
              {tasks.length} task{tasks.length !== 1 ? "s" : ""}
            </span>
          </div>

          {loading && (
            <p
              style={{
                color: "#6b7280",
              }}
            >
              Loading tasks...
            </p>
          )}

          {error && (
            <p
              style={{
                color: "#dc2626",
                backgroundColor: "#fee2e2",
                padding: "12px",
                borderRadius: "8px",
              }}
            >
              {error}
            </p>
          )}

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
