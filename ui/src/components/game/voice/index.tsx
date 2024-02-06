import { createSignal, createEffect } from "solid-js";
import { Button } from "@suid/material";
import {
  MicOutlined,
  MicOffOutlined,
  LogoutOutlined,
} from "@suid/icons-material";
import AgoraRTC from "agora-rtc-sdk-ng";
import AgoraRTM from "agora-rtm-sdk";
import { isSessionStarter } from "../start_game";

const token = import.meta.env.CO_AGORA_APP_ID;
const rtcUid = Math.floor(Math.random() * 2032);
const rtmUid = String(Math.floor(Math.random() * 2032));

export default function Voice() {
  const [micMuted, setMicMuted] = createSignal(true);

  // Add more state variables and functions as needed

  const toggleMic = () => {
    // Implement logic to toggle microphone on/off here
    // You can use the `setMicMuted` function to update the micMuted state
  };

  const joinVoiceChat = () => {
    // Implement logic to join the voice chat channel here
  };

  const leaveVoiceChat = () => {
    // Implement logic to leave the voice chat channel here
  };

  // You can add more event handlers and functions for voice chat controls

  return (
    <div>
      {/* Voice chat UI goes here */}
      <div>
        <Button onClick={toggleMic}>
          {micMuted() ? <MicOutlined /> : <MicOffOutlined />}
        </Button>
        <Button onClick={joinVoiceChat}>Join Voice Chat</Button>
        <Button onClick={leaveVoiceChat}>Leave Voice Chat</Button>
        {/* Add more buttons and UI elements as needed */}
      </div>
    </div>
  );
}
