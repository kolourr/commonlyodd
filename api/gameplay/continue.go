package gameplay

import (
	"fmt"
	"log"

	"github.com/gorilla/websocket"
	"github.com/kolourr/commonlyodd/database"
)

// handleContinue processes the 'continue' game state
func handleContinue(conn *websocket.Conn, sessionUUID string,msg WebSocketMessage, gameData map[string]string) {
    // Update game state to 'continue' in the database
    if err := updateGameStateInDB(sessionUUID, "continue"); err != nil {
        log.Printf("Error updating game state: %v", err)
        return
    }

    // Fetch current team scores
    teamScores, err := fetchTeamScores(sessionUUID)
    if err != nil {
        log.Printf("Error fetching team scores: %v", err)
        return
    }

    // Fetch a random question and image links
    questionData, err := fetchRandomQuestion(sessionUUID)
    if err != nil {
        log.Printf("Error fetching question: %v", err)
        return
    }

    // Store odd and reason for similarity in gameData map for later reveal
    gameData["odd"] = questionData["odd"]
    gameData["reason"] = questionData["reason"]

    // Remove odd and reason before sending to client
    delete(questionData, "odd")
    delete(questionData, "reason")

    // Send continue message with updated data
    continueMsg  := WebSocketMessage{
        GameState:     "continue",
        ObjsImageLinks: questionData,
        GameTeamsScore: teamScores,
        TeamID:         msg.TeamID,
        TeamName:       msg.TeamName,
    }
    // Broadcast the continue message to all clients in the session
    broadcastToSession(sessionUUID, continueMsg)

    // Start a 20-second timer in a separate goroutine
    go startCountdown(conn, sessionUUID, 20)
}

func fetchTeamScores(sessionUUID string) ([]TeamScore, error) {
    var teamScores []TeamScore

    // SQL query to fetch team names and their corresponding scores
    query := `
        SELECT t.team_name, ts.score
        FROM teams t
        INNER JOIN team_scores ts ON t.team_id = ts.team_id
        INNER JOIN game_sessions gs ON t.session_id = gs.session_id
        WHERE gs.session_uuid = $1
        ORDER BY t.team_id`

    rows, err := database.DB.Query(query, sessionUUID)
    if err != nil {
        return nil, fmt.Errorf("error querying team scores: %w", err)
    }
    defer rows.Close()

    for rows.Next() {
        var ts TeamScore
        if err := rows.Scan(&ts.TeamName, &ts.Score); err != nil {
            return nil, fmt.Errorf("error scanning team score row: %w", err)
        }
        teamScores = append(teamScores, ts)
    }

    if err := rows.Err(); err != nil {
        return nil, fmt.Errorf("error iterating over team scores: %w", err)
    }

    return teamScores, nil
}




