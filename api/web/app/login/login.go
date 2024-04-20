package login

import (
	"crypto/rand"
	"encoding/base64"
	"log"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/kolourr/commonlyodd/platform/authenticator"
)

// Handler for our login.
func Handler(auth *authenticator.Authenticator) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		state, err := generateRandomState()
		if err != nil {
			ctx.String(http.StatusInternalServerError, err.Error())
			return
		}

		log.Println("Generated state:", state)

		// Save the state inside the session.
		session := sessions.Default(ctx)
		log.Printf("Saving state %s in session", state)

		session.Set("state", state)
		if err := session.Save(); err != nil {
			log.Println("Failed to save session:", err)
			ctx.String(http.StatusInternalServerError, err.Error())
			return
		} else {
			log.Println("Session saved successfully")
		}

		log.Println("Redirecting to Auth0 for login")

		ctx.Redirect(http.StatusTemporaryRedirect, auth.AuthCodeURL(state))
	}
}

func generateRandomState() (string, error) {
	b := make([]byte, 32)
	_, err := rand.Read(b)
	if err != nil {
		return "", err
	}

	state := base64.StdEncoding.EncodeToString(b)

	return state, nil
}
