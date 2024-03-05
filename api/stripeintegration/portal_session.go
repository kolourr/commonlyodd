package stripeintegration

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/stripe/stripe-go/v76"
	portalsession "github.com/stripe/stripe-go/v76/billingportal/session"
)

func CreatePortalSessionHandler(c *gin.Context) {
	customerID := c.Query("customer_id") // Assume you pass the customer ID in some way

	params := &stripe.BillingPortalSessionParams{
		Customer:  stripe.String(customerID),
		ReturnURL: stripe.String("http://localhost:3000/return-after-portal"),
	}
	ps, err := portalsession.New(params)
	if err != nil {
		log.Printf("portalsession.New: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create portal session"})
		return
	}

	c.Redirect(http.StatusFound, ps.URL)
}
