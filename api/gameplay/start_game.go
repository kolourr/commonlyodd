package gameplay

import (
	"log"

	"github.com/gorilla/websocket"
)

func handleStart(conn *websocket.Conn, sessionUUID string, gameData map[string]string) {
	// Update game state to 'start' in the database
	if err := updateGameStateInDB(sessionUUID, "start"); err != nil {
		log.Printf("Error updating game state: %v", err)
		return
	}

	// Fetch session details
	numberOfTeams, targetScore, err := FetchSessionDetails(sessionUUID)
	if err != nil {
		log.Printf("Error fetching session details: %v", err)
		return
	}

	// Fetch team details
	teams, err := fetchTeamsForSession(sessionUUID)
	if err != nil {
		log.Printf("Error fetching teams: %v", err)
		return
	}

	// Ensure there is at least one team
	if len(teams) == 0 {
		log.Printf("No teams found for session: %s", sessionUUID)
		return
	}

	// Prepare the first team's details
	firstTeam := teams[0] // Assuming the first team in the list is the current team

	// Prepare team scores for the message
	teamScores := make([]TeamScore, len(teams))
	for i, team := range teams {
		teamScores[i] = TeamScore{TeamName: team.Name, Score: 0}
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
		GameState:      "start-in-progress",
		ObjsImageLinks: questionData,
		GameTeamsScore: teamScores,
		TeamID:         firstTeam.ID,
		TeamName:       firstTeam.Name,
		NumberOfTeams:  numberOfTeams,
		TargetScore:    targetScore,
		StarterInCall:  starterInCall,
	}
	// Broadcast the start message to all clients in the session
	broadcastToSession(sessionUUID, startMsg)

	// Start a 20-second timer in a separate goroutine
	go startCountdown(conn, sessionUUID, countdownDuration)
}
