package gameplay

import (
	"log"

	"github.com/gorilla/websocket"
)

// handleReveal processes the 'reveal' game state
func handleReveal(conn *websocket.Conn, sessionUUID string, gameData map[string]string) {
    // Fetch session details
    numberOfTeams, targetScore, err := FetchSessionDetails(sessionUUID)
    if err != nil {
        log.Printf("Error fetching session details: %v", err)
        return
    }
    msg := WebSocketMessage{
        GameState: "reveal-answer",
        OddReasonForSimilarity: map[string]string{
            "odd":    gameData["odd"],
            "reason": gameData["reason"],
        },
        NumberOfTeams: numberOfTeams,
        TargetScore:   targetScore,

    }
    // Broadcast the reveal message to all clients in the session
    broadcastToSession(sessionUUID, msg)

    // Optionally, clear the data for the next question
    delete(gameData, "odd")
    delete(gameData, "reason")
}
