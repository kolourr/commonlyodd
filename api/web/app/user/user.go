package user

import (
	"database/sql"
	"log"
	"net/http"
	"strings"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/kolourr/commonlyodd/database"
	_ "github.com/lib/pq"
	"github.com/stripe/stripe-go/v76"
	"github.com/stripe/stripe-go/v76/customer"
)

func insertUser(auth0ID, email, connection, firstName, pictureURL, customerID string) error {
	query := `
		INSERT INTO Users (auth0_id, email, connection, first_name, picture_url, customer_id)
		VALUES ($1, $2, $3, $4, $5, $6)
		ON CONFLICT (auth0_id) DO NOTHING
	`
	_, err := database.DB.Exec(query, auth0ID, email, connection, firstName, pictureURL, customerID)
	return err
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

	// Check if a Stripe customer already exists for this user
	customerID, err := getStripeCustomerID(userID)
	if err != nil {
		log.Printf("Error querying existing customer ID: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to query existing customer ID"})
		return
	}

	if customerID == "" {
		// No existing customer, create a new Stripe customer
		cust, err := CreateStripeCustomer(email, firstName)
		if err != nil {
			log.Printf("Failed to create Stripe customer: %v", err)
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create Stripe customer"})
			return
		}
		customerID = cust.ID // Use the new Stripe customer ID
	}

	// Now include the Stripe customer ID when inserting the user
	err = insertUser(userID, email, connection, firstName, pictureURL, customerID)
	if err != nil {
		log.Printf("Error inserting user with Stripe customer ID: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert user"})
		return
	}

	// This is the user page.
	ctx.JSON(http.StatusOK, gin.H{
		"firstName":  firstName,
		"pictureURL": pictureURL,
	})

}

func getStripeCustomerID(auth0ID string) (string, error) {
	var customerID string
	query := `SELECT customer_id FROM Users WHERE auth0_id = $1`
	err := database.DB.QueryRow(query, auth0ID).Scan(&customerID)
	if err != nil {
		if err == sql.ErrNoRows {
			// No existing customer ID found
			return "", nil
		}
		// An error occurred during the query
		return "", err
	}
	// Existing customer ID found
	return customerID, nil
}

func CreateStripeCustomer(email, name string) (*stripe.Customer, error) {
	params := &stripe.CustomerParams{
		Email: stripe.String(email),
		Name:  stripe.String(name),
	}
	cust, err := customer.New(params)
	if err != nil {
		log.Printf("Failed to create Stripe customer: %v", err)
		return nil, err
	}
	return cust, nil
}
