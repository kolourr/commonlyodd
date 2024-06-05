package stripeintegration

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	stripe "github.com/stripe/stripe-go/v76"
	checkoutSession "github.com/stripe/stripe-go/v76/checkout/session"
)

func CreateCheckoutSessionHandler(c *gin.Context) {
	priceID := c.Query("price_id")

	// Pass customer id from session
	ginSession := sessions.Default(c)
	customerID, customerIDExists := ginSession.Get("customerID").(string)

	if !customerIDExists {
		log.Println("Customer ID not found in session")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email or Customer ID required"})
		return
	}
	url := os.Getenv("APP_URL_DEV")

	sessionParams := &stripe.CheckoutSessionParams{
		PaymentMethodTypes: stripe.StringSlice([]string{"card"}),
		Customer:           stripe.String(customerID),
		LineItems: []*stripe.CheckoutSessionLineItemParams{
			{
				Price:    stripe.String(priceID),
				Quantity: stripe.Int64(1),
			},
		},
		Mode:       stripe.String(string(stripe.CheckoutSessionModeSubscription)),
		SuccessURL: stripe.String(fmt.Sprintf("%s/success?session_id={CHECKOUT_SESSION_ID}", url)),
		CancelURL:  stripe.String(fmt.Sprintf("%s/cancel", url)),
		// SubscriptionData: &stripe.CheckoutSessionSubscriptionDataParams{
		// 	TrialPeriodDays: stripe.Int64(7),
		// },
	}

	s, err := checkoutSession.New(sessionParams)
	if err != nil {
		log.Printf("checkoutSession.New: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create checkout session"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"url": s.URL})
}
