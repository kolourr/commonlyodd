import Answer from "./answer";

export default function Game() {
  return (
    <>
      <div class="text-pink-600	">These are the modals</div>
      <Answer />
    </>
  );
}

// fetch("/game/start-game", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//     "Starter-Token": localStorage.getItem("starterToken"),
//     "Session-UUID": localStorage.getItem("sessionUUID"),
//   },
//   body: JSON.stringify({
//     /* other data if needed */
//   }),
// })
//   .then((response) => response.json())
//   .then((data) => console.log(data));

// const starterToken = localStorage.getItem("starterToken");
// const sessionUUID = localStorage.getItem("sessionUUID");
// const ws = new WebSocket(
//   `ws://localhost:8080/ws/game?starterToken=${starterToken}&sessionUUID=${sessionUUID}`
// );

// ws.onmessage = function (event) {
//   // handle incoming message
// };
