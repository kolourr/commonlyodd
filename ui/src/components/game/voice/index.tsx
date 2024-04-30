import {
  createSignal,
  onMount,
  onCleanup,
  Show,
  For,
  createEffect,
  JSX,
} from "solid-js";
import { Button, CircularProgress } from "@suid/material";
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
import { createStore } from "solid-js/store";
import {
  checkSubStatus,
  userSubstatus,
} from "../../auth_payments_landing/subscription_status";
import { sendMessage } from "../start_game";
import { isSessionStarted } from "../start_session";

type UserState = {
  uid: string;
  memberId: string;
  isMuted: boolean;
};

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

export const [canJoinVoiceCall, setCanJoinVoiceCall] =
  createSignal<boolean>(false);

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
  const [users, setUsers] = createStore<UserState[]>([]);
  const [volumes, setVolumes] = createStore({});
  const [sessionStarterPresent, setSessionStarterPresent] = createSignal(false);
  const [voiceCallInfo, setVoiceCallInfo] = createSignal<JSX.Element>();
  const [sessionStarterJoinedCall, setSessionStarterJoinedCall] =
    createSignal<JSX.Element>();
  const [hasSessionStarted, setHasSessionStarted] = createSignal(false);

  const addUser = (
    userRtcUid: string,
    memberId: string,
    isMuted: boolean = false
  ) => {
    setUsers((users) => [...users, { uid: userRtcUid, memberId, isMuted }]);
  };

  const removeUser = (memberId: string) => {
    setUsers(users.filter((user) => user.memberId !== memberId));
  };

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

  // Agora RTC client
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
    audioTracks.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack({
      AEC: true,
      ANS: true,
    });
    await rtcClient.publish([audioTracks.localAudioTrack]);
    setIsInChat(true);
    initVolumeIndicator();
  };

  // Agora RTM client
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
        setSessionStarterPresent(starterPresent);
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
      channel.on("MemberJoined", (memberId: string) => {
        handleMemberJoined(memberId);
      });
      channel.on("MemberLeft", (memberId: string) => {
        handleMemberLeft(memberId);
      });

      // Adjust the ChannelMessage handler within initRtm to handle both session end and mute commands
      channel.on("ChannelMessage", async (message: any) => {
        const parsedMessage = JSON.parse(message.text);
        switch (parsedMessage.type) {
          case "SESSION_END":
            setSessionStarterEndedCall(true);
            await leaveVoiceChat(rtcUid);
            if (!micMuted()) {
              toggleMic();
            }
            break;
          case "MUTE_COMMAND":
            const { targetMemberId, mute } = parsedMessage;
            setUsers((users) =>
              users.map((user) =>
                user.memberId === targetMemberId
                  ? { ...user, isMuted: mute }
                  : user
              )
            );
            // If the current client is the target, mute/unmute local audio track
            if (targetMemberId === rtmUid && audioTracks.localAudioTrack) {
              toggleMic();
            }
            break;
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

  // Utility function to get the current mute state of a user
  const getUserMuteState = (memberId: string): boolean => {
    const user = users.find((u) => u.memberId === memberId);
    return user ? user.isMuted : false;
  };

  // Adjusted handleMuteButtonClick function to toggle the mute state and send the command
  const handleMuteButtonClick = (memberId: string) => {
    const isCurrentlyMuted = getUserMuteState(memberId);
    sendMuteCommand(memberId, !isCurrentlyMuted);
    setUsers((users) =>
      users.map((user) =>
        user.memberId === memberId
          ? { ...user, isMuted: !isCurrentlyMuted }
          : user
      )
    );
  };

  // Implementation of sendMuteCommand to send RTM messages
  const sendMuteCommand = async (memberId: string, mute: boolean) => {
    if (isSessionStarter()) {
      const message = JSON.stringify({
        type: "MUTE_COMMAND",
        targetMemberId: memberId,
        mute: mute,
      });
      await channel.sendMessage({ text: message });
    }
  };

  const handleUserButtonClick = (memberId: string) => {
    if (isSessionStarter()) {
      handleMuteButtonClick(memberId);
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

  const initChatSession = () => {
    // Clear users store
    setUsers([]);

    // Regenerate IDs for RTM and RTC for session
    rtmUid = String(Math.floor(Math.random() * 10000 + 1));
    rtcUid = Math.floor(Math.random() * 10000 + 1);
  };

  const joinVoiceChat = async () => {
    if (!isSessionStarted() && userSubstatus()) {
      setHasSessionStarted(!isSessionStarted() && userSubstatus());
      return;
    }
    setIsJoining(true);

    initChatSession();
    console.info("is session started", isSessionStarted());
    console.info("user substatus", userSubstatus());

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

  const initVolumeIndicator = () => {
    AgoraRTC.setParameter("AUDIO_VOLUME_INDICATION_INTERVAL", 150);
    rtcClient.enableAudioVolumeIndicator();

    rtcClient.on("volume-indicator", (volumeInfo) => {
      volumeInfo.forEach(({ uid, level }) => {
        setVolumes(uid, level);
      });
    });
  };

  const handleMemberJoined = async (memberId: string) => {
    const attributes = await rtmClient.getUserAttributes(memberId);
    addUser(attributes.userRtcUid, memberId);
  };

  const handleMemberLeft = (memberId: string) => {
    removeUser(memberId);
  };

  const getChannelMembers = async () => {
    const members = await channel.getMembers();
    members.forEach(async (memberId: string) => {
      const attributes = await rtmClient.getUserAttributes(memberId);
      addUser(attributes.userRtcUid, memberId);
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
    audioTracks.localAudioTrack.setEnabled(!micMuted());
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
    if (isSessionStarter() && userSubstatus()) {
      await channel.sendMessage({
        text: JSON.stringify({ type: "SESSION_END" }),
      });
      sendMessage({ game_state: "starter-not-in-call" });
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
    handleMemberLeft(rtmUid);
    // Reset the state
    const usersDiv = document.querySelector(".users");
    if (usersDiv) {
      usersDiv.innerHTML = "";
    }
    setIsInChat(false);
  };

  const voiceCallInfoSetSessionStarter = () => {
    if (!canJoinVoiceCall() && userSubstatus()) {
      setVoiceCallInfo(
        <>
          <div class=" flex items-center justify-center  ">
            Join call when session is active.
          </div>
          <div class=" flex items-center justify-center">
            Players will be notified accordingly.
          </div>
        </>
      );
      setSessionStarterJoinedCall();
    } else if (canJoinVoiceCall() && userSubstatus()) {
      setVoiceCallInfo();
      setSessionStarterJoinedCall(
        <div class=" flex items-center justify-center">
          Players can be muted by clicking on their number.
        </div>
      );
    }
  };

  const notifyOtherPlayers = () => {
    if (canJoinVoiceCall() && !userSubstatus()) {
      setSessionStarterJoinedCall(
        <div class=" flex items-center justify-center">
          The session starter is in the voice call. You may now join.
        </div>
      );
    }
  };

  const voiceCallInfoSetNonSessionStarter = () => {
    if (!canJoinVoiceCall() && !userSubstatus()) {
      setSessionStarterJoinedCall(
        <div class=" flex items-center justify-center">
          You can join the call once the session starter joins.
        </div>
      );
    }
  };

  const notifyOtherPlayerOfSessionStarterviaGameWebscoket = async () => {
    if (isSessionStarter() && users.length > 0) {
      const members = await channel.getMembers();
      const starterPresent = await checkStarterPresence(members);
      console.info("Starter present", starterPresent);
      if (starterPresent) {
        sendMessage({ game_state: "starter-in-call" });
      }
    }

    if (isSessionStarter() && users.length === 0) {
      sendMessage({ game_state: "starter-not-in-call" });
    }
  };

  const getSessionStarterStatus = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionUuid = urlParams.get("session");

    try {
      const response = await fetch(
        `http://localhost:8080/session-starter-status`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            sessionUuid: sessionUuid,
          }),
        }
      );
      const data = await response.json();

      if (data.starterInCall !== undefined) {
        setCanJoinVoiceCall(data.starterInCall);
      } else {
        console.error("Starter in call status not found");
      }
    } catch (error) {
      console.error("Failed to get starter in call status:", error);
    }
  };

  onMount(() => {
    getSessionStarterStatus();
    checkUserstatus();
    voiceCallInfoSetSessionStarter();
    voiceCallInfoSetNonSessionStarter();
    notifyOtherPlayerOfSessionStarterviaGameWebscoket();
    notifyOtherPlayers();
  });

  onCleanup(() => {
    leaveVoiceChat(rtcUid);
    leaveRTMChannel();
  });

  createEffect(() => {
    voiceCallInfoSetSessionStarter();
    voiceCallInfoSetNonSessionStarter();
    notifyOtherPlayerOfSessionStarterviaGameWebscoket();
    notifyOtherPlayers();
  });

  return (
    <>
      <div class="flex flex-col h-52 w-[16%] justify-center items-center   ">
        <div class="flex flex-col justify-between">
          <div class="flex flex-col ">
            <Show when={!isInChat()}>
              <div>
                <Button onClick={joinVoiceChat} disabled={isJoining()}>
                  <Show
                    when={isJoining()}
                    fallback={<HeadsetMicOutlined fontSize="medium" />}
                  >
                    <CircularProgress size={24} />
                  </Show>
                </Button>
              </div>
            </Show>
            <Show when={isInChat()}>
              <div>
                <Button onClick={() => leaveVoiceChat(rtcUid)}>
                  <LogoutOutlined fontSize="small" />
                </Button>
              </div>
            </Show>
            <span class="text-xs lg:text-sm text-center font-bold text-gray-300">
              <Show when={!isInChat()}>Join Call</Show>
              <Show when={isInChat()}>Leave Call</Show>
            </span>
          </div>
          <div class="flex flex-col">
            <div>
              <Button onClick={toggleMic}>
                {micMuted() ? (
                  <MicOutlined fontSize="medium" />
                ) : (
                  <MicOffOutlined fontSize="medium" />
                )}
              </Button>
            </div>
            <span class="text-xs lg:text-sm text-center font-bold text-gray-300">
              {micMuted() ? "Mic On" : "Mic Off"}
            </span>
          </div>
        </div>
      </div>
      <div class="   w-[68%] flex flex-col  shadow-inner text-gray-300  ">
        <div class="text-xs lg:text-sm  h-4 text-gray-300  font-bold flex justify-center mb-2   ">
          Group Voice Call
        </div>

        <div
          class="users grid grid-cols-5 h-40 gap-0 items-center justify-start text-gray-300 shadow-md shadow-gray-50 bg-gradient-to-bl from-slate-900 via-zinc-950  to-slate-900   "
          id="users"
        >
          <For each={users}>
            {(user) => (
              <button
                class={`speaker user-rtc-${user.uid}`}
                style={{
                  background: user.isMuted
                    ? "#991b1b"
                    : volumes[user.uid] > 50
                    ? "#4ade80"
                    : "#111827",
                }}
                onclick={() => handleUserButtonClick(user.memberId)}
              >
                {user.memberId}
              </button>
            )}
          </For>
        </div>
        <div class="pt-2  h-10 text-xs lg:text-sm">
          {voiceCallInfo()}
          {sessionStarterJoinedCall()}
        </div>
      </div>
      <Show when={sessionStarterNotInCall()}>
        <CommonDialog
          open={sessionStarterNotInCall()}
          title="Session Starter Not In Call"
          content={"Session starter must be in the call to participate."}
          onClose={() => setSessionStarterNotInCall(false)}
          showCancelButton={false}
        />
      </Show>
      <Show when={hasSessionStarted()}>
        <CommonDialog
          open={hasSessionStarted()}
          title="Session Inactive"
          content={"Session must be active prior to joining call."}
          onClose={() => setHasSessionStarted(false)}
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
    </>
  );
}
