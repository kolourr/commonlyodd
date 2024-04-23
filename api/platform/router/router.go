package router

import (
	"encoding/gob"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/cookie"
	"github.com/gin-gonic/gin"

	"github.com/kolourr/commonlyodd/gameplay"
	"github.com/kolourr/commonlyodd/platform/authenticator"
	"github.com/kolourr/commonlyodd/platform/middleware"
	"github.com/kolourr/commonlyodd/stripeintegration"
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
		AllowOrigins: []string{
			"http://localhost:3000",
			"https://www.commonlyodd.com",
			"https://commonlyodd.com",
			"https://commonlyodd.onrender.com",
			"https://login.commonlyodd.com",
		},
		AllowMethods: []string{"POST", "GET", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders: []string{
			"Content-Type",
			"Access-Control-Allow-Origin",
			"Access-Control-Allow-Headers",
			"Authorization",

			// "Content-Type",
			// "Authorization",
			// "X-Requested-With",
		},
		AllowCredentials: true,
	}))

	// To store custom types in our cookies,
	// we must first register them using gob.Register
	gob.Register(map[string]interface{}{})
	store := cookie.NewStore([]byte("secret"))
	if os.Getenv("GIN_MODE") == "release" {
		// Production settings
		store.Options(sessions.Options{
			MaxAge:   86400 * 7,
			Domain:   ".commonlyodd.com",
			Path:     "/",
			Secure:   true,
			HttpOnly: true,
			SameSite: http.SameSiteNoneMode,
		})
	} else {
		// Development settings
		store.Options(sessions.Options{
			Path:     "/",
			Domain:   "localhost",
			Secure:   false,
			HttpOnly: true,
			SameSite: http.SameSiteLaxMode,
		})
	}

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
	router.GET("/user", middleware.IsAuthenticated, user.Handler)
	router.GET("/logout", logout.Handler)
	router.GET("/logout-auth", logOutAuthRedirectHandler)
	router.GET("/check-auth", isUserAuthenticated)

	// New route for starting a game
	router.POST("/start-session", middleware.IsAuthenticated, gameplay.StartSession)
	router.POST("/end-session", gameplay.EndSessionEndpoint)
	router.POST("/generate-tokens", gameplay.GenerateTokens)
	router.GET("/ws", gameplay.HandleGameWebSocket)
	router.POST("/session-starter-status", gameplay.StarterInCallStatus)
	router.POST("/create-checkout-session", middleware.IsAuthenticated, stripeintegration.CreateCheckoutSessionHandler)
	router.POST("/webhook", stripeintegration.WebhookHandler)
	router.POST("/portal", middleware.IsAuthenticated, stripeintegration.PortalSessionHandler)
	router.GET("/check-status", middleware.IsAuthenticated, stripeintegration.CheckSubStatus)
	router.DELETE("/delete-account", middleware.IsAuthenticated, stripeintegration.DeleteAccountHandler)

	//contact us email
	router.POST("/contact-us", stripeintegration.ContactUsEmail)

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

func logOutAuthRedirectHandler(ctx *gin.Context) {
	appURL := os.Getenv("APP_URL_DEV")
	if appURL == "" {
		appURL = "http://localhost:3000"
	}
	ctx.Redirect(http.StatusFound, appURL)
}

func isUserAuthenticated(ctx *gin.Context) {
	// Check if the session has a "profile" key
	session := sessions.Default(ctx)
	profile := session.Get("profile")

	// If the profile exists, the user is considered authenticated
	if profile != nil {
		ctx.JSON(http.StatusOK, gin.H{"authenticated": true})
	} else {
		// Respond with false if not authenticated
		ctx.JSON(http.StatusOK, gin.H{"authenticated": false})
	}

}
