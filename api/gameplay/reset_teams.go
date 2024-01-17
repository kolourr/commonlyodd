package gameplay

import (
	"database/sql"
	"fmt"
)

func resetAndCreateTeams(tx *sql.Tx, sessionUUID string, numberOfTeams int) error {
	// Retrieve session_id for the session
	var sessionID int
	if err := tx.QueryRow(`SELECT session_id FROM game_sessions WHERE session_uuid = $1`, sessionUUID).Scan(&sessionID); err != nil {
		return err
	}

	// Delete existing team scores and teams associated with the session
	if _, err := tx.Exec(`DELETE FROM team_scores WHERE team_id IN (SELECT team_id FROM teams WHERE session_id = $1)`, sessionID); err != nil {
		return err
	}
	if _, err := tx.Exec(`DELETE FROM teams WHERE session_id = $1`, sessionID); err != nil {
		return err
	}

	// Create new teams and initialize scores for these teams
	for i := 0; i < numberOfTeams; i++ {
		var teamID int
		if err := tx.QueryRow(`INSERT INTO teams (session_id, team_name) VALUES ($1, $2) RETURNING team_id`, sessionID, fmt.Sprintf("Team %d", i+1)).Scan(&teamID); err != nil {
			return err
		}

		if _, err := tx.Exec(`INSERT INTO team_scores (team_id, score) VALUES ($1, 0)`, teamID); err != nil {
			return err
		}
	}
	return nil
}
