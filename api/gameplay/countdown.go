package gameplay

import (
	"log"
	"time"

	"github.com/gorilla/websocket"
)

// Start a countdown and send periodic updates to the client.
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

        // Fetch session details
    numberOfTeams, targetScore, err := FetchSessionDetails(sessionUUID)
    if err != nil {
        log.Printf("Error fetching session details: %v", err)
        return
    }


    // Broadcast the 'time_up' message
    timeUpMsg := WebSocketMessage{
        GameState: "time_up",
        NumberOfTeams: numberOfTeams,
        TargetScore: targetScore,
    }
    broadcastToSession(sessionUUID, timeUpMsg)
}
