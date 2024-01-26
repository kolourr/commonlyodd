package gameplay

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/kolourr/commonlyodd/database"
)

type WebSocketMessage struct {
    GameState              string              `json:"game_state"`
    ObjsImageLinks         map[string]string   `json:"objs_image_links"` // obj1, obj2, obj3, img_link1, img_link2, img_link3
    OddReasonForSimilarity map[string]string   `json:"odd_reason_for_similarity"` // odd, reason for similarity
    IndividualTeamScore    float64      `json:"individual_team_score"`
    Timer                  int                 `json:"timer"`
    GameTeamsScore         []TeamScore         `json:"game_teams_score"` // team number/name with their score in JSON array
    GameWinner             string              `json:"game_winner"`
    TeamID                 int                 `json:"team_id"`
    TeamName               string              `json:"team_name"`
    NumberOfTeams          int                 `json:"number_of_teams"`
	TargetScore            float64              `json:"target_score"`
    TeamNameReceived      string              `json:"team_name_received"`
    IndividualTeamScoreReceived float64      `json:"individual_team_score_received"`
    TimeStamp             int              `json:"time_stamp"`
    TimeStampReceived      int              `json:"time_stamp_received"`
}


type TeamScore struct {
    TeamName string `json:"team_name"`
    Score    float64    `json:"score"`
}

type client struct {
    conn      *websocket.Conn
    isStarter bool
}


var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var gameDataMap = make(map[string]map[string]string)
var sessionClients = make(map[string][]client)


// HandleGameWebSocket manages the WebSocket connection and game state transitions
func HandleGameWebSocket(c *gin.Context) {
    sessionUUID := c.Query("sessionUUID")
    starterToken, hasToken := c.GetQuery("starterToken")

    conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
    if err != nil {
        log.Printf("Failed to set WebSocket upgrade: %v", err)
        return
    }

    if !validateSessionUUID(sessionUUID) {
        log.Printf("Invalid session UUID")
        conn.Close()
        return
    }

    isStarter := false
    if hasToken {
        isStarter = validateStarterToken(sessionUUID, starterToken)
    }
    addClientToSession(sessionUUID, conn, isStarter)
    defer removeClientFromSession(sessionUUID, conn)

    for {
        var msg WebSocketMessage
        err := conn.ReadJSON(&msg)
        if err != nil {
            log.Printf("Error reading json: %v", err)
            break
        }

        if isStarter {
            handleGameStateChange(conn, sessionUUID, msg)
        } else {
            log.Printf("Non-starter client attempted to control the game")
        }
    }
}

func validateSessionUUID(sessionUUID string) bool {
    var exists bool
    err := database.DB.QueryRow(`SELECT EXISTS(SELECT 1 FROM game_sessions WHERE session_uuid = $1)`, sessionUUID).Scan(&exists)
    if err != nil {
        log.Printf("Error querying database for session UUID validation: %v", err)
        return false
    }
    return exists
}

func validateStarterToken(sessionUUID, starterToken string) bool {
    var exists bool
    err := database.DB.QueryRow(`
        SELECT EXISTS(
            SELECT 1 FROM game_sessions
            WHERE session_uuid = $1 AND starter_token = $2
        )`, sessionUUID, starterToken).Scan(&exists)

    if err != nil {
        log.Printf("Error querying database for starter token validation: %v", err)
        return false
    }
    return exists
}


func addClientToSession(sessionUUID string, conn *websocket.Conn, isStarter bool) {
    sessionClients[sessionUUID] = append(sessionClients[sessionUUID], client{conn, isStarter})
}

func removeClientFromSession(sessionUUID string, conn *websocket.Conn) {
    clients := sessionClients[sessionUUID]
    for i, c := range clients {
        if c.conn == conn {
            sessionClients[sessionUUID] = append(clients[:i], clients[i+1:]...)
            break
        }
    }
}

func handleGameStateChange(conn *websocket.Conn, sessionUUID string, msg WebSocketMessage) {
        // Initialize gameDataMap for the session if it's nil
    if gameDataMap[sessionUUID] == nil {
        gameDataMap[sessionUUID] = make(map[string]string)
    }

    switch msg.GameState {
        case "start":
            handleStart(conn, sessionUUID, gameDataMap[sessionUUID])
        case "reveal":
            handleReveal(conn, sessionUUID, gameDataMap[sessionUUID])
        case "score":
            handleScore(conn, sessionUUID, msg)
        case "continue":
            handleContinue(conn, sessionUUID, msg, gameDataMap[sessionUUID])
        case "new-game":
            handleNewGame(conn, sessionUUID, msg, gameDataMap[sessionUUID])
        case "end":
            handleEndSession(conn, sessionUUID)
    }
}

