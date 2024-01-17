package gameplay

import "github.com/kolourr/commonlyodd/database"

func updateGameStateInDB(sessionUUID string, state string) error {
	_, err := database.DB.Exec(`
        UPDATE game_sessions
        SET game_state = $1
        WHERE session_uuid = $2`,
		state, sessionUUID)
	return err
}
