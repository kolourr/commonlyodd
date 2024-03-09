package stripeintegration

import (
	"database/sql"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"time"

	"github.com/kolourr/commonlyodd/database"
	_ "github.com/lib/pq"
)

func updateNewsletterSubs(subscription_id string) error {
	query := `SELECT email, subscription_status, subscription_type, subscription_ends_at, last_payment_attempt, cancel_at_period_end FROM users WHERE subscription_id=$1`

	var email, subscription_status, subscription_type, cancel_at_period_end string
	var subscription_ends_at, last_payment_attempt sql.NullTime

	err := database.DB.QueryRow(query, subscription_id).Scan(&email, &subscription_status, &subscription_type, &subscription_ends_at, &last_payment_attempt, &cancel_at_period_end)
	if err != nil {
		return fmt.Errorf("failed to query user information: %v", err)
	}

	subscriptionEndsAtStr := ""
	if subscription_ends_at.Valid {
		subscriptionEndsAtStr = subscription_ends_at.Time.Format(time.RFC3339)

	}
	lastPaymentAttemptStr := ""
	if last_payment_attempt.Valid {
		lastPaymentAttemptStr = last_payment_attempt.Time.Format(time.RFC3339)
	}

	// Setup for sending data to Sendy
	apiKey := os.Getenv("SENDY_API_KEY")
	listID := os.Getenv("SENDY_LIST_ID")
	apiURL := os.Getenv("SENDY_URL_SUBSCRIBE")

	data := url.Values{
		"api_key":              {apiKey},
		"list":                 {listID},
		"email":                {email},
		"subscription_id":      {subscription_id},
		"subscription_status":  {subscription_status},
		"subscription_type":    {subscription_type},
		"subscription_ends_at": {subscriptionEndsAtStr},
		"last_payment_attempt": {lastPaymentAttemptStr},
		"cancel_at_period_end": {cancel_at_period_end},
		"boolean":              {"true"},
	}

	response, err := http.PostForm(apiURL, data)
	if err != nil {
		return fmt.Errorf("failed to send subscription request: %v", err)
	}
	defer response.Body.Close()

	body, err := io.ReadAll(response.Body)
	if err != nil {
		return fmt.Errorf("failed to read subscription response: %v", err)
	}

	respStr := string(body)
	if respStr != "1" {
		return fmt.Errorf("subscription failed with response: %s", respStr)
	}

	return nil
}
