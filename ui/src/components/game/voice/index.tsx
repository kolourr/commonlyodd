import { createSignal, onMount, onCleanup, Show } from "solid-js";
import { Button, CircularProgress, Typography } from "@suid/material";
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
import CommonDialog from "../common_dialog";

export default function Voice() {
  const [micMuted, setMicMuted] = createSignal(true);
  const [isSessionStarter, setIsSessionStarter] = createSignal(false);
  const [roomId, setRoomId] = createSignal("");
  const [isInChat, setIsInChat] = createSignal(false);
  const appid = import.meta.env.CO_AGORA_APP_ID;
  const BASE_API = import.meta.env.CO_API_URL;
  const [rtmToken, setRtmToken] = createSignal("");
  const [rtcToken, setRtcToken] = createSignal("");
  const [sessionStarterNotInCall, setSessionStarterNotInCall] =
    createSignal(false);
  const [maxCallParticipantsReached, setMaxCallParticipantsReached] =
    createSignal(false);
  const [sessionStarterEndedCall, setSessionStarterEndedCall] =
    createSignal(false);
  const [isJoining, setIsJoining] = createSignal(false);

  //Unique identifier for the users entering the voice chat
  let rtmUid = String(Math.floor(Math.random() * 2032));
  let rtcUid = Math.floor(Math.random() * 2032);

  // Agora clients and channel
  let rtcClient: IAgoraRTCClient;
  let rtmClient: any;
  let channel: any;

  // Audio tracks forlocal and remote users
  let audioTracks = {
    localAudioTrack: null as null | IMicrophoneAudioTrack,
    remoteAudioTracks: {} as IRemoteAudioTrack[],
  };

  //Users in channel
  const MAX_PARTICIPANTS = 10;

  //Check if user is session starter or not
  const checkUserstatus = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionUuid =
      urlParams.get("session") || localStorage.getItem("session_uuid");
    const starterToken = localStorage.getItem("starter_token");

    if (sessionUuid && starterToken) {
      setIsSessionStarter(true);
    } else {
      setIsSessionStarter(false);
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
    AgoraRTC.setLogLevel(2);
    await rtcClient.on("user-published", handleUserPublished);
    await rtcClient.on("token-privilege-will-expire", async () => {
      rtcUid = Math.floor(Math.random() * 2032);
      checkUserstatus();
      fetchTokens();
      await rtcClient.renewToken(rtcToken());
    });
    await rtcClient.on("token-privilege-did-expire", async () => {
      rtcUid = Math.floor(Math.random() * 2032);
      checkUserstatus();
      fetchTokens();
      await rtcClient.join(appid, roomId(), rtcToken());
    });

    // Join the channel using the received RTC token
    await rtcClient.join(appid, roomId(), rtcToken(), rtcUid);
    // Publish audio track
    audioTracks.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    await rtcClient.publish([audioTracks.localAudioTrack]);
    setIsInChat(true);
    initVolumeIndicator();
  };

  // Agora RTM client - for chat and signalling
  const initRtm = async (memberType: string): Promise<boolean> => {
    rtmClient = AgoraRTM.createInstance(appid, { enableLogUpload: false });
    await rtmClient.login({ uid: rtmUid, token: rtmToken() });
    channel = rtmClient.createChannel(roomId());

    try {
      await channel.join();

      window.addEventListener("beforeunload", async (event) => {
        if (isSessionStarter()) {
          await channel.sendMessage({
            text: JSON.stringify({ type: "SESSION_END" }),
          });
        }
        await leaveRTMChannel();
      });

      // Update local user attributes with member type and RTC UID
      await rtmClient.addOrUpdateLocalUserAttributes({
        membertype: memberType,
        userRtcUid: rtcUid.toString(),
      });

      const members = await channel.getMembers();
      // Check if the session starter is present in the call
      if (memberType !== "starter") {
        const starterPresent = await checkStarterPresence(members);
        if (!starterPresent) {
          setSessionStarterNotInCall(true);
          await leaveRTMChannel();
          return false;
        }
      }

      // Check if the participant limit has been reached
      if (members.length > MAX_PARTICIPANTS) {
        setMaxCallParticipantsReached(true);
        await leaveRTMChannel();
        return false;
      }

      window.addEventListener("beforeunload", leaveRTMChannel);
      channel.on("MemberJoined", (memberId: number) => {
        handleMemberJoined(memberId);
      });
      channel.on("MemberLeft", (memberId: number) => {
        handleMemberLeft(memberId);
      });

      channel.on("ChannelMessage", async (message: any) => {
        const parsedMessage = JSON.parse(message.text);
        if (parsedMessage.type === "SESSION_END") {
          setSessionStarterEndedCall(true);
          await leaveVoiceChat(rtcUid);
        }
      });

      getChannelMembers();
      setIsInChat(true);
      return true;
    } catch (error) {
      console.error("Failed to join RTM Stream Channel:", error);
      return false;
    }
  };

  const checkStarterPresence = async (members: []) => {
    let starterPresent = false;
    for (let memberId of members) {
      const attributes = await rtmClient.getUserAttributes(memberId);
      if (attributes.membertype === "starter") {
        starterPresent = true;
        break;
      }
    }
    return starterPresent;
  };

  const joinVoiceChat = async () => {
    setIsJoining(true);
    checkUserstatus();
    await fetchTokens();

    const memberType = isSessionStarter() ? "starter" : "non-starter";

    const canJoinRtc = await initRtm(memberType);

    if (canJoinRtc) {
      initRtc();
      setIsJoining(false); // Successfully joined, so set isJoining to false
    } else {
      console.log("Cannot join RTC due to RTM conditions not being met.");
      setIsJoining(false);
    }
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

  const handleMemberJoined = async (memberId: number) => {
    const attributes = await rtmClient.getUserAttributes(memberId);
    const userRtcUid = attributes.userRtcUid;

    const usersDiv = document.querySelector(".users");
    if (usersDiv) {
      usersDiv.insertAdjacentHTML(
        "beforeend",
        `<div class="speaker user-rtc-${userRtcUid}" id="member-${memberId}"><p>${memberId}</p></div>`
      );
    }
  };

  const handleMemberLeft = (memberId: number) => {
    const userElement = document.getElementById(`member-${memberId}`);
    if (userElement) {
      const usersDiv = userElement.parentNode;
      if (usersDiv) {
        usersDiv.removeChild(userElement);
      }
    }
  };

  const getChannelMembers = async () => {
    const members = await channel.getMembers();
    members.forEach(async (memberId: number) => {
      const attributes = await rtmClient.getUserAttributes(memberId);
      const userRtcUid = attributes.userRtcUid;
      const usersDiv = document.querySelector(".users");
      if (usersDiv) {
        usersDiv.insertAdjacentHTML(
          "beforeend",
          `<div class="speaker user-rtc-${userRtcUid}" id="member-${memberId}"><p>${memberId}</p></div>`
        );
      }
    });
  };

  const handleUserPublished = async (user: any, mediaType: "audio") => {
    await rtcClient.subscribe(user, mediaType);
    if (mediaType == "audio") {
      audioTracks.remoteAudioTracks[user.uid] = [user.audioTrack];
      user.audioTrack.play();
    }
  };

  const toggleMic = () => {
    audioTracks.localAudioTrack.setMuted(micMuted());
    setMicMuted(!micMuted());
  };

  const leaveRTMChannel = async () => {
    if (channel) {
      try {
        await channel.leave();
        console.log("Left RTM Stream Channel successfully");
      } catch (error) {
        console.error("Failed to leave RTM Stream Channel:", error);
      }
      await rtmClient.logout();
    }
  };

  const leaveVoiceChat = async (userId: number) => {
    if (isSessionStarter()) {
      await channel.sendMessage({
        text: JSON.stringify({ type: "SESSION_END" }),
      });
    }

    if (audioTracks.localAudioTrack !== null) {
      // close tracks
      audioTracks.localAudioTrack.stop();
      audioTracks.localAudioTrack.close();
      //unpublish the audio track and leave channel
      await rtcClient.unpublish();
      await rtcClient.leave();
    }

    // Leave the RTM stream channel and clean up
    await leaveRTMChannel();

    // Remove the user from the DOM
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

  onMount(() => {
    checkUserstatus();
  });

  // Cleanup logic
  onCleanup(() => {
    leaveVoiceChat(rtcUid);
  });

  return (
    <div>
      <div class="flex flex-col">
        <Typography
          variant="subtitle1"
          gutterBottom
          component="div"
          class="text-center"
        >
          Join the Session Call
        </Typography>

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
                <Button onClick={joinVoiceChat} disabled={isJoining()}>
                  <Show when={isJoining()} fallback={<HeadsetMicOutlined />}>
                    <CircularProgress size={24} />
                  </Show>
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
        <div
          class="users grid grid-cols-5 gap-3 h-[100px]  w-[400px] "
          id="users"
        ></div>
      </div>
      <Show when={sessionStarterNotInCall()}>
        <CommonDialog
          open={sessionStarterNotInCall()}
          title="Session Starter Not In Call"
          content={"The session starter must be in the call to participate."}
          onClose={() => setSessionStarterNotInCall(false)}
          showCancelButton={false}
        />
      </Show>
      <Show when={maxCallParticipantsReached()}>
        <CommonDialog
          open={maxCallParticipantsReached()}
          title="Maximum Call Participants Reached"
          content={"A session call can only have a maximum of 10 participants."}
          onClose={() => setMaxCallParticipantsReached(false)}
          showCancelButton={false}
        />
      </Show>
      <Show when={sessionStarterEndedCall()}>
        <CommonDialog
          open={sessionStarterEndedCall()}
          title="Session Starter Ended Call"
          content={"The session starter must be in the call to participate."}
          onClose={() => setSessionStarterEndedCall(false)}
          showCancelButton={false}
        />
      </Show>
    </div>
  );
}
