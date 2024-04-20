package middleware

import (
	"log"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

// IsAuthenticated is a middleware that checks if
// the user has already been authenticated previously.
func IsAuthenticated(ctx *gin.Context) {
	session := sessions.Default(ctx)
	profile := session.Get("profile")
	log.Printf("Current session data: %+v", session)

	if profile == nil {
		log.Println("Unauthorized access - No profile found in session")
		ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
	} else {
		log.Printf("User is authenticated - Profile: %+v", profile)
		ctx.Next()
	}

}
