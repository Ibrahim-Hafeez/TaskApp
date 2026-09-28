const API_URL = `${import.meta.env.VITE_API_URL}/tasks`;

let tasksCache = null;

try {
  const storedTasks = sessionStorage.getItem("taskapp_tasks");

  if (storedTasks) {
    tasksCache = JSON.parse(storedTasks);
  }
} catch {
  tasksCache = null;
}

// Create a new task
export const createTask = async (data) => {
  const response = await fetch(API_URL, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();

    const error = new Error(errorData.message || "Failed to create task");

    error.status = response.status;

    throw error;
  }

  const result = await response.json();

  try {
    const currentTasks = tasksCache || [];
    const newTask = result.data;

    if (newTask) {
      tasksCache = [...currentTasks, newTask];

      sessionStorage.setItem("taskapp_tasks", JSON.stringify(tasksCache));
    }
  } catch {
    // Ignore storage failures
  }

  return result;
};

// Get all tasks
export const getMyTasks = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.completed !== "" && filters.completed !== undefined) {
    params.append("completed", filters.completed);
  }

  if (filters.priority) {
    params.append("priority", filters.priority);
  }

  if (filters.dueBefore) {
    params.append("dueBefore", filters.dueBefore);
  }

  if (filters.dueAfter) {
    params.append("dueAfter", filters.dueAfter);
  }

  if (filters.overdue) {
    params.append("overdue", "true");
  }

  const queryString = params.toString();

  const response = await fetch(
    `${API_URL}${queryString ? `?${queryString}` : ""}`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (!response.ok) {
    const errorData = await response.json();

    const error = new Error(errorData.message || "Failed to fetch tasks");

    error.status = response.status;

    throw error;
  }

  const data = await response.json();

  const hasFilters =
    (filters.completed !== "" && filters.completed !== undefined) ||
    filters.priority ||
    filters.dueBefore ||
    filters.dueAfter ||
    filters.overdue;

  if (!hasFilters) {
    tasksCache = data.data || [];

    try {
      sessionStorage.setItem("taskapp_tasks", JSON.stringify(tasksCache));
    } catch {
      // Ignore storage failures
    }
  }

  return data;
};

export const getCachedTasks = () => {
  return tasksCache;
};

// Get one task
export const getMyTask = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }

  return response.json();
};

// Update a task
export const updateMyTask = async (id, data) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();

    const error = new Error(errorData.message || "Failed to update task");

    error.status = response.status;

    throw error;
  }

  const result = await response.json();

  try {
    const updatedTask = result.data;

    if (updatedTask && tasksCache) {
      tasksCache = tasksCache.map((task) =>
        task._id === updatedTask._id ? updatedTask : task,
      );

      sessionStorage.setItem("taskapp_tasks", JSON.stringify(tasksCache));
    }
  } catch {
    // Ignore storage failures
  }

  return result;
};

// Delete a task
export const deleteMyTask = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();

    const error = new Error(errorData.message || "Failed to delete task");

    error.status = response.status;

    throw error;
  }

  try {
    if (tasksCache) {
      tasksCache = tasksCache.filter((task) => task._id !== id);

      sessionStorage.setItem("taskapp_tasks", JSON.stringify(tasksCache));
    }
  } catch {
    // Ignore storage failures
  }

  return true;
};

export const clearTaskCache = () => {
  tasksCache = null;

  try {
    sessionStorage.removeItem("taskapp_tasks");
  } catch {
    // Ignore storage failures
  }
};
