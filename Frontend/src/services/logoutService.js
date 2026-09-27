const API_URL = import.meta.env.VITE_API_URL;

export const logoutUser = async () => {
  const response = await fetch(`${API_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });

  const text = await response.text();

  let data;

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(
      `Logout request failed. Server returned HTTP ${response.status}.`,
    );
  }

  if (!response.ok) {
    throw new Error(data.message || "Logout failed");
  }

  return data;
};
