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

	// Increment the number of questions answered for the current team
	if err := incrementQuestionsAnswered(sessionUUID, msg.TeamID); err != nil {
		log.Printf("Error incrementing questions answered: %v", err)
		return
	}

	// Fetch current team scores
	teamScores, err := fetchTeamScores(sessionUUID)
	if err != nil {
		log.Printf("Error fetching team scores: %v", err)
		return
	}

	// Check if target score is reached and if all teams have had equal turns and if a tie exists between teams
	targetScoreReached, allTeamsEqualTurns, tieExists, err := checkGameStatus(sessionUUID, targetScore)
	if err != nil {
		log.Printf("Error checking game status: %v", err)
		return
	}

	nextMsg := WebSocketMessage{
		NumberOfTeams:               numberOfTeams,
		TargetScore:                 targetScore,
		GameTeamsScore:              teamScores,
		TeamNameReceived:            msg.TeamName,
		IndividualTeamScoreReceived: msg.IndividualTeamScore,
		TimeStampReceived:           msg.TimeStamp,
	}

	if targetScoreReached && allTeamsEqualTurns && !tieExists {
		// Find the winning team
		winningTeam, err := findWinningTeam(sessionUUID)
		if err != nil {
			log.Printf("Error finding winning team: %v", err)
			return
		}
		// Target score is reached, give session starter the option of ending the game or starting a new game
		nextMsg.GameState = "end-game"
		nextMsg.GameWinner = winningTeam

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

func incrementQuestionsAnswered(sessionUUID string, teamID int) error {
	// SQL query to increment the questions_answered count for the given team
	_, err := database.DB.Exec(`
        UPDATE team_scores ts
        SET questions_answered = questions_answered + 1
        FROM teams t
        INNER JOIN game_sessions gs ON t.session_id = gs.session_id
        WHERE t.team_id = ts.team_id AND t.team_id = $1 AND gs.session_uuid = $2`,
		teamID, sessionUUID)
	return err
}

func checkGameStatus(sessionUUID string, targetScore float64) (bool, bool, bool, error) {
	var minTurns, maxTurns, teamsPlayed, totalTeams int
	var highestScore float64

	// Get the highest score among all teams
	err := database.DB.QueryRow(`
        SELECT MAX(score)
        FROM team_scores ts
        INNER JOIN teams t ON ts.team_id = t.team_id
        INNER JOIN game_sessions gs ON t.session_id = gs.session_id
        WHERE gs.session_uuid = $1
    `, sessionUUID).Scan(&highestScore)
	if err != nil {
		return false, false, false, err
	}

	// Check if any team has reached or exceeded the target score
	targetScoreReached := highestScore >= targetScore

	// Get the total number of teams in the session
	err = database.DB.QueryRow(`
        SELECT COUNT(*)
        FROM teams t
        INNER JOIN game_sessions gs ON t.session_id = gs.session_id
        WHERE gs.session_uuid = $1
    `, sessionUUID).Scan(&totalTeams)
	if err != nil {
		return false, false, false, err
	}

	// Get the minimum and maximum number of turns played by teams
	err = database.DB.QueryRow(`
        SELECT MIN(ts.questions_answered), MAX(ts.questions_answered), COUNT(DISTINCT ts.team_id)
        FROM team_scores ts
        INNER JOIN teams t ON ts.team_id = t.team_id
        INNER JOIN game_sessions gs ON t.session_id = gs.session_id
        WHERE gs.session_uuid = $1
    `, sessionUUID).Scan(&minTurns, &maxTurns, &teamsPlayed)
	if err != nil {
		return false, false, false, err
	}

	allTeamsEqualTurns := teamsPlayed == totalTeams && minTurns == maxTurns

	// Check if there is a tie among the teams that have reached the highest score
	var teamsAtHighestScore int
	err = database.DB.QueryRow(`
        SELECT COUNT(*)
        FROM team_scores ts
        INNER JOIN teams t ON ts.team_id = t.team_id
        INNER JOIN game_sessions gs ON t.session_id = gs.session_id
        WHERE gs.session_uuid = $1 AND ts.score = $2
    `, sessionUUID, highestScore).Scan(&teamsAtHighestScore)
	if err != nil {
		return false, false, false, err
	}

	tieExists := teamsAtHighestScore > 1

	return targetScoreReached, allTeamsEqualTurns, tieExists, nil
}

func findWinningTeam(sessionUUID string) (string, error) {
	var winningTeam string
	err := database.DB.QueryRow(`
        SELECT t.team_name
        FROM team_scores ts
        INNER JOIN teams t ON ts.team_id = t.team_id
        INNER JOIN game_sessions gs ON t.session_id = gs.session_id
        WHERE gs.session_uuid = $1
        ORDER BY ts.score DESC, ts.questions_answered ASC
        LIMIT 1
    `, sessionUUID).Scan(&winningTeam)
	if err != nil {
		return "", err
	}
	return winningTeam, nil
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
		teams = append(teams, struct {
			ID   int
			Name string
		}{ID: teamID, Name: teamName})

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
