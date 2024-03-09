const BASE_API = import.meta.env.CO_API_URL;

// Function to fetch user profile
export const fetchUserProfile = async () => {
  const response = await fetch(`${BASE_API}/user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (response.status === 401) {
    window.location.href = "/";
    return;
  }

  if (!response.ok) {
    throw new Error("Failed to fetch user profile");
  }

  return await response.json();
};
