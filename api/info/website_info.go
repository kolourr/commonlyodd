package info

import "github.com/gin-gonic/gin"

func About(c *gin.Context) {
	c.JSON(200, gin.H{
		"status": "UP",
	})
}

func Contact(c *gin.Context) {
	c.JSON(200, gin.H{
		"status": "UP",
	})
}

func Rules(c *gin.Context) {
	c.JSON(200, gin.H{
		"status": "UP",
	})
}