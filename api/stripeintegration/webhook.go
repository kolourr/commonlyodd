package stripeintegration

import (
	"io/ioutil"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/stripe/stripe-go/v76/webhook"
)

func WebhookHandler(c *gin.Context) {
	const MaxBodyBytes = int64(65536)
	req := c.Request
	bodyReader := http.MaxBytesReader(c.Writer, req.Body, MaxBodyBytes)
	payload, err := ioutil.ReadAll(bodyReader)
	if err != nil {
		log.Printf("Error reading request body: %v\n", err)
		c.Status(http.StatusServiceUnavailable)
		return
	}

	event, err := webhook.ConstructEvent(payload, req.Header.Get("Stripe-Signature"), os.Getenv("STRIPE_WEBHOOK_SECRET"))
	if err != nil {
		log.Printf("Webhook signature verification failed: %v\n", err)
		c.Status(http.StatusBadRequest)
		return
	}

	// Handle the event
	switch event.Type {
	case "checkout.session.completed":
		handleCheckoutSessionCompleted(event.Data.Object)
	case "customer.subscription.updated", "customer.subscription.created", "customer.subscription.deleted":
		handleSubscriptionEvent(event.Data.Object)
	// Add other cases as needed
	default:
		log.Printf("Unhandled event type: %s\n", event.Type)
	}

	c.Status(http.StatusOK)
}

func handleCheckoutSessionCompleted(object map[string]interface{}) {
	// Extract necessary information from object
	// Update your database accordingly
	log.Println("Checkout session completed")
}

func handleSubscriptionEvent(object map[string]interface{}) {
	// Extract necessary information from object
	// Update your database accordingly
	log.Println("Subscription event occurred")
}
