package stripeintegration

import (
	"database/sql"

	"github.com/kolourr/commonlyodd/database"
)

func GetStripeCustomerID(auth0ID string) (string, error) {
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
