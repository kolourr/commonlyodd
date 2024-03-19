package gameplay

import (
	"log"

	"github.com/kolourr/commonlyodd/database"
)

func handleStarterInCall(sessionUUID string) {
	// Update the database to set starter_in_call to true
	_, err := database.DB.Exec(`UPDATE game_sessions SET starter_in_call = true WHERE session_uuid = $1`, sessionUUID)
	if err != nil {
		log.Printf("Error updating starter_in_call to true: %v", err)
		return
	}

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

	// Construct the message to broadcast
	msg := WebSocketMessage{
		GameState:      "session-starter-update",
		StarterInCall:  true,
		GameTeamsScore: teamScores,
		NumberOfTeams:  numberOfTeams,
		TargetScore:    targetScore,
	}

	// Broadcast the updated message to all clients in the session
	broadcastToSession(sessionUUID, msg)
}

func handleStarterNotInCall(sessionUUID string) {
	// Update the database to set starter_in_call to false
	_, err := database.DB.Exec(`UPDATE game_sessions SET starter_in_call = false WHERE session_uuid = $1`, sessionUUID)
	if err != nil {
		log.Printf("Error updating starter_in_call to false: %v", err)
		return
	}

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

	// Construct the message to broadcast
	msg := WebSocketMessage{
		GameState:      "session-starter-update",
		StarterInCall:  false,
		GameTeamsScore: teamScores,
		NumberOfTeams:  numberOfTeams,
		TargetScore:    targetScore,
	}

	// Broadcast the updated message to all clients in the session
	broadcastToSession(sessionUUID, msg)
}

// getStarterInCallStatus retrieves the starter_in_call status for the given sessionUUID from the database.
func getStarterInCallStatus(sessionUUID string) (bool, error) {
	var starterInCall bool
	err := database.DB.QueryRow(`SELECT starter_in_call FROM game_sessions WHERE session_uuid = $1`, sessionUUID).Scan(&starterInCall)
	if err != nil {
		log.Printf("Error fetching starter_in_call status: %v", err)
		return false, err
	}
	return starterInCall, nil
}
