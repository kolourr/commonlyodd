package router

import (
	"encoding/gob"
	"net/http"
	"path/filepath"

	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"

	"github.com/kolourr/commonlyodd/gameplay"
	"github.com/kolourr/commonlyodd/platform/authenticator"
	"github.com/kolourr/commonlyodd/web/app/callback"
	"github.com/kolourr/commonlyodd/web/app/login"
	"github.com/kolourr/commonlyodd/web/app/logout"
	"github.com/kolourr/commonlyodd/web/app/user"
)

// New registers the routes and returns the router.
func New(auth *authenticator.Authenticator) *gin.Engine {
	router := gin.Default()
	router.GET("/debug/pprof/*any", gin.WrapH(http.DefaultServeMux))
	router.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{"POST", "GET", "PUT", "OPTIONS"},
		AllowHeaders: []string{
			"Content-Type",
			"Access-Control-Allow-Origin",
			"Access-Control-Allow-Headers",
		},
	}))

	// To store custom types in our cookies,
	// we must first register them using gob.Register
	gob.Register(map[string]interface{}{})
	store := cookie.NewStore([]byte("secret"))
	router.Use(sessions.Sessions("auth-session", store))

	staticFilesPath := "../../../ui/dist"
	router.Static("/static", staticFilesPath)
	router.StaticFile("/game", filepath.Join(staticFilesPath, "index.html"))

	// Setup routes
	router.GET("/health", func(ctx *gin.Context) {
		ctx.JSON(200, gin.H{
			"status": "UP",
		})
	})
	router.GET("/login", login.Handler(auth))
	router.GET("/callback", callback.Handler(auth))
	router.GET("/user", user.Handler)
	router.GET("/logout", logout.Handler)

	// Routes for starting a game
	router.POST("/start-session", gameplay.StartSession)
	router.POST("/end-session", gameplay.EndSessionEndpoint)
	router.POST("/generate-tokens", gameplay.GenerateTokens)
	router.GET("/ws", gameplay.HandleGameWebSocket)

	// Catch-all route to serve index.html for SPA routes
	router.NoRoute(func(c *gin.Context) {

		// Check if the request is for a static file
		if filepath.Ext(c.Request.URL.Path) != "" {
			// Let Gin handle static files (e.g., .js, .css, .png)
			c.Status(http.StatusNotFound)
		} else {
			// Serve index.html for any other requests
			c.File(filepath.Join(staticFilesPath, "index.html"))
		}
	})

	return router
}
