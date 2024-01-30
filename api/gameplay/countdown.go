package gameplay

import (
	"log"
	"time"

	"github.com/gorilla/websocket"
)

// Start a countdown and send periodic updates to the client.
func startCountdown(conn *websocket.Conn, sessionUUID string, duration int) {

    // Fetch current team scores
    teamScores, err := fetchTeamScores(sessionUUID)
    if err != nil {
        log.Printf("Error fetching team scores: %v", err)
        return
    }

    // Fetch session details
    numberOfTeams, targetScore, err := FetchSessionDetails(sessionUUID)
    if err != nil {
        log.Printf("Error fetching session details: %v", err)
        return
    }


    ticker := time.NewTicker(1 * time.Second)
    defer ticker.Stop()

    for remaining := duration; remaining >= 0; remaining-- {
        select {
        case <-ticker.C:
                // Broadcast a timer update message
                timerMsg := WebSocketMessage{
                    GameState: "timer_update",
                    Timer:     remaining,
                    GameTeamsScore: teamScores,
                    NumberOfTeams: numberOfTeams,
                    TargetScore: targetScore,
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
        GameTeamsScore: teamScores,
        NumberOfTeams: numberOfTeams,
        TargetScore: targetScore,

     }
    broadcastToSession(sessionUUID, timeUpMsg)
}
