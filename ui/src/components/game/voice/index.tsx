import { createSignal, createEffect, onMount, onCleanup, Show } from "solid-js";
import { Button } from "@suid/material";
import "./styles.css";
import {
  MicOutlined,
  MicOffOutlined,
  LogoutOutlined,
  LoginOutlined,
  HeadsetMicOutlined,
  HeadsetOffOutlined,
} from "@suid/icons-material";
import AgoraRTC, { IMicrophoneAudioTrack } from "agora-rtc-sdk-ng";
import AgoraRTM from "agora-rtm-sdk";

// Audio tracks forlocal and remote users
let audioTracks = {
  localAudioTrack: null as null | IMicrophoneAudioTrack,
  remoteAudioTracks: {},
};

export default function Voice() {
  const [micMuted, setMicMuted] = createSignal(true);
  const [isSessionStarter, setIsSessionStarter] = createSignal(false);
  const [nonSessionStarter, setNonSessionStarter] = createSignal(false);
  const [roomId, setRoomId] = createSignal("");
  const [isInChat, setIsInChat] = createSignal(false);
  const appid = import.meta.env.CO_AGORA_APP_ID;
  const token = null;
  // Agora clients and channel
  let rtcClient: any;
  //Unique identifier for the users entering the voice chat
  const rtcUid = Math.floor(Math.random() * 2032);
  const rtmUid = String(Math.floor(Math.random() * 2032));

  //Check if user is session starter or not
  const checkUserstatus = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionUuid =
      urlParams.get("session") || localStorage.getItem("session_uuid");
    const starterToken = localStorage.getItem("starter_token");

    if (sessionUuid && starterToken) {
      setIsSessionStarter(true);
    } else if (sessionUuid && !starterToken) {
      setNonSessionStarter(true);
    }

    if (sessionUuid !== null) {
      setRoomId(sessionUuid);
    }
  };

  // Agora RTC client
  const initRtc = async () => {
    checkUserstatus();
    rtcClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    await rtcClient.on("user-joined", handleUserJoined);
    await rtcClient.on("user-left", handleUserLeft);

    //Join the channel

    await rtcClient.join(appid, roomId(), token, rtcUid);

    //Publish audio track
    audioTracks.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    await rtcClient.publish([audioTracks.localAudioTrack]);
    addSessionStarterToDOM(rtcUid);
    setIsInChat(true);
  };

  const handleUserLeft = async (user: any) => {
    if (audioTracks.localAudioTrack !== null) {
      delete audioTracks.remoteAudioTracks[user.uid];
      const userElement = document.getElementById(user.uid.toString());
      if (userElement) {
        const usersDiv = userElement.parentNode;
        if (usersDiv) {
          usersDiv.removeChild(userElement);
        }
      }
    }
  };

  const handleUserJoined = (user: any) => {
    const usersDiv = document.querySelector(".users");
    if (usersDiv) {
      usersDiv.insertAdjacentHTML(
        "beforeend",
        `<div class="speaker user-rtc-${user.uid}" id="${user.uid}"><p>${user.uid}</p></div>`
      );
    }
  };

  const addSessionStarterToDOM = (userId: number) => {
    const usersDiv = document.querySelector(".users");
    if (usersDiv) {
      usersDiv.insertAdjacentHTML(
        "beforeend",
        `<div class="speaker user-rtc-${userId}" id="${userId}"><p>${userId}</p></div>`
      );
    }
  };

  const toggleMic = () => {
    // Implement logic to toggle microphone on/off here
    // You can use the `setMicMuted` function to update the micMuted state
  };

  const joinVoiceChat = () => {
    // Implement logic to join the voice chat channel here
    initRtc();
  };

  const leaveVoiceChat = async (userId: number) => {
    if (audioTracks.localAudioTrack !== null) {
      // close tracks
      audioTracks.localAudioTrack.stop();
      audioTracks.localAudioTrack.close();
      //unpublish the audio track and leave channel
      await rtcClient.unpublish();
      await rtcClient.leave();
    }

    const userElement = document.getElementById(userId.toString());
    if (userElement) {
      const usersDiv = userElement.parentNode;
      if (usersDiv) {
        usersDiv.removeChild(userElement);
      }
    }

    const usersDiv = document.querySelector(".users");
    if (usersDiv) {
      usersDiv.innerHTML = "";
    }
    setIsInChat(false);
  };

  // You can add more event handlers and functions for voice chat controls

  onMount(() => {
    checkUserstatus();
  });

  // Cleanup logic
  onCleanup(() => {
    leaveVoiceChat(rtcUid);
  });

  return (
    <div>
      {/* Voice chat UI goes here */}
      <div class="flex flex-col">
        <div class="flex justify-between">
          <div class="flex flex-col">
            <div>
              <Button onClick={toggleMic}>
                {micMuted() ? <MicOffOutlined /> : <MicOutlined />}
              </Button>
            </div>
            <span class="text-xs text-center">
              {micMuted() ? "Mic Off" : "Mic On"}
            </span>
          </div>
          <div class="flex flex-col">
            <Show when={!isInChat()}>
              <div>
                <Button onClick={joinVoiceChat}>
                  <HeadsetMicOutlined />
                </Button>
              </div>
            </Show>
            <Show when={isInChat()}>
              <div>
                <Button onClick={() => leaveVoiceChat(rtcUid)}>
                  <LogoutOutlined />
                </Button>
              </div>
            </Show>
            <span class="text-xs text-center">
              <Show when={!isInChat()}>Join Call</Show>
              <Show when={isInChat()}>Leave Call</Show>
            </span>
          </div>
        </div>
        <div class="users" id="users"></div>
      </div>
    </div>
  );
}
