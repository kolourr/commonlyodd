package gameplay

import "log"

// broadcastToSession sends a message to all clients in a session (identified by sessionUUID)
func broadcastToSession(sessionUUID string, msg WebSocketMessage) {
	clients := sessionClients[sessionUUID]
	for _, client := range clients {
		if err := client.conn.WriteJSON(msg); err != nil {
			log.Printf("Error broadcasting to client: %v", err)
		}
	}
}
