package gameplay

import "database/sql"

func updateGameSession(tx *sql.Tx, sessionUUID string, targetScore float64, numberOfTeams int) error {
	_, err := tx.Exec(`
        UPDATE game_sessions
        SET target_score = $1, number_of_teams = $2
        WHERE session_uuid = $3`,
		targetScore, numberOfTeams, sessionUUID)
	return err
}