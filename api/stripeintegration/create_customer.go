package stripeintegration

import (
	"log"

	"github.com/stripe/stripe-go/v76"
	"github.com/stripe/stripe-go/v76/customer"
)

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
