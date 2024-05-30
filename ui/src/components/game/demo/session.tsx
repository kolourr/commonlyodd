import { Button, Slide } from "@suid/material";
import { TransitionProps } from "@suid/material/transitions";
import { sendMessage } from "./start";
import { PlayButtonSVG } from "..";
import { Show, createSignal } from "solid-js";
import { PlayButtonSVGDEMO } from ".";

const Transition = (props: TransitionProps & { children: any }) => (
  <Slide direction="down" {...props} />
);

const dialogTextStyle = {
  color: "#f9fafb",
};

export const [isSessionActiveDemo, setIsSessionActiveDemo] = createSignal(
  isSessionStartedDemo()
);

function isSessionStartedDemo() {
  const sessionUuid = localStorage.getItem("session_uuid_demo");
  if (sessionUuid) return true;
}

export default function StartSessionDemo() {
  const numberOfTeams = 1;
  const targetScore = 10;
  const countdownTimer = 7;

  async function startSession() {
    try {
      const response = await fetch(
        `${import.meta.env.CO_API_URL}/start-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            number_of_teams: numberOfTeams,
            target_score: targetScore,
            countdown: countdownTimer,
            category: "random",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      // Set session UUID and starter token in local storage
      localStorage.setItem("session_uuid_demo", data.session_uuid);
      localStorage.setItem("starter_token_demo", data.starter_token);
      localStorage.setItem("type_demo", "demo");

      sendMessage({ game_state: "start-solo" });
      setIsSessionActiveDemo(true);
    } catch (error) {
      console.error("Failed to start session:", error);
    } finally {
    }
  }

  return (
    <div>
      <Button variant="outlined" onClick={startSession} style="border: none;  ">
        <PlayButtonSVGDEMO />
      </Button>
      <div class="text-center font-bold  ">
        <div class="text-center font-bold text-base lg:text-lg text-gray-300  ">
          Play Demo
        </div>
      </div>
    </div>
  );
}
