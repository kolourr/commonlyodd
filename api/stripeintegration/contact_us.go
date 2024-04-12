package stripeintegration

import (
	"fmt"
	"net/http"
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/ses"
	"github.com/gin-gonic/gin"
)

type ContactUsRequest struct {
	Name    string `json:"name" binding:"required"`
	Email   string `json:"email" binding:"required"`
	Subject string `json:"subject" binding:"required"`
	Message string `json:"message" binding:"required"`
}

func ContactUsEmail(c *gin.Context) {
	var requestData ContactUsRequest

	// Validate input
	if err := c.ShouldBindJSON(&requestData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return // Ensure no further execution on error
	}

	// Set up AWS SES configuration
	sess, err := session.NewSession(&aws.Config{
		Region:      aws.String("us-east-1"),
		Credentials: credentials.NewStaticCredentials(os.Getenv("AWS_ACCESS_KEY_ID"), os.Getenv("AWS_SECRET_ACCESS_KEY"), ""),
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to create AWS session: %v", err)})
		return
	}

	svc := ses.New(sess)

	// Your email address (where you will receive the contact requests)
	myEmailAddress := "commonlyoddbruce@gmail.com"
	receiptEmailAddress := "commonlyoddtrivia@gmail.com"

	// Create the email parameters
	input := &ses.SendEmailInput{
		Destination: &ses.Destination{
			ToAddresses: []*string{aws.String(receiptEmailAddress)},
		},
		Message: &ses.Message{
			Body: &ses.Body{
				Html: &ses.Content{
					Charset: aws.String("UTF-8"),
					Data:    aws.String(fmt.Sprintf("<p>From: %s (%s)</p><p>Message: %s</p>", requestData.Name, requestData.Email, requestData.Message)), // Include the sender's info in the message body
				},
			},
			Subject: &ses.Content{
				Charset: aws.String("UTF-8"),
				Data:    aws.String("Contact Form: " + requestData.Subject),
			},
		},
		ReplyToAddresses: []*string{aws.String(requestData.Email)},
		Source:           aws.String(myEmailAddress),
	}

	// Send the email
	_, err = svc.SendEmail(input)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to send email: %v", err)})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Email sent successfully"})
}
