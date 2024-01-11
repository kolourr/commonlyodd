package gameplay

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kolourr/commonlyodd/database"
)

// EndSessionEndpoint handles the request to end a game session
func EndSessionEndpoint(c *gin.Context) {
	sessionUUID := c.Query("sessionUUID")
	starterToken := c.Query("starterToken")

	// Validate starter token
	if !validateStarterToken(sessionUUID, starterToken) {
		c.JSON(http.StatusUnauthorized, "Invalid starter token")
		return
	}

	// End the session
	if err := endSession(sessionUUID); err != nil {
		c.JSON(http.StatusInternalServerError, "Failed to end session")
		return
	}

	c.JSON(http.StatusOK, "Session ended successfully")
}

// endSession deletes all data related to the session UUID from the database
func endSession(sessionUUID string) error {
	// Start a database transaction
	tx, err := database.DB.Begin()
	if err != nil {
		log.Printf("Error starting transaction: %v", err)
		return err
	}

	// Delete related data from session_objects, team_scores, teams, and game_sessions
	if _, err := tx.Exec(`DELETE FROM session_objects WHERE session_id = (SELECT session_id FROM game_sessions WHERE session_uuid = $1)`, sessionUUID); err != nil {
		tx.Rollback()
		log.Printf("Error deleting from session_objects: %v", err)
		return err
	}
	if _, err := tx.Exec(`DELETE FROM team_scores WHERE team_id IN (SELECT team_id FROM teams WHERE session_id = (SELECT session_id FROM game_sessions WHERE session_uuid = $1))`, sessionUUID); err != nil {
		tx.Rollback()
		log.Printf("Error deleting from team_scores: %v", err)
		return err
	}
	if _, err := tx.Exec(`DELETE FROM teams WHERE session_id = (SELECT session_id FROM game_sessions WHERE session_uuid = $1)`, sessionUUID); err != nil {
		tx.Rollback()
		log.Printf("Error deleting from teams: %v", err)
		return err
	}
	if _, err := tx.Exec(`DELETE FROM game_sessions WHERE session_uuid = $1`, sessionUUID); err != nil {
		tx.Rollback()
		log.Printf("Error deleting from game_sessions: %v", err)
		return err
	}

	// Commit the transaction
	if err := tx.Commit(); err != nil {
		log.Printf("Error committing transaction: %v", err)
		return err
	}

	return nil
}
