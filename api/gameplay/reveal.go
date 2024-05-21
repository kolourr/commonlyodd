package gameplay

import (
	"log"
)

// handleReveal processes the 'reveal' game state
func handleReveal(conn *SafeWebSocket, sessionUUID string, gameData map[string]string) {

	// Fetch current team scores
	teamScores, err := fetchTeamScores(sessionUUID)
	if err != nil {
		log.Printf("Error fetching team scores: %v", err)
		return
	}

	// Fetch session details
	numberOfTeams, targetScore, err := FetchSessionDetails(sessionUUID)
	if err != nil {
		log.Printf("Error fetching session details: %v", err)
		return
	}

	// Fetch the starter_in_call status from the database
	starterInCall, err := getStarterInCallStatus(sessionUUID)
	if err != nil {
		log.Printf("Failed to fetch starter_in_call status: %v", err)
		return
	}

	msg := WebSocketMessage{
		GameState: "reveal-answer",
		OddReasonForSimilarity: map[string]string{
			"odd":    gameData["odd"],
			"reason": gameData["reason"],
		},
		GameTeamsScore: teamScores,
		NumberOfTeams:  numberOfTeams,
		TargetScore:    targetScore,
		StarterInCall:  starterInCall,
	}

	// Broadcast the reveal message to all clients in the session
	broadcastToSession(sessionUUID, msg)

	// Optionally, clear the data for the next question
	delete(gameData, "odd")
	delete(gameData, "reason")
}
