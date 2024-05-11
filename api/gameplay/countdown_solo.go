package gameplay

import (
	"log"
	"time"

	"github.com/gorilla/websocket"
)

var cancelCountdownSolo chan bool = make(chan bool, 1)

// Before starting a new countdown
func drainChannelSolo(ch chan bool) {
	for {
		select {
		case <-ch:
			// continue draining
		default:
			// if there's nothing more to drain, return
			return
		}
	}
}

// Start a countdown and send periodic updates to the client.
func startCountdownSolo(conn *websocket.Conn, sessionUUID string, duration int) {

	// Drain the channel to remove any pending signals that weren't cleared
	drainChannelSolo(cancelCountdownSolo)
	cancelCountdownSolo = make(chan bool, 1)

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
			// Listen for cancellation signal
		case <-cancelCountdownSolo:
			log.Println("Received cancellation solo signal. Exiting countdown.")
			return

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
