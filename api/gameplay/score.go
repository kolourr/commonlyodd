package gameplay

import (
	"fmt"
	"log"

	"github.com/gorilla/websocket"
	"github.com/kolourr/commonlyodd/database"
)

// handleScore processes the 'score' game state
func handleScore(conn *websocket.Conn, sessionUUID string, msg WebSocketMessage) {
    // Update the team score in the database
    if err := updateTeamScore(sessionUUID, msg.TeamID, msg.IndividualTeamScore); err != nil {
        log.Printf("Error updating team score: %v", err)
        return
    }

    // Fetch session details
    numberOfTeams, targetScore, err := FetchSessionDetails(sessionUUID)
    if err != nil {
        log.Printf("Error fetching session details: %v", err)
        return
    }

    // Check if target score is reached
    targetScoreReached, err := checkTargetScore(sessionUUID, msg.TeamID)
    if err != nil {
        log.Printf("Error checking target score: %v", err)
        return
    }

    nextMsg := WebSocketMessage{}

    nextMsg.NumberOfTeams = numberOfTeams
    nextMsg.TargetScore = targetScore

    if targetScoreReached {
        // Target score is reached, end the game
        nextMsg.GameState = "end-game"
        nextMsg.GameWinner = msg.TeamName
        // Update game state in the database to 'end-game'
        if err := updateGameStateInDB(sessionUUID, "end-game"); err != nil {
            log.Printf("Error updating game state: %v", err)
            return
        }

    } else {
        // Target score not reached, continue to next team
        nextTeamID, nextTeamName, err := getNextTeam(sessionUUID, msg.TeamID)
        if err != nil {
            log.Printf("Error getting next team: %v", err)
            return
        }
        nextMsg.GameState = "continue"
        nextMsg.TeamID = nextTeamID
        nextMsg.TeamName = nextTeamName
        // Update game state in the database to 'continue'
        if err := updateGameStateInDB(sessionUUID, "continue"); err != nil {
            log.Printf("Error updating game state: %v", err)
            return
        }

    }

    // Broadcast the next message to all clients in the session
    broadcastToSession(sessionUUID, nextMsg)
}


func updateTeamScore(sessionUUID string, teamID int, newScore float64) error {
    // First, get the teamScoreID for the team in the current session
    var teamScoreID int
    query := `
        SELECT ts.team_score_id
        FROM team_scores ts
        INNER JOIN teams t ON ts.team_id = t.team_id
        INNER JOIN game_sessions gs ON t.session_id = gs.session_id
        WHERE gs.session_uuid = $1 AND t.team_id = $2`
    err := database.DB.QueryRow(query, sessionUUID, teamID).Scan(&teamScoreID)
    if err != nil {
        log.Printf("Query: %s", query)
        log.Printf("Session UUID: %s, Team ID: %d", sessionUUID, teamID)
        return fmt.Errorf("error finding team score ID: %w", err)
    }


    // Next, update the score for the found teamScoreID
    _, err = database.DB.Exec(`
        UPDATE team_scores
        SET score = score + $1, last_updated = NOW()
        WHERE team_score_id = $2`,
        newScore, teamScoreID)
    if err != nil {
        return fmt.Errorf("error updating team score: %w", err)
    }

    return nil
}


func checkTargetScore(sessionUUID string, teamID int) (bool, error) {
    // Get the target score for the session
    var targetScore float64
    err := database.DB.QueryRow(`
        SELECT target_score FROM game_sessions WHERE session_uuid = $1`,
        sessionUUID).Scan(&targetScore)
    if err != nil {
        return false, fmt.Errorf("error getting target score: %w", err)
    }

    // Get the current score of the specified team
    var currentScore float64
    err = database.DB.QueryRow(`
        SELECT score FROM team_scores
        WHERE team_id = $1`,
        teamID).Scan(&currentScore)
    if err != nil {
        return false, fmt.Errorf("error getting current score for team %d: %w", teamID, err)
    }

    // Check if the team's score exactly meets the target score
    return currentScore == targetScore, nil
}


func getNextTeam(sessionUUID string, currentTeamID int) (int, string, error) {
    // Fetch all team IDs and names in the session
    var teams []struct {
        ID   int
        Name string
    }
    query := `
        SELECT t.team_id, t.team_name FROM teams t
        INNER JOIN game_sessions gs ON t.session_id = gs.session_id
        WHERE gs.session_uuid = $1
        ORDER BY t.team_id`
    rows, err := database.DB.Query(query, sessionUUID)
    if err != nil {
        return 0, "", fmt.Errorf("error querying teams: %w", err)
    }
    defer rows.Close()

    var nextTeamID int
    var nextTeamName string
    var foundCurrent bool

    for rows.Next() {
        var teamID int
        var teamName string
        if err := rows.Scan(&teamID, &teamName); err != nil {
            return 0, "", fmt.Errorf("error scanning team data: %w", err)
        }
        teams = append(teams, struct{ ID int; Name string }{ID: teamID, Name: teamName})

        if foundCurrent {
            nextTeamID = teamID
            nextTeamName = teamName
            break
        }

        if teamID == currentTeamID {
            foundCurrent = true
        }
    }

    if err := rows.Err(); err != nil {
        return 0, "", fmt.Errorf("error reading team data: %w", err)
    }

    // If the current team is the last one, set next team to the first team
    if nextTeamID == 0 && len(teams) > 0 {
        nextTeamID = teams[0].ID
        nextTeamName = teams[0].Name
    }

    if nextTeamID == 0 {
        return 0, "", fmt.Errorf("no next team found")
    }

    return nextTeamID, nextTeamName, nil
}
