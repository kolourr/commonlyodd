import { Button } from "@suid/material";
import { sendMessage } from "../start_game";
import { useNavigate } from "solid-app-router";

const dialogTextStyle = {
  color: "#f9fafb",
};

export default function EndSessionDemo() {
  //   const navigate = useNavigate();

  async function endSession() {
    try {
      sendMessage({ game_state: "end" });
      // Remove session UUID and starter token in local storage
      localStorage.removeItem("session_uuid_demo");
      localStorage.removeItem("starter_token_demo");
      localStorage.removeItem("type_demo");
      localStorage.removeItem("total_score_demo");

      // // Navigate to the base URL
      // navigate("/");

      // Refresh the page after a short delay to ensure navigation is complete
      setTimeout(() => {
        location.reload();
      }, 1000); // Adjust the delay as needed
    } catch (error) {
      console.error("Failed to end session:", error);
    } finally {
    }
  }

  return (
    <div>
      <Button
        variant="contained"
        color="action"
        onClick={endSession}
        sx={{
          width: "200px",
          fontSize: "18px",
          fontWeight: "bold",
          color: "#64748b",
          backgroundColor: "transparent",
        }}
      >
        Reset Demo
      </Button>
    </div>
  );
}
