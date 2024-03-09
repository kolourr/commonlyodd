package stripeintegration

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/kolourr/commonlyodd/database"
	"github.com/stripe/stripe-go/v76"
	"github.com/stripe/stripe-go/v76/webhook"
)

func executeSQL(query string, args ...interface{}) {
	_, err := database.DB.Exec(query, args...)
	if err != nil {
		log.Printf("Failed to execute SQL query: %v", err)
	}
}

func WebhookHandler(c *gin.Context) {
	payload, err := io.ReadAll(c.Request.Body)
	if err != nil {
		log.Printf("Error reading request body: %v", err)
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "Error reading request body"})
		return
	}

	webhookSecret := os.Getenv("STRIPE_TEST_WEBHOOK_SECRET")

	event, err := webhook.ConstructEvent(payload, c.Request.Header.Get("Stripe-Signature"), webhookSecret)
	if err != nil {
		log.Printf("Error verifying webhook signature: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Webhook signature verification failed"})
		return
	}

	// Dispatch to specific handlers based on event type
	switch event.Type {
	case "customer.subscription.created":
		handleSubscriptionCreated(c, event)
	case "customer.subscription.updated":
		handleSubscriptionUpdatedDeleted(c, event)
	case "customer.subscription.deleted":
		handleSubscriptionUpdatedDeleted(c, event)
	case "invoice.paid":
		handleInvoicePaid(c, event)
	case "invoice.payment_failed":
		handleInvoicePaymentFailed(c, event)
	case "checkout.session.completed":
		handleCheckoutSessionCompleted(c, event)
	default:
		fmt.Printf("Unhandled event type")
		// fmt.Printf("Unhandled event type: %s\n", event.Type)
	}

	c.JSON(http.StatusOK, gin.H{"received": true})
}

func handleSubscriptionCreated(c *gin.Context, event stripe.Event) {
	var subscription stripe.Subscription
	err := json.Unmarshal(event.Data.Raw, &subscription)
	if err != nil {
		log.Printf("Error unmarshalling subscription: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error processing event"})
		return
	}

	// First, retrieve the auth0_id using subscription.Customer.ID
	var auth0ID string
	err = database.DB.QueryRow("SELECT auth0_id FROM Users WHERE customer_id = $1", subscription.Customer.ID).Scan(&auth0ID)
	if err != nil {
		log.Printf("Could not find user with customer ID %s: %v", subscription.Customer.ID, err)
		// If you cannot find a user, you may need to decide how to handle this. For now, we return an error.
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to find user for Stripe customer ID %s", subscription.Customer.ID)})
		return
	}

	//  Extract subscription type from subscription
	subscriptionType := subscription.Items.Data[0].Plan.Interval

	// Now, update or create subscription in the database with auth0_id
	executeSQL("INSERT INTO Users (auth0_id, subscription_id, subscription_status, subscription_type, customer_id) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (customer_id) DO UPDATE SET auth0_id = EXCLUDED.auth0_id, subscription_id = EXCLUDED.subscription_id, subscription_status = EXCLUDED.subscription_status, subscription_type = EXCLUDED.subscription_type",
		auth0ID, subscription.ID, subscription.Status, subscriptionType, subscription.Customer.ID)

	updateNewsletterSubs(subscription.Customer.ID)

	fmt.Println("Subscription for user updated with new subscription details.")
	c.JSON(http.StatusOK, gin.H{"received": true})
}

func handleCheckoutSessionCompleted(c *gin.Context, event stripe.Event) {
	var checkoutSession stripe.CheckoutSession
	err := json.Unmarshal(event.Data.Raw, &checkoutSession)
	if err != nil {
		log.Printf("Error unmarshalling checkout session: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error processing event"})
		return
	}

	// Extract subscription ID from checkout session
	subscriptionID := checkoutSession.Subscription.ID

	// Update user's subscription status to 'active'
	executeSQL("UPDATE Users SET subscription_status = $1, subscription_id = $2 WHERE customer_id = $3", "active", subscriptionID, checkoutSession.Customer.ID)

	updateNewsletterSubs(checkoutSession.Customer.ID)

	fmt.Println("Checkout session completed")
}

func handleInvoicePaid(c *gin.Context, event stripe.Event) {
	var invoice stripe.Invoice
	err := json.Unmarshal(event.Data.Raw, &invoice)
	if err != nil {
		log.Printf("Error unmarshalling invoice: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error processing event"})
		return
	}

	// Log payment success
	executeSQL("UPDATE Users SET last_payment_attempt = $1 WHERE customer_id = $2", time.Now(), invoice.Customer.ID)
	updateNewsletterSubs(invoice.Customer.ID)
	fmt.Println("Invoice paid")
}

func handleInvoicePaymentFailed(c *gin.Context, event stripe.Event) {
	var invoice stripe.Invoice
	err := json.Unmarshal(event.Data.Raw, &invoice)
	if err != nil {
		log.Printf("Error unmarshalling invoice: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error processing event"})
		return
	}

	// Update subscription status to 'past_due'
	executeSQL("UPDATE Users SET subscription_status = $1, last_payment_attempt = $2 WHERE customer_id = $3", "past_due", time.Now(), invoice.Customer.ID)

	updateNewsletterSubs(invoice.Customer.ID)

	fmt.Println("Invoice payment failed")
}

func handleSubscriptionUpdatedDeleted(c *gin.Context, event stripe.Event) {
	var subscription stripe.Subscription
	err := json.Unmarshal(event.Data.Raw, &subscription)
	if err != nil {
		log.Printf("Error unmarshalling subscription: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error processing event"})
		return
	}

	// Convert CurrentPeriodEnd (UNIX timestamp) to a Go time.Time
	periodEnd := time.Unix(subscription.CurrentPeriodEnd, 0)

	// Extract subscription type from the updated subscription plan interval
	subscriptionType := subscription.Items.Data[0].Plan.Interval

	// Extract necessary information and update subscription details including subscription_type
	executeSQL("UPDATE Users SET subscription_status = $1, subscription_ends_at = $2, cancel_at_period_end = $3, subscription_type = $4 WHERE subscription_id = $5",
		subscription.Status, periodEnd, subscription.CancelAtPeriodEnd, subscriptionType, subscription.ID)

	updateNewsletterSubs(subscription.ID)

	fmt.Println("Subscription updated with new plan details.")
}
