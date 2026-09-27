const API_URL = `${import.meta.env.VITE_API_URL}/tasks`;

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
    throw new Error(errorData.message);
  }

  return response.json();
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

  return response.json();
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
    throw new Error(errorData.message);
  }

  return response.json();
};

// Delete a task
export const deleteMyTask = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }

  return true;
};
