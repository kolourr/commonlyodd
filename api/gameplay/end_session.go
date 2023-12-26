package gameplay

import (
	"log"

	"github.com/gorilla/websocket"
	"github.com/kolourr/commonlyodd/database"
)

// handleEndSession processes the 'end' game state
func handleEndSession(conn *websocket.Conn, sessionUUID string) {
    // Start a database transaction
    tx, err := database.DB.Begin()
    if err != nil {
        log.Printf("Error starting transaction: %v", err)
        return
    }

    // Delete related data from session_objects, team_scores, teams, and game_sessions
    if _, err := tx.Exec(`DELETE FROM session_objects WHERE session_id = (SELECT session_id FROM game_sessions WHERE session_uuid = $1)`, sessionUUID); err != nil {
        tx.Rollback()
        log.Printf("Error deleting from session_objects: %v", err)
        return
    }
    if _, err := tx.Exec(`DELETE FROM team_scores WHERE team_id IN (SELECT team_id FROM teams WHERE session_id = (SELECT session_id FROM game_sessions WHERE session_uuid = $1))`, sessionUUID); err != nil {
        tx.Rollback()
        log.Printf("Error deleting from team_scores: %v", err)
        return
    }
    if _, err := tx.Exec(`DELETE FROM teams WHERE session_id = (SELECT session_id FROM game_sessions WHERE session_uuid = $1)`, sessionUUID); err != nil {
        tx.Rollback()
        log.Printf("Error deleting from teams: %v", err)
        return
    }
    if _, err := tx.Exec(`DELETE FROM game_sessions WHERE session_uuid = $1`, sessionUUID); err != nil {
        tx.Rollback()
        log.Printf("Error deleting from game_sessions: %v", err)
        return
    }

    // Commit the transaction
    if err := tx.Commit(); err != nil {
        log.Printf("Error committing transaction: %v", err)
        return
    }

    // Send a WebSocket message indicating the session is complete
    endMsg := WebSocketMessage{
        GameState: "complete",
    }

    // Broadcast the end message to all clients in the session
    broadcastToSession(sessionUUID, endMsg)

}
