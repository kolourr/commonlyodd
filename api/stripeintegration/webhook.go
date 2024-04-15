package stripeintegration

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"time"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"

	"github.com/kolourr/commonlyodd/database"
	"github.com/kolourr/commonlyodd/platform/authenticator"
	"github.com/stripe/stripe-go/v76"
	"github.com/stripe/stripe-go/v76/customer"
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
		handleSubscriptionUpdated(c, event)
	case "customer.subscription.deleted":
		handleSubscriptionDeleted(c, event)
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
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to find user for Stripe customer ID %s", subscription.Customer.ID)})
		return
	}

	subscriptionType := "active" // Default to active
	var trialStart, trialEnd *time.Time

	// Check if trialEnd is set by comparing against 0
	if subscription.TrialEnd > 0 {
		subscriptionType = "trial"
		tsStart := time.Unix(subscription.TrialStart, 0) // Assuming TrialStart also exists and follows similar pattern
		tsEnd := time.Unix(subscription.TrialEnd, 0)
		trialStart = &tsStart
		trialEnd = &tsEnd
	}

	// Insert or update the user's subscription information, including trial start and end
	executeSQL(`INSERT INTO Users (auth0_id, subscription_id, subscription_status, subscription_type, customer_id, trial_start, trial_end) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (customer_id) DO UPDATE SET auth0_id = EXCLUDED.auth0_id, subscription_id = EXCLUDED.subscription_id, subscription_status = EXCLUDED.subscription_status, subscription_type = EXCLUDED.subscription_type, trial_start = EXCLUDED.trial_start, trial_end = EXCLUDED.trial_end`,
		auth0ID, subscription.ID, subscription.Status, subscriptionType, subscription.Customer.ID, trialStart, trialEnd)

	fmt.Println("Subscription for user updated with new subscription details.")
	UpdateNewsletterSubs(subscription.ID)

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
	executeSQL("UPDATE Users SET subscription_status = $1, subscription_id = $2 WHERE customer_id = $3", "trial", subscriptionID, checkoutSession.Customer.ID)

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
	executeSQL("UPDATE Users SET last_payment_attempt = $1, subscription_status = $2 WHERE customer_id = $3", time.Now(), "active", invoice.Customer.ID)

	UpdateNewsletterSubs(invoice.Subscription.ID)
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

	UpdateNewsletterSubs(invoice.Subscription.ID)

	fmt.Println("Invoice payment failed")
}

func handleSubscriptionUpdated(c *gin.Context, event stripe.Event) {
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
	executeSQL("UPDATE Users SET subscription_status = $1, subscription_ends_at = $2, cancel_at_period_end = $3, subscription_type = $4, last_payment_attempt = $5 WHERE subscription_id = $6",
		subscription.Status, periodEnd, subscription.CancelAtPeriodEnd, subscriptionType, time.Now(), subscription.ID)

	UpdateNewsletterSubs(subscription.ID)

	fmt.Println("Subscription updated with new plan details.")
}

func handleSubscriptionDeleted(c *gin.Context, event stripe.Event) {
	var subscription stripe.Subscription
	err := json.Unmarshal(event.Data.Raw, &subscription)
	if err != nil {
		log.Printf("Error unmarshalling subscription: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error processing event"})
		return
	}

	// Assuming that the customer ID is stored in subscription.Customer.ID
	customerID := subscription.Customer.ID
	deleteNewsletterSub(customerID)

	// Delete the customer from the Users table using the customerID
	if customerID != "" {
		executeSQL("DELETE FROM Users WHERE customer_id = $1", customerID)
		log.Printf("User with customer ID %s deleted successfully", customerID)
		c.JSON(http.StatusOK, gin.H{"message": fmt.Sprintf("User with customer ID %s deleted successfully", customerID)})
	} else {
		log.Println("Customer ID is empty, unable to delete user")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Customer ID is empty, unable to delete user"})
	}
}

func deleteNewsletterSub(customerID string) error {
	// Setup for sending data to Sendy
	apiKey := os.Getenv("SENDY_API_KEY")
	listID := os.Getenv("SENDY_LIST_ID")
	apiURL := os.Getenv("SENDY_URL_DELETE")

	// SQL query to check subscription status from the database
	var email string
	err := database.DB.QueryRow("SELECT email FROM Users WHERE customer_id = $1", customerID).Scan(&email)
	if err != nil {
		log.Printf("Error querying email for customer_id %s: %v", customerID, err)
		return fmt.Errorf("failed to query email for customer_id %s: %v", customerID, err)
	}

	data := url.Values{
		"api_key": {apiKey},
		"list_id": {listID},
		"email":   {email},
		"boolean": {"true"},
	}

	response, err := http.PostForm(apiURL, data)
	if err != nil {
		return fmt.Errorf("failed to send delete request: %v", err)
	}
	defer response.Body.Close()

	body, err := io.ReadAll(response.Body)
	if err != nil {
		return fmt.Errorf("failed to read delete response: %v", err)
	}

	respStr := string(body)
	if respStr != "1" {
		return fmt.Errorf("delete failed with response: %s", respStr)
	}

	return nil
}

// Endpoint for deleting a user account
func DeleteAccountHandler(c *gin.Context) {
	session := sessions.Default(c)
	userID := session.Get("auth0ID").(string)
	auth0Full := session.Get("auth0Full").(string)

	// First, find the Stripe customer ID linked to the user
	var customerID string
	err := database.DB.QueryRow("SELECT customer_id FROM Users WHERE auth0_id = $1", userID).Scan(&customerID)
	if err != nil {
		log.Printf("Failed to find customer ID for user %s: %v", userID, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to find Stripe customer ID"})
		return
	}

	// Delete the Stripe customer
	_, err = customer.Del(customerID, nil)
	if err != nil {
		log.Printf("Failed to delete Stripe customer: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete Stripe customer"})
		return
	}

	// Delete the user from the newsletter
	if err := deleteNewsletterSub(customerID); err != nil {
		log.Printf("Failed to delete from newsletter: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete from newsletter"})
		return
	}
	// Delete the user from the database
	executeSQL("DELETE FROM Users WHERE auth0_id = $1", userID)
	// Delete the user from Auth0
	if err := authenticator.DeleteAuth0User(auth0Full); err != nil {
		log.Printf("Failed to delete Auth0 user: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete Auth0 user"})
		return
	}

	// Clear session data
	session.Clear()
	if err := session.Save(); err != nil {
		log.Printf("Failed to clear session: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to clear session"})
		return
	}

	c.JSON(http.StatusOK, "User account deleted successfully")
}
