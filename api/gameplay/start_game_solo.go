package gameplay

import (
	"log"

	"github.com/gorilla/websocket"
)

func handleStartSolo(conn *websocket.Conn, sessionUUID string, gameData map[string]string) {
	// Update game state to 'start' in the database
	if err := updateGameStateInDB(sessionUUID, "start-solo"); err != nil {
		log.Printf("Error updating game state: %v", err)
		return
	}

	// Fetch a random question and image links
	questionData, err := fetchRandomQuestion(sessionUUID)
	if err != nil {
		log.Printf("Error fetching question: %v", err)
		return
	}

	// Fetch the starter_in_call status from the database
	starterInCall, err := getStarterInCallStatus(sessionUUID)
	if err != nil {
		log.Printf("Failed to fetch starter_in_call status: %v", err)
		return
	}

	// Initialize gameData if it's nil
	if gameData == nil {
		gameData = make(map[string]string)
	}

	// Store odd and reason for similarity in gameData map
	gameData["odd"] = questionData["odd"]
	gameData["reason"] = questionData["reason"]

	// Remove odd and reason before sending to client
	delete(questionData, "odd")
	delete(questionData, "reason")

	// Send start message
	startMsg := WebSocketMessage{
		GameState:      "start-in-progress-solo",
		ObjsImageLinks: questionData,
		StarterInCall:  starterInCall,
	}
	// Broadcast the start message to all clients in the session
	broadcastToSession(sessionUUID, startMsg)

	// Start a 20-second timer in a separate goroutine
	go startCountdownSolo(conn, sessionUUID, countdownDuration)
}
