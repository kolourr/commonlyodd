package gameplay

import (
	"log"

	"github.com/kolourr/commonlyodd/database"
)

func handleStarterInCall(sessionUUID string) {
	// Update the database to set starter_in_call to true
	_, err := database.DB.Exec(`UPDATE game_sessions SET starter_in_call = true WHERE session_uuid = $1`, sessionUUID)
	if err != nil {
		log.Printf("Error updating starter_in_call to true: %v", err)
		return
	}

	// Construct the message to broadcast
	msg := WebSocketMessageStarter{
		GameState:     "session-starter-update",
		StarterInCall: true,
	}

	// Broadcast the updated message to all clients in the session
	broadcastToSessionSessionStarter(sessionUUID, msg)
}

func handleStarterNotInCall(sessionUUID string) {
	// Update the database to set starter_in_call to false
	_, err := database.DB.Exec(`UPDATE game_sessions SET starter_in_call = false WHERE session_uuid = $1`, sessionUUID)
	if err != nil {
		log.Printf("Error updating starter_in_call to false: %v", err)
		return
	}

	// Construct the message to broadcast
	msg := WebSocketMessageStarter{
		GameState:     "session-starter-update",
		StarterInCall: false,
	}

	// Broadcast the updated message to all clients in the session
	broadcastToSessionSessionStarter(sessionUUID, msg)
}

// getStarterInCallStatus retrieves the starter_in_call status for the given sessionUUID from the database.
func getStarterInCallStatus(sessionUUID string) (bool, error) {
	var starterInCall bool
	err := database.DB.QueryRow(`SELECT starter_in_call FROM game_sessions WHERE session_uuid = $1`, sessionUUID).Scan(&starterInCall)
	if err != nil {
		log.Printf("Error fetching starter_in_call status: %v", err)
		return false, err
	}
	return starterInCall, nil
}

// broadcastToSession sends a message to all clients in a session (identified by sessionUUID)
func broadcastToSessionSessionStarter(sessionUUID string, msg WebSocketMessageStarter) {
	clients := sessionClients[sessionUUID]
	for _, client := range clients {
		if err := client.conn.WriteJSON(msg); err != nil {
			log.Printf("Error broadcasting to client: %v", err)
		}
	}
}
