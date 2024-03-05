import { createEffect, createResource } from "solid-js";
import { Button } from "@suid/material";

const BASE_API = import.meta.env.CO_API_URL; // Ensure this is correctly set in your .env file

const Failure = () => {
  // Function to fetch user profile
  const fetchUserProfile = async () => {
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

  // Create resource to fetch user profile
  const [userProfile] = createResource(fetchUserProfile);

  return (
    <div class="flex flex-col items-center justify-center ">
      <h1 class="mb-4 text-2xl font-bold">
        Sorry, {userProfile()?.firstName}, the payment failed!
      </h1>
      <img src={userProfile()?.pictureURL} alt="Profile Picture" class="mb-4" />
      <Button variant="contained" color="primary" href={`${BASE_API}/logout`}>
        Logout
      </Button>
      <Button variant="contained" color="secondary" href="/game">
        Play Game
      </Button>
    </div>
  );
};

export default Failure;
