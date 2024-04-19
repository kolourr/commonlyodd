package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/joho/godotenv"
	"github.com/kolourr/commonlyodd/database"
	"github.com/kolourr/commonlyodd/platform/authenticator"
	"github.com/kolourr/commonlyodd/platform/router"
	"github.com/stripe/stripe-go/v76"
)

func main() {
	// Set environment variables
	env := os.Getenv("APP_ENV")
	if env == "" {
		env = "local"
	}

	// Load environment variables from file only if local
	if env == "local" {
		envFilePath := filepath.Join("config", ".env.local")
		if err := godotenv.Load(envFilePath); err != nil {
			log.Fatalf("Error loading %s file", envFilePath)
		}
	}

	databaseURL := os.Getenv("DATABASE_URL")
	database.InitDB(databaseURL)

	// This is your test secret API key.
	stripe.Key = os.Getenv("STRIPE_KEY")

	//initiate auth0 authenticator
	auth, err := authenticator.New()
	if err != nil {
		log.Fatalf("Failed to initialize the authenticator: %v", err)
	}

	//Setup router and server
	rtr := router.New(auth)
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Start server
	log.Printf("Starting server on port %s", port)
	if err := http.ListenAndServe(":"+port, rtr); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}

}
