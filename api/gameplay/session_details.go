package gameplay

import (
	"database/sql"
	"fmt"

	"github.com/kolourr/commonlyodd/database"
)

// FetchSessionDetails retrieves the number of teams and target score for a given session
func FetchSessionDetails(sessionUUID string) (int, float64, error) {
    var numberOfTeams int
    var targetScore float64

    err := database.DB.QueryRow(`
        SELECT number_of_teams, target_score
        FROM game_sessions
        WHERE session_uuid = $1`, sessionUUID).Scan(&numberOfTeams, &targetScore)
    if err != nil {
        if err == sql.ErrNoRows {
            return 0, 0, fmt.Errorf("no session found with UUID: %s", sessionUUID)
        }
        return 0, 0, fmt.Errorf("error querying session details: %w", err)
    }

    return numberOfTeams, targetScore, nil
}