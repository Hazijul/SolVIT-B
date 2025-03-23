package middleware

import (
	"net/http"

	"github.com/adityjoshi/Dosahostel/utils"
	"github.com/gin-gonic/gin"
)

func AuthorizeStudent() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString := c.GetHeader("Authorization")
		if tokenString == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization token is missing"})
			c.Abort()
			return
		}

		claims, err := utils.DecodeStudentJWT(tokenString)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			c.Abort()
			return
		}

		// Access user object from claims
		user, ok := claims["user"].(map[string]interface{})
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token structure"})
			c.Abort()
			return
		}

		// Extract user_type from the user object
		userType, ok := user["user_type"].(string)
		if !ok || userType != "Buyer" {
			c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized for student"})
			c.Abort()
			return
		}

		// Extract region from the user object
		if region, exists := user["region"].(string); exists {
			c.Set("region", region)
		} else {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Region not specified in token"})
			c.Abort()
			return
		}

		c.Next()
	}
}
