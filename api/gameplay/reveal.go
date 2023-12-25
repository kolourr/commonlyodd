package gameplay

import (
	"log"

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
    if err := conn.WriteJSON(msg); err != nil {
        log.Printf("Error sending reveal message: %v", err)
    }

    // Optionally, clear the data for the next question
    delete(gameData, "odd")
    delete(gameData, "reason")
}
