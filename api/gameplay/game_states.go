package gameplay

import (
	"log"

	"github.com/gorilla/websocket"
	"github.com/kolourr/commonlyodd/database"
)

func handleStart(conn *websocket.Conn, sessionUUID string, gameData map[string]string) {
    // Update game state to 'start' in the database
    if err := updateGameStateInDB(sessionUUID, "start"); err != nil {
        log.Printf("Error updating game state: %v", err)
        return
    }

    // Fetch a random question and image links
    questionData, err := fetchRandomQuestion(sessionUUID)
    if err != nil {
        log.Printf("Error fetching question: %v", err)
        return
    }

    // Store odd and reason for similarity in gameData map
    gameData["odd"] = questionData["odd"]
    gameData["reason"] = questionData["reason"]

    // Remove odd and reason before sending to client
    delete(questionData, "odd")
    delete(questionData, "reason")

    // Send start message
    msg := WebSocketMessage{
        GameState:     "start",
        ObjsImageLinks: questionData,
        // Timer field is not needed here as the countdown will be managed by startCountdown
    }
    if err := conn.WriteJSON(msg); err != nil {
        log.Printf("Error sending start message: %v", err)
    }

    // Start a 20-second timer in a separate goroutine
    go startCountdown(conn, sessionUUID, 20)
}


// handleReveal processes the 'reveal' game state
func handleReveal(conn *websocket.Conn, sessionUUID string, gameData map[string]string) {
    msg := WebSocketMessage{
        GameState: "reveal",
        OddReasonForSimilarity: map[string]string{
            "odd":    gameData["odd"],
            "reason": gameData["reason"],
        },
    }
    if err := conn.WriteJSON(msg); err != nil {
        log.Printf("Error sending reveal message: %v", err)
    }

    // Optionally, clear the data for the next question
    delete(gameData, "odd")
    delete(gameData, "reason")
}


// handleScore processes the 'score' game state
func handleScore(conn *websocket.Conn, sessionUUID string, msg WebSocketMessage) {
    // Logic to update scores
    updateGameState(conn, sessionUUID, "update_score", /* other parameters */)
    // Check if target score is reached and handle accordingly
}

// handleContinue processes the 'continue' game state
func handleContinue(conn *websocket.Conn, sessionUUID string) {
    // Logic to continue to the next question
    updateGameState(conn, sessionUUID, "next_question", /* other parameters */)
}

// handleEndSession processes the 'end' game state
func handleEndSession(conn *websocket.Conn, sessionUUID string) {
    // Logic to end the game session
    updateGameState(conn, sessionUUID, "end_session", /* other parameters */)
}

// updateGameState sends the updated game state to the client
func updateGameState(conn *websocket.Conn, sessionUUID string, gameState string, /* other parameters */) {
    // Construct and send the updated game state message
    msg := WebSocketMessage{
        GameState: gameState,
        // Populate other fields based on the current game state
    }
    conn.WriteJSON(msg)
}

func updateGameStateInDB(sessionUUID string, state string) error {
    _, err := database.DB.Exec(`
        UPDATE game_sessions
        SET game_state = $1
        WHERE session_uuid = $2`,
        state, sessionUUID)
    return err
}
