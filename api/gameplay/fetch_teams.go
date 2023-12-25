package gameplay

import "github.com/kolourr/commonlyodd/database"

type Team struct {
	ID   int
	Name string
}

func fetchTeamsForSession(sessionUUID string) ([]Team, error) {
	var teams []Team
	query := `SELECT team_id, team_name FROM teams WHERE session_id = (SELECT session_id FROM game_sessions WHERE session_uuid = $1)`

	rows, err := database.DB.Query(query, sessionUUID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var team Team
		if err := rows.Scan(&team.ID, &team.Name); err != nil {
			return nil, err
		}
		teams = append(teams, team)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return teams, nil
}
