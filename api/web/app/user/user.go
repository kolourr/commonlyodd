package user

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/kolourr/commonlyodd/database"
	"github.com/kolourr/commonlyodd/stripeintegration"
	_ "github.com/lib/pq"
)

func insertUser(auth0ID, email, connection, firstName, pictureURL, customerID string, dateJoined time.Time) error {
	query := `
        INSERT INTO Users (auth0_id, email, connection, first_name, picture_url, customer_id, date_joined)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (auth0_id) DO NOTHING
    `
	_, err := database.DB.Exec(query, auth0ID, email, connection, firstName, pictureURL, customerID, dateJoined)
	return err
}

func subscribeToNewsletter(firstName, email, userID, customerID string, dateJoined time.Time) error {
	apiKey := os.Getenv("SENDY_API_KEY")
	listID := os.Getenv("SENDY_LIST_ID")
	apiURL := os.Getenv("SENDY_URL_SUBSCRIBE")

	data := url.Values{
		"api_key":     {apiKey},
		"name":        {firstName},
		"email":       {email},
		"list":        {listID},
		"auth0_id":    {userID},
		"customer_id": {customerID},
		"date_joined": {dateJoined.Format(time.RFC3339)},
		"boolean":     {"true"},
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

// Handler for our logged-in user page.
func Handler(ctx *gin.Context) {
	session := sessions.Default(ctx)

	profile, ok := session.Get("profile").(map[string]interface{})
	if !ok {
		log.Println("Failed to assert profile type")
		return
	}

	firstName, exists := profile["given_name"].(string)
	if !exists {
		log.Println("Auth0 ID not found in profile")
		return
	}

	pictureURL, exists := profile["picture"].(string)
	if !exists {
		log.Println("Picture URL not found in profile")
		return
	}

	auth0ID, exists := profile["sub"].(string)
	if !exists {
		log.Println("Auth0 ID not found in profile")
		return
	}
	parts := strings.Split(auth0ID, "|")

	if len(parts) != 2 {
		log.Println("Unexpected format for Auth0 ID")
		return
	}

	connection := parts[0]
	userID := parts[1]

	email, exists := profile["email"].(string)
	if !exists {
		log.Println("Email not found in profile")
		return
	}

	dateJoined := time.Now()

	// Check if a Stripe customer already exists for this user
	customerID, err := stripeintegration.GetStripeCustomerID(userID)
	if err != nil {
		log.Printf("Error querying existing customer ID: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to query existing customer ID"})
		return
	}

	if customerID == "" {
		// No existing customer, create a new Stripe customer
		cust, err := stripeintegration.CreateStripeCustomer(email, firstName)
		if err != nil {
			log.Printf("Failed to create Stripe customer: %v", err)
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create Stripe customer"})
			return
		}
		customerID = cust.ID
	}

	session.Set("email", email)
	session.Set("customerID", customerID)
	session.Set("firstName", firstName)
	session.Set("auth0ID", userID)
	session.Set("auth0Full", auth0ID)
	session.Save()

	// Now include the Stripe customer ID when inserting the user
	err = insertUser(userID, email, connection, firstName, pictureURL, customerID, dateJoined)
	if err != nil {
		log.Printf("Error inserting user with Stripe customer ID: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert user"})
		return
	}

	err = subscribeToNewsletter(firstName, email, userID, customerID, dateJoined)
	if err != nil {
		log.Printf("Error updating email newsletter subscription: %v", err)
		// Handle the error as needed.
	}

	log.Println("User inserted successfully:", auth0ID)

	// This is the user page.
	ctx.JSON(http.StatusOK, gin.H{
		"firstName":  firstName,
		"pictureURL": pictureURL,
	})

}
