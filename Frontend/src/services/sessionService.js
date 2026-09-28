const API_URL = import.meta.env.VITE_API_URL;

export const checkSession = async () => {
  const response = await fetch(`${API_URL}/session`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();

    const error = new Error(errorData.message || "Session expired");

    error.status = response.status;

    throw error;
  }

  return response.json();
};
