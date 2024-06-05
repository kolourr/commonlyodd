package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/joho/godotenv"
	"github.com/kolourr/commonlyodd/database"
	"github.com/kolourr/commonlyodd/gameplay"
	"github.com/kolourr/commonlyodd/platform/authenticator"
	"github.com/kolourr/commonlyodd/platform/router"
	"github.com/stripe/stripe-go/v76"
)

func removeExpiredTrials() {
	now := time.Now()
	query := "UPDATE Users SET trial_end = NULL WHERE trial_end IS NOT NULL AND trial_end <= $1"
	_, err := database.DB.Exec(query, now)
	if err != nil {
		log.Printf("Error removing expired trials: %v", err)
	}
}

func startTrialCleaner() {
	go func() {
		for {
			removeExpiredTrials()
			time.Sleep(5 * time.Minute)
		}
	}()
}

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
	stripe.Key = os.Getenv("STRIPE_KEY")
	gameplay.Rdb = gameplay.InitRedisClient()

	//initiate auth0 authenticator
	auth, err := authenticator.New()
	if err != nil {
		log.Fatalf("Failed to initialize the authenticator: %v", err)
	}

	startTrialCleaner()

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
