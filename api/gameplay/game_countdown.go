package gameplay

import (
	"log"
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
            // Send a timer update message
            msg := WebSocketMessage{
                GameState: "timer_update",
                Timer:     remaining,
            }
            if err := conn.WriteJSON(msg); err != nil {
                log.Printf("Error sending timer update: %v", err)
                return
            }
        }

        if remaining == 0 {
            // Timer has reached zero
            break
        }
    }

    // After the countdown, you can send a 'time_up' message or handle it as needed
    msg := WebSocketMessage{
        GameState: "time_up",
    }
    if err := conn.WriteJSON(msg); err != nil {
        log.Printf("Error sending time up message: %v", err)
    }
}
