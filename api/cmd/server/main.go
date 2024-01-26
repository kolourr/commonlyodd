package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/kolourr/commonlyodd/database"
	"github.com/kolourr/commonlyodd/gameplay"
)

func main() {
	// Set environment variables
	//Before running your application locally, set the APP_ENV variable to local or development: export APP_ENV=local
	env := os.Getenv("APP_ENV")
	if env == "" {
		env = "local" // default to local
	}
	envFilePath := filepath.Join("config", ".env."+env)
	err := godotenv.Load(envFilePath)
	if err != nil {
		log.Fatalf("Error loading %s file", envFilePath)
	}
	databaseURL := os.Getenv("DATABASE_URL")
 	database.InitDB(databaseURL)

	// Path to the static files
	staticFilesPath := "../../../ui/dist"

	// absPath, _ := filepath.Abs(staticFilesPath)
 	// log.Println("Serving static files from:", absPath)



	// Setup gin router
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
    router.Static("/static", staticFilesPath)
    router.StaticFile("/", filepath.Join(staticFilesPath, "index.html"))


	// Setup routes
	router.GET("/health", func(ctx *gin.Context) {
		ctx.JSON(200, gin.H{
			"status": "UP",
		})
	})


	// New route for starting a game
    router.POST("/start-session", gameplay.StartSession)
	router.POST("/end-session", gameplay.EndSessionEndpoint)
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


	//Start server
	router.Run(":8080")

}


