const API_URL = `${import.meta.env.VITE_API_URL}/reset-password`;

export const submitResetPassword = async (data) => {
  const response = await fetch(API_URL, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || "Password reset failed");
  }

  return responseData;
};
