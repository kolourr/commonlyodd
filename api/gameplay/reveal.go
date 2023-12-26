package gameplay

import (
	"github.com/gorilla/websocket"
)

// handleReveal processes the 'reveal' game state
func handleReveal(conn *websocket.Conn, sessionUUID string, gameData map[string]string) {
    msg := WebSocketMessage{
        GameState: "reveal",
        OddReasonForSimilarity: map[string]string{
            "odd":    gameData["odd"],
            "reason": gameData["reason"],
        },
    }
    // Broadcast the reveal message to all clients in the session
    broadcastToSession(sessionUUID, msg)

    // Optionally, clear the data for the next question
    delete(gameData, "odd")
    delete(gameData, "reason")
}
