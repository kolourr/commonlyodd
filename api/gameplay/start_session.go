package gameplay

import (
	"fmt"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/kolourr/commonlyodd/database"
)

type StartGameRequest struct {
	NumberOfTeams int `json:"number_of_teams" binding:"required"`
	TargetScore   int `json:"target_score" binding:"required"`
	Countdown     int `json:"countdown" binding:"required"`
}

type GameSessionResponse struct {
	SessionUUID  string `json:"session_uuid"`
	StarterToken string `json:"starter_token"`
	JoinLink     string `json:"join_link"`
}

func StartSession(c *gin.Context) {
	var requestData StartGameRequest

	// Validate input
	if err := c.ShouldBindJSON(&requestData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	//Countdown duration
	countdownDuration = requestData.Countdown

	// Generate UUIDs for the session and starter token
	sessionUUID := uuid.New().String()
	starterToken := uuid.New().String()

	// Start a database transaction
	tx, err := database.DB.Begin()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to start database transaction"})
		return
	}
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	// Insert a new game session with pre-generated UUIDs and retrieve the session ID
	var sessionID int
	err = tx.QueryRow(`
        INSERT INTO game_sessions (session_uuid, starter_token, game_state, target_score, number_of_teams)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING session_id`,
		sessionUUID, starterToken, "new", requestData.TargetScore, requestData.NumberOfTeams).Scan(&sessionID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create game session"})
		tx.Rollback()
		return
	}

	// Create teams and initial scores
	for i := 0; i < requestData.NumberOfTeams; i++ {
		var teamID int

		// Insert into teams table
		err = tx.QueryRow(`
            INSERT INTO teams (session_id, team_name)
            VALUES ($1, $2)
            RETURNING team_id`,
			sessionID, fmt.Sprintf("Team %d", i+1)).Scan(&teamID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create team"})
			tx.Rollback()
			return
		}

		// Insert into team_scores table
		_, err = tx.Exec(`
            INSERT INTO team_scores (team_id, score)
            VALUES ($1, $2)`,
			teamID, 0)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to initialize team score"})
			tx.Rollback()
			return
		}
	}

	// Commit the transaction
	err = tx.Commit()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to commit transaction"})
		return
	}

	appURL := os.Getenv("APP_URL_DEV")
	// Construct the join link using the sessionUUID
	joinLink := fmt.Sprintf("%s/game/join?session=%s", appURL, sessionUUID)

	// Return the session UUID, starter token, and join link to the client
	c.JSON(http.StatusOK, GameSessionResponse{
		SessionUUID:  sessionUUID,
		StarterToken: starterToken,
		JoinLink:     joinLink,
	})
}
