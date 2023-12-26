package gameplay

import (
	"log"

	"github.com/gorilla/websocket"
	"github.com/kolourr/commonlyodd/database"
)

func handleNewGame(conn *websocket.Conn, sessionUUID string, msg WebSocketMessage, gameData map[string]string) {
    // Start a database transaction
    tx, err := database.DB.Begin()
    if err != nil {
        log.Printf("Error starting transaction: %v", err)
        return
    }

    // Update game session details
    if err := updateGameSession(tx, sessionUUID, msg.TargetScore, msg.NumberOfTeams); err != nil {
        tx.Rollback()
        log.Printf("Error updating game session: %v", err)
        return
    }

    // Delete existing team data and create new teams
    if err := resetAndCreateTeams(tx, sessionUUID, msg.NumberOfTeams); err != nil {
        tx.Rollback()
        log.Printf("Error resetting and creating teams: %v", err)
        return
    }

    // Update game state to 'new-game' in the database
    if err := updateGameStateInDB(sessionUUID, "new-game"); err != nil {
        tx.Rollback()
        log.Printf("Error updating game state to 'new-game': %v", err)
        return
    }

    // Commit the transaction
    if err := tx.Commit(); err != nil {
        log.Printf("Error committing transaction: %v", err)
        return
    }

    // Fetch updated team details
    teams, err := fetchTeamsForSession(sessionUUID)
    if err != nil {
        log.Printf("Error fetching updated teams: %v", err)
        return
    }

    // Prepare updated team scores for the message
    teamScores := make([]TeamScore, len(teams))
    for i, team := range teams {
        teamScores[i] = TeamScore{TeamName: team.Name, Score: 0}
    }

    // Fetch a new random question and image links
    questionData, err := fetchRandomQuestion(sessionUUID)
    if err != nil {
        log.Printf("Error fetching new question: %v", err)
        return
    }

    // Store odd and reason for similarity in gameData map
    gameData["odd"] = questionData["odd"]
    gameData["reason"] = questionData["reason"]

    // Remove odd and reason before sending to client for the new game
    delete(questionData, "odd")
    delete(questionData, "reason")

    // Send new game start message
    newMsg := WebSocketMessage{
        GameState:     "new-game",
        ObjsImageLinks: questionData,
        GameTeamsScore: teamScores,
        TeamID:         teams[0].ID,  // First team ID for new game
        TeamName:       teams[0].Name, // First team name for new game
    }

    // Broadcast the new game message to all clients in the session
    broadcastToSession(sessionUUID, newMsg)

    // Start a new 20-second timer for the new game
    go startCountdown(conn, sessionUUID, 20)
}

