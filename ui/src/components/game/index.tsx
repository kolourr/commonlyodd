export default function Game() {
  return (
    <div>
      <h2>This is the game page</h2>
    </div>
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
