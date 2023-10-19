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
	"github.com/kolourr/commonlyodd/info"
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

	// Setup routes
	router.GET("/health", func(ctx *gin.Context) {
		ctx.JSON(200, gin.H{
			"status": "UP",
		})
	})

	router.GET("/about",  info.About)
	router.GET("/contact", info.Contact)
	router.GET("/rules", info.Rules)

	//Start server
	router.Run(":8080")

}


