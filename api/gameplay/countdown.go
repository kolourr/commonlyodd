package gameplay

import (
	"time"

	"github.com/gorilla/websocket"
)

// This function starts a countdown and sends periodic updates to the client.
func startCountdown(conn *websocket.Conn, sessionUUID string, duration int) {
    ticker := time.NewTicker(1 * time.Second)
    defer ticker.Stop()

    for remaining := duration; remaining >= 0; remaining-- {
        select {
        case <-ticker.C:
              // Broadcast a timer update message
        timerMsg := WebSocketMessage{
            GameState: "timer_update",
            Timer:     remaining,
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
        GameState: "time_up",
    }
    broadcastToSession(sessionUUID, timeUpMsg)
}
