// Agora RTC client - lets only use the RTC for the audio signalling
const initRtc = async () => {
  checkUserstatus();
  await fetchTokens();
  rtcClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  // // Check if the number of participants exceeds the maximum
  // await rtcClient.on("user-joined", (user: any) => {
  //   totalParticipants = Object.keys(audioTracks.remoteAudioTracks).length;

  //   if (totalParticipants < MAX_PARTICIPANTS) {
  //     handleUserJoined(user);
  //   } else {
  //     //Add indicator for maximum participants reached to let the user know
  //     console.info("Maximum participants reached.");
  //   }
  // });
  await rtcClient.on("user-published", handleUserPublished);
  await rtcClient.on("user-left", handleUserLeft);

  //Join the channel
  await rtcClient.join(appid, roomId(), rtcToken(), rtcUid);
  //Publish audio track
  audioTracks.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
  await rtcClient.publish([audioTracks.localAudioTrack]);
  // addSessionStarterToDOM(rtcUid);
  setIsInChat(true);
  // initVolumeIndicator();
};

const joinVoiceChat = () => {
  let displayName = "";
  initRtc();
  initRtm(displayName);

  // if (totalParticipants < MAX_PARTICIPANTS) {
  //   initRtc();
  // }
};
