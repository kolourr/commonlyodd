package main

import (
	"log"
	"os"
	"path/filepath"

	"github.com/joho/godotenv"
	"github.com/kolourr/commonlyodd/database"
	"github.com/kolourr/commonlyodd/platform/authenticator"
	"github.com/kolourr/commonlyodd/platform/router"
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

	//initiate auth0 authenticator
	auth, err := authenticator.New()
	if err != nil {
		log.Fatalf("Failed to initialize the authenticator: %v", err)
	}

	rtr := router.New(auth)

	//Start server
	rtr.Run(":8080")

}
