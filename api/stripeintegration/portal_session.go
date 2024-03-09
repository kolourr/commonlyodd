package stripeintegration

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/stripe/stripe-go/v76"
	portalsession "github.com/stripe/stripe-go/v76/billingportal/session"
)

func PortalSessionHandler(c *gin.Context) {
	ginSession := sessions.Default(c)
	customerID, customerIDExists := ginSession.Get("customerID").(string)

	if !customerIDExists {
		log.Println("Customer ID not found in session")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Customer ID required"})
		return
	}
	url := os.Getenv("APP_URL_DEV")

	params := &stripe.BillingPortalSessionParams{
		Customer:  stripe.String(customerID),
		ReturnURL: stripe.String(fmt.Sprintf("%s/user", url)),
	}
	ps, err := portalsession.New(params)
	if err != nil {
		log.Printf("portalsession.New: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create portal session"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"url": ps.URL})

}
