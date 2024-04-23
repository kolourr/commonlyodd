package authenticator

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/coreos/go-oidc/v3/oidc"
	"golang.org/x/oauth2"
)

// Authenticator is used to authenticate our users.
type Authenticator struct {
	*oidc.Provider
	oauth2.Config
}

type auth0TokenResponse struct {
	AccessToken string `json:"access_token"`
}

// New instantiates the *Authenticator.
func New() (*Authenticator, error) {
	provider, err := oidc.NewProvider(
		context.Background(),
		"https://"+os.Getenv("AUTH0_DOMAIN")+"/",
	)
	if err != nil {
		return nil, err
	}

	conf := oauth2.Config{
		ClientID:     os.Getenv("AUTH0_CLIENT_ID"),
		ClientSecret: os.Getenv("AUTH0_CLIENT_SECRET"),
		RedirectURL:  os.Getenv("AUTH0_CALLBACK_URL"),
		Endpoint:     provider.Endpoint(),
		Scopes:       []string{oidc.ScopeOpenID, "email profile"},
	}

	return &Authenticator{
		Provider: provider,
		Config:   conf,
	}, nil
}

// VerifyIDToken verifies that an *oauth2.Token is a valid *oidc.IDToken.
func (a *Authenticator) VerifyIDToken(ctx context.Context, token *oauth2.Token) (*oidc.IDToken, error) {
	rawIDToken, ok := token.Extra("id_token").(string)
	if !ok {
		return nil, errors.New("no id_token field in oauth2 token")
	}

	oidcConfig := &oidc.Config{
		ClientID: a.ClientID,
	}

	return a.Verifier(oidcConfig).Verify(ctx, rawIDToken)
}

// getAuth0ManagementToken retrieves a management API token
func getAuth0ManagementToken() (string, error) {
	url := fmt.Sprintf("https://%s/oauth/token", os.Getenv("AUTH0_DOMAIN"))
	values := map[string]string{
		"grant_type":    "client_credentials",
		"client_id":     os.Getenv("AUTH0_CLIENT_ID"),
		"client_secret": os.Getenv("AUTH0_CLIENT_SECRET"),
		"audience":      fmt.Sprintf("https://%s/api/v2/", os.Getenv("AUTH0_DOMAIN")),
	}

	jsonValue, _ := json.Marshal(values)
	resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonValue))
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	var tokenResp auth0TokenResponse
	if err := json.NewDecoder(resp.Body).Decode(&tokenResp); err != nil {
		return "", err
	}

	return tokenResp.AccessToken, nil
}

// deleteAuth0User deletes a user from Auth0
func DeleteAuth0User(auth0UserID string) error {
	token, err := getAuth0ManagementToken()
	if err != nil {
		return fmt.Errorf("could not get Auth0 token: %v", err)
	}

	client := &http.Client{}
	req, err := http.NewRequest("DELETE", fmt.Sprintf("https://%s/api/v2/users/%s", os.Getenv("AUTH0_OG_DOMAIN"), auth0UserID), nil)
	if err != nil {
		return fmt.Errorf("could not create request: %v", err)
	}
	req.Header.Set("Authorization", "Bearer "+token) // Ensure the space between 'Bearer' and the token

	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("failed to delete Auth0 user: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != 204 {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("failed to delete Auth0 user, status: %d, body: %s", resp.StatusCode, string(body))
	}

	return nil
}
