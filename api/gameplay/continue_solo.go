package gameplay

import (
	"log"
)

// handleContinue processes the 'continue' game state
func handleContinueSolo(conn *SafeWebSocket, sessionUUID string, msg WebSocketMessage, gameData map[string]string) {
	// Update game state to 'continue' in the database
	if err := updateGameStateInDB(sessionUUID, "continue-solo"); err != nil {
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

	// Store odd and reason for similarity in gameData map for later reveal
	gameData["odd"] = questionData["odd"]
	gameData["reason"] = questionData["reason"]

	// Remove odd and reason before sending to client
	delete(questionData, "odd")
	delete(questionData, "reason")

	// Send continue message with updated data
	continueMsg := WebSocketMessage{
		GameState:      "continue-answer-solo",
		ObjsImageLinks: questionData,
		StarterInCall:  starterInCall,
	}
	// Broadcast the continue message to all clients in the session
	broadcastToSession(sessionUUID, continueMsg)

	// Start Timer
	go startCountdownSolo(conn, sessionUUID, countdownDuration)
}
