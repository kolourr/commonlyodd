package gameplay

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/kolourr/commonlyodd/database"
)


type WebSocketMessage struct {
    GameState             string              `json:"game_state"`
    ObjsImageLinks        map[string]string   `json:"objs_image_links"` // obj1, obj2, obj3, img_link1, img_link2, img_link3
    OddReasonForSimilarity map[string]string  `json:"odd_reason_for_similarity"` // odd, reason for similarity
    IndividualTeamScore   map[string]int      `json:"individual_team_score"` // team number/name with their score
    Timer                 int                 `json:"timer"`
    GameTeamsScore        []TeamScore         `json:"game_teams_score"` // team number/name with their score in JSON array
    GameWinner            string              `json:"game_winner"`
}

type TeamScore struct {
    TeamName string `json:"team_name"`
    Score    int    `json:"score"`
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var gameDataMap = make(map[string]map[string]string)


// HandleGameWebSocket manages the WebSocket connection and game state transitions
func HandleGameWebSocket(c *gin.Context) {
    starterToken := c.GetHeader("Starter-Token")
    sessionUUID := c.GetHeader("Session-UUID")

    conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
    if err != nil {
        log.Printf("Failed to set WebSocket upgrade: %v", err)
        return
    }

    // Validate starterToken and sessionUUID to ensure only session starter can connect
    if !validateSessionStarter(starterToken, sessionUUID) {
        log.Printf("Invalid starter token or session UUID")
        conn.Close() // Close the WebSocket connection if validation fails
        return
    }

	    // Check if game data for this session exists, if not create it
        if _, exists := gameDataMap[sessionUUID]; !exists {
            gameDataMap[sessionUUID] = make(map[string]string)
        }


    for {
        var msg WebSocketMessage
        err := conn.ReadJSON(&msg)
        if err != nil {
            // Handle error, remove client from management
            log.Printf("Error reading json: %v", err)
            break
        }

        // Delegate message handling based on game state
        switch msg.GameState {
        case "start":
            handleStart(conn, sessionUUID, gameDataMap[sessionUUID])
        case "reveal":
            handleReveal(conn, sessionUUID, gameDataMap[sessionUUID])
        case "score":
            handleScore(conn, sessionUUID, msg)
        case "continue":
            handleContinue(conn, sessionUUID)
        case "end":
            handleEndSession(conn, sessionUUID)
        // Add other cases as necessary
        }
    }
}


func validateSessionStarter(starterToken, sessionUUID string) bool {
    var exists bool

    err := database.DB.QueryRow(`
        SELECT EXISTS(
            SELECT 1 FROM game_sessions
            WHERE session_uuid = $1 AND starter_token = $2
        )`, sessionUUID, starterToken).Scan(&exists)

    if err != nil {
        if err != sql.ErrNoRows {
            log.Printf("Error querying database: %v", err)
        }
        return false
    }

    return exists
}
