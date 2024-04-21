package logout

import (
	"net/http"
	"net/url"
	"os"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

// Handler for our logout.
func Handler(ctx *gin.Context) {
	// Retrieve the session
	session := sessions.Default(ctx)

	// Clear the session
	session.Clear()
	if err := session.Save(); err != nil {
		ctx.String(http.StatusInternalServerError, "Failed to clear session")
		return
	}

	// Construct the Auth0 logout URL
	logoutUrl, err := url.Parse("https://" + os.Getenv("AUTH0_DOMAIN") + "/v2/logout")
	if err != nil {
		ctx.String(http.StatusInternalServerError, err.Error())
		return
	}
	// Determine the correct scheme for the startGameURL
	scheme := "http"
	if os.Getenv("GIN_MODE") == "release" {
		scheme = "https"
	}

	startGameURL := scheme + "://" + ctx.Request.Host + "/logout-auth"

	parameters := url.Values{}
	parameters.Add("returnTo", startGameURL)
	parameters.Add("client_id", os.Getenv("AUTH0_CLIENT_ID"))
	logoutUrl.RawQuery = parameters.Encode()

	// Delete the auth-session cookie explicitly
	ctx.SetCookie("auth-session", "", -1, "/", "", ctx.Request.TLS != nil, true)

	// Redirect to Auth0 logout URL
	ctx.Redirect(http.StatusTemporaryRedirect, logoutUrl.String())
}
