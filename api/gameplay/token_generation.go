package gameplay

import (
	"log"
	"net/http"
	"os"
	"time"

	rtctokenbuilder2 "github.com/AgoraIO-Community/go-tokenbuilder/rtctokenbuilder"
	rtmtokenbuilder2 "github.com/AgoraIO-Community/go-tokenbuilder/rtmtokenbuilder"
	"github.com/gin-gonic/gin"
)

type RequestBody struct {
	RtcUid      uint32 `json:"rtcUid"`
	RtmUid      string `json:"rtmUid"`
	ChannelName string `json:"channelName"`
	Role        string `json:"role"`
}

type ResponseBody struct {
	RTCToken string `json:"rtcToken"`
	RTMToken string `json:"rtmToken"`
}

var appID string
var appCertificate string

func Init() {
	appIDEnv, appIDExists := os.LookupEnv("AGORA_APP_ID")
	appCertEnv, appCertExists := os.LookupEnv("AGORA_APP_CERTIFICATE")

	if !appIDExists || !appCertExists {
		log.Fatal("FATAL ERROR: ENV not properly configured, check appID and appCertificate")
	} else {
		appID = appIDEnv
		appCertificate = appCertEnv
	}

}

func GenerateTokens(c *gin.Context) {
	Init()
	var requestBody RequestBody
	if err := c.BindJSON(&requestBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	rtcToken, rtcErr := generateRtcToken(appID, appCertificate, requestBody.RtcUid, requestBody.ChannelName, requestBody.Role)
	if rtcErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": rtcErr.Error()})
		return
	}

	rtmToken, rtmErr := generateRtmToken(appID, appCertificate, requestBody.RtmUid)
	if rtmErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": rtmErr.Error()})
		return
	}

	response := ResponseBody{RTCToken: rtcToken, RTMToken: rtmToken}
	c.JSON(http.StatusOK, response)
}

func generateRtcToken(appID string, appCertificate string, userID uint32, channelName string, role string) (string, error) {
	expirationTimeInSeconds := 3600 * 24
	currentTimestamp := time.Now().Unix()
	expirationTimestamp := currentTimestamp + int64(expirationTimeInSeconds)

	var rtcRole rtctokenbuilder2.Role
	if role == "publisher" {
		rtcRole = rtctokenbuilder2.RolePublisher
	} else {
		rtcRole = rtctokenbuilder2.RoleSubscriber
	}

	rtcToken, err := rtctokenbuilder2.BuildTokenWithUid(appID, appCertificate, channelName, userID, rtcRole, uint32(expirationTimestamp))
	if err != nil {
		return "", err
	}

	return rtcToken, nil
}

func generateRtmToken(appID, appCertificate, userID string) (string, error) {
	expirationTimeInSeconds := 3600 * 24
	currentTimestamp := time.Now().Unix()
	expirationTimestamp := currentTimestamp + int64(expirationTimeInSeconds)

	rtmToken, err := rtmtokenbuilder2.BuildToken(appID, appCertificate, userID, uint32(expirationTimestamp), "")
	if err != nil {
		return "", err
	}

	return rtmToken, nil
}
