package stripeintegration

import (
	"database/sql"
	"log"
	"net/http"
	"time"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/kolourr/commonlyodd/database"
)

func CheckSubStatus(c *gin.Context) {
	ginSession := sessions.Default(c)
	customerID, customerIDExists := ginSession.Get("customerID").(string)

	if !customerIDExists {
		log.Println("Customer ID not found in session")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Customer ID required"})
		return
	}

	// SQL query to check subscription status from the database
	var subscriptionStatus sql.NullString
	var trialEnd sql.NullTime
	err := database.DB.QueryRow("SELECT subscription_status, trial_end FROM Users WHERE customer_id = $1", customerID).Scan(&subscriptionStatus, &trialEnd)
	if err != nil {
		log.Printf("Error querying subscription status for customer ID %s: %v", customerID, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to query subscription status"})
		return
	}

	now := time.Now()
	trial := false
	status := false

	// If subscriptionStatus is NULL, set it to false
	if !subscriptionStatus.Valid {
		subscriptionStatus.String = ""
	}

	// Check the conditions
	if trialEnd.Valid && trialEnd.Time.After(now) && subscriptionStatus.String == "" {
		// User just joined and has a trial
		trial = true
		status = false
	} else if trialEnd.Valid && trialEnd.Time.Before(now) && subscriptionStatus.String == "" {
		// User has no subscription status and their trial has run out
		trial = false
		status = false
	} else if subscriptionStatus.String == "active" || subscriptionStatus.String == "trialing" {
		// User has a positive subscription status
		status = true
		trial = false
	} else if subscriptionStatus.String == "" && trialEnd.Valid && trialEnd.Time.Before(now) {
		// User no longer has a subscription and their trial has expired
		trial = false
		status = false
	}

	log.Println("Trial:", trial)
	log.Println("Status:", status)

	c.JSON(http.StatusOK, gin.H{"trial": trial, "status": status})
}
