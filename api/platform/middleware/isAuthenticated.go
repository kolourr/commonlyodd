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
	if profile == nil {
		log.Println("No profile found in session, aborting request.")
		ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
	} else {
		log.Printf("Profile found in session: %v", profile)
		ctx.Next()
	}
}
