package callback

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/kolourr/commonlyodd/platform/authenticator"
)

// Handler for our callback.
func Handler(auth *authenticator.Authenticator) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		session := sessions.Default(ctx)
		appURL := os.Getenv("APP_URL_DEV")

		if ctx.Query("state") != session.Get("state") {
			log.Printf("Invalid state parameter: received %s, expected %s", ctx.Query("state"), session.Get("state"))
			ctx.String(http.StatusBadRequest, "Invalid state parameter.")
			return
		}

		// Check if there is an error parameter which indicates the user denied the request
		if errorDesc := ctx.Query("error_description"); errorDesc != "" {
			log.Printf("Error from Auth0: %s", errorDesc)
			ctx.Redirect(http.StatusFound, appURL)
			return
		}

		// Exchange an authorization code for a token.
		token, err := auth.Exchange(ctx.Request.Context(), ctx.Query("code"))
		if err != nil {
			log.Printf("Failed to exchange code for token: %v", err)
			ctx.String(http.StatusUnauthorized, "Failed to exchange an authorization code for a token.")
			return
		}

		idToken, err := auth.VerifyIDToken(ctx.Request.Context(), token)
		if err != nil {
			log.Printf("Failed to verify ID Token: %v", err)
			ctx.String(http.StatusInternalServerError, "Failed to verify ID Token.")
			return
		}

		var profile map[string]interface{}
		if err := idToken.Claims(&profile); err != nil {
			log.Printf("Failed to get claims from ID Token: %v", err)
			ctx.String(http.StatusInternalServerError, err.Error())
			return
		}

		log.Printf("Profile retrieved: %v", profile)
		session.Set("access_token", token.AccessToken)
		session.Set("profile", profile)
		if err := session.Save(); err != nil {
			ctx.String(http.StatusInternalServerError, err.Error())
			return
		}

		joinLink := fmt.Sprintf("%s/user", appURL)

		log.Printf("Redirecting to user page: %s", joinLink)
		ctx.Redirect(http.StatusFound, joinLink)
	}
}
