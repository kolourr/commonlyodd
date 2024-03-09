package stripeintegration

import (
	"log"
	"net/http"

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
	var subscriptionStatus string
	err := database.DB.QueryRow("SELECT subscription_status FROM Users WHERE customer_id = $1", customerID).Scan(&subscriptionStatus)
	if err != nil {
		log.Printf("Error querying subscription status for customer ID %s: %v", customerID, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to query subscription status"})
		return
	}

	// Check if the subscription status is 'active'
	if subscriptionStatus == "active" {
		c.JSON(http.StatusOK, gin.H{"status": true})
	} else {
		c.JSON(http.StatusOK, gin.H{"status": false})
	}
}
