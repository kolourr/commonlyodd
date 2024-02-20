import { Component } from "solid-js";
import { Button } from "@suid/material";

const BASE_API = import.meta.env.CO_API_URL;

const LandingPage: Component = () => {
  const handleLoginRedirect = () => {
    window.location.href = `${BASE_API}/login`;
  };

  return (
    <div class="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 class="mb-4 text-2xl font-bold">Commonly Odd</h1>
      <Button variant="contained" color="primary" onClick={handleLoginRedirect}>
        Login
      </Button>
    </div>
  );
};

export default LandingPage;
