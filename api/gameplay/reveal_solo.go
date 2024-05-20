package gameplay

import (
	"log"
	"time"

	"github.com/gorilla/websocket"
)

// handleReveal processes the 'reveal' game state
func handleRevealSolo(conn *websocket.Conn, sessionUUID string, gameData map[string]string) {

	// Fetch the starter_in_call status from the database
	starterInCall, err := getStarterInCallStatus(sessionUUID)
	if err != nil {
		log.Printf("Failed to fetch starter_in_call status: %v", err)
		return
	}

	msg := WebSocketMessage{
		GameState: "reveal-answer-solo",
		OddReasonForSimilarity: map[string]string{
			"odd":    gameData["odd"],
			"reason": gameData["reason"],
		},
		StarterInCall: starterInCall,
	}

	// Send the cancellation signal before broadcasting the reveal message
	select {
	case cancelCountdownSolo <- true:
	case <-time.After(time.Millisecond * 100):
		log.Println("Cancellation solo signal send timed out; channel may be blocked.")
	default:
		log.Println("Cancellation solo signal failed to send; channel may be full or unmonitored.")
	}

	// Broadcast the reveal message to all clients in the session
	broadcastToSession(sessionUUID, msg)

	// Optionally, clear the data for the next question
	delete(gameData, "odd")
	delete(gameData, "reason")
}
