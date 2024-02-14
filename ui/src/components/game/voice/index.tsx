import { createSignal, createEffect, onMount, onCleanup, Show } from "solid-js";
import { Button } from "@suid/material";
import "./styles.css";
import {
  MicOutlined,
  MicOffOutlined,
  LogoutOutlined,
  HeadsetMicOutlined,
} from "@suid/icons-material";
import AgoraRTC, {
  IAgoraRTCClient,
  IMicrophoneAudioTrack,
  IRemoteAudioTrack,
} from "agora-rtc-sdk-ng";
import AgoraRTM from "agora-rtm-sdk";

// Audio tracks forlocal and remote users
let audioTracks = {
  localAudioTrack: null as null | IMicrophoneAudioTrack,
  remoteAudioTracks: {} as IRemoteAudioTrack[],
};

export default function Voice() {
  const [micMuted, setMicMuted] = createSignal(true);
  const [isSessionStarter, setIsSessionStarter] = createSignal(false);
  const [nonSessionStarter, setNonSessionStarter] = createSignal(false);
  const [roomId, setRoomId] = createSignal("");
  const [isInChat, setIsInChat] = createSignal(false);
  const appid = import.meta.env.CO_AGORA_APP_ID;
  const BASE_API = import.meta.env.CO_API_URL;
  const [rtmToken, setRtmToken] = createSignal("");
  const [rtcToken, setRtcToken] = createSignal("");
  //Unique identifier for the users entering the voice chat
  const rtmUid = String(Math.floor(Math.random() * 2032));
  const rtcUid = Math.floor(Math.random() * 2032);

  // Agora clients and channel
  let rtcClient: IAgoraRTCClient;
  let rtmClient: any;
  let channel: any;

  //Host does not count towards the participant limit
  const MAX_PARTICIPANTS = 9;
  let totalParticipants: number = 0;

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

  const fetchTokens = async () => {
    try {
      const response = await fetch(`${BASE_API}/generate-tokens`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rtcUid: rtcUid,
          rtmUid: rtmUid,
          channelName: roomId(),
          role: "publisher",
        }),
      });

      const data = await response.json();
      const { rtcToken, rtmToken } = data;
      setRtmToken(rtmToken);
      setRtcToken(rtcToken);
    } catch (error) {
      console.error("Failed to generate tokens:", error);
    }
  };

  // Agora RTC client - lets only use the RTC for the audio signalling
  const initRtc = async () => {
    rtcClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    //     0: DEBUG. Output all API logs.
    // 1: INFO. Output logs of the INFO, WARNING and ERROR level.
    // 2: WARNING. Output logs of the WARNING and ERROR level.
    // 3: ERROR. Output logs of the ERROR level.
    // 4: NONE. Do not output any log.
    AgoraRTC.setLogLevel(2);
    await rtcClient.on("user-published", handleUserPublished);
    await rtcClient.on("user-left", handleUserLeft);

    // Join the channel using the received RTC token
    await rtcClient.join(appid, roomId(), rtcToken(), rtcUid);
    // Publish audio track
    audioTracks.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    await rtcClient.publish([audioTracks.localAudioTrack]);
    // addSessionStarterToDOM(rtcUid);
    setIsInChat(true);
    // initVolumeIndicator();
  };

  const initRtm = async (name) => {
    rtmClient = AgoraRTM.createInstance(appid, { enableLogUpload: false });

    await rtmClient.login({ uid: rtmUid, token: rtmToken() });
    channel = rtmClient.createChannel(roomId());

    // Join the RTM stream channel and clean up
    if (channel) {
      try {
        await channel.join();
        console.log("Joined RTM Stream Channel successfully");
      } catch (error) {
        console.error("Failed to join RTM Stream Channel:", error);
      }
    }

    setIsInChat(true);
  };

  const joinVoiceChat = async () => {
    checkUserstatus();
    await fetchTokens();

    let displayName = "";
    initRtc();
    initRtm(displayName);

    // if (totalParticipants < MAX_PARTICIPANTS) {
    //   initRtc();
    // }
  };

  const initVolumeIndicator = async () => {
    AgoraRTC.setParameter("AUDIO_VOLUME_INDICATION_INTERVAL", 150);
    rtcClient.enableAudioVolumeIndicator();

    rtcClient.on("volume-indicator", (volumes) => {
      volumes.forEach((volume) => {
        try {
          const item = document.getElementsByClassName(
            `user-rtc-${volume.uid}`
          )[0] as HTMLElement;

          if (item !== null) {
            if (volume.level >= 50) {
              item.style.borderColor = "#86efac";
            } else {
              item.style.borderColor = "#fca5a5";
            }
          }
        } catch (error) {
          console.error(error);
        }
      });
    });
  };

  const handleUserLeft = async (user: any) => {
    if (audioTracks.localAudioTrack !== null) {
      delete audioTracks.remoteAudioTracks[user.uid];
      // const userElement = document.getElementById(user.uid.toString());
      // if (userElement) {
      //   const usersDiv = userElement.parentNode;
      //   if (usersDiv) {
      //     usersDiv.removeChild(userElement);
      //   }
      // }
    }
  };

  // const handleUserJoined = (user: any) => {
  //   const usersDiv = document.querySelector(".users");
  //   if (usersDiv) {
  //     usersDiv.insertAdjacentHTML(
  //       "beforeend",
  //       `<div class="speaker user-rtc-${user.uid}" id="${user.uid}"><p>${user.uid}</p></div>`
  //     );
  //   }
  // };

  const handleUserPublished = async (user: any, mediaType: "audio") => {
    await rtcClient.subscribe(user, mediaType);
    if (mediaType == "audio") {
      audioTracks.remoteAudioTracks[user.uid] = [user.audioTrack];
      user.audioTrack.play();
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
    audioTracks.localAudioTrack.setMuted(micMuted());
    setMicMuted(!micMuted());
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

    // Leave the RTM stream channel and clean up
    if (channel) {
      try {
        await channel.leave();
        console.log("Left RTM Stream Channel successfully");
      } catch (error) {
        console.error("Failed to leave RTM Stream Channel:", error);
      }
      await rtmClient.logout();
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
                {micMuted() ? <MicOutlined /> : <MicOffOutlined />}
              </Button>
            </div>
            <span class="text-xs text-center">
              {micMuted() ? "Mic On" : "Mic Off"}
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
