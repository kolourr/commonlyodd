package gameplay

import (
	"log"
	"time"

	"github.com/gorilla/websocket"
)

// Start a countdown and send periodic updates to the client.
func startCountdownSolo(conn *websocket.Conn, sessionUUID string, duration int) {

	// Fetch the starter_in_call status from the database
	starterInCall, err := getStarterInCallStatus(sessionUUID)
	if err != nil {
		log.Printf("Failed to fetch starter_in_call status: %v", err)
		return
	}

	ticker := time.NewTicker(1 * time.Second)
	defer ticker.Stop()

	for remaining := duration; remaining >= 0; remaining-- {
		select {
		case <-ticker.C:
			// Broadcast a timer update message
			timerMsg := WebSocketMessage{
				GameState:     "timer_update_solo",
				Timer:         remaining,
				StarterInCall: starterInCall,
			}
			broadcastToSession(sessionUUID, timerMsg)

		}

		if remaining == 0 {
			// Timer has reached zero
			break
		}
	}

	// Broadcast the 'time_up' message
	timeUpMsg := WebSocketMessage{
		GameState:     "time_up_solo",
		StarterInCall: starterInCall,
	}
	broadcastToSession(sessionUUID, timeUpMsg)
}
