package user

import (
	"log"
	"net/http"
	"strings"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/kolourr/commonlyodd/database"
	_ "github.com/lib/pq"
)

func insertUser(auth0ID, email, connection, firstName, pictureURL string) error {
	query := `
		INSERT INTO Users (auth0_id, email, connection, first_name, picture_url)
		VALUES ($1, $2, $3, $4, $5)
		ON CONFLICT (auth0_id) DO NOTHING
	`
	_, err := database.DB.Exec(query, auth0ID, email, connection, firstName, pictureURL)
	return err
}

// Handler for our logged-in user page.
func Handler(ctx *gin.Context) {
	session := sessions.Default(ctx)

	profile, ok := session.Get("profile").(map[string]interface{})
	if !ok {
		log.Println("Failed to assert profile type")
		return
	}

	firstName, exists := profile["given_name"].(string)
	if !exists {
		log.Println("Auth0 ID not found in profile")
		return
	}

	pictureURL, exists := profile["picture"].(string)
	if !exists {
		log.Println("Picture URL not found in profile")
		return
	}

	auth0ID, exists := profile["sub"].(string)
	if !exists {
		log.Println("Auth0 ID not found in profile")
		return
	}
	parts := strings.Split(auth0ID, "|")

	if len(parts) != 2 {
		log.Println("Unexpected format for Auth0 ID")
		return
	}

	connection := parts[0]
	userID := parts[1]

	email, exists := profile["email"].(string)
	if !exists {
		log.Println("Email not found in profile")
		return
	}

	err := insertUser(userID, email, connection, firstName, pictureURL)
	if err != nil {
		log.Println("Error inserting user:", err)
		return
	}

	// This is the user page.
	ctx.JSON(http.StatusOK, gin.H{
		"firstName":  firstName,
		"pictureURL": pictureURL,
	})

}
