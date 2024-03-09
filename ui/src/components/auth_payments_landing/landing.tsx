import { Component } from "solid-js";
import { Button } from "@suid/material";

const BASE_API = import.meta.env.CO_API_URL; // Ensure this is correctly set in your .env file

const LandingPage: Component = () => {
  console.info("BASE_API", BASE_API);

  return (
    <div class="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 class="mb-4 text-2xl font-bold">Commonly Odd</h1>
      <Button
        component="a"
        href={`${BASE_API}/login`}
        variant="contained"
        color="primary"
      >
        Login
      </Button>
    </div>
  );
};

export default LandingPage;
