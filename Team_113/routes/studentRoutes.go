package routes

import (
	"log"
	"time"

	"github.com/adityjoshi/Dosahostel/controllers"
	kafkamanager "github.com/adityjoshi/Dosahostel/kafka/manager"
	"github.com/adityjoshi/Dosahostel/middleware"

	"github.com/gin-gonic/gin"
)

func StudentRoutes(incomingRoutes *gin.Engine, km *kafkamanager.KafkaManager) {
	incomingRoutes.POST("/student/register", controllers.BusinessAdminReg)
	incomingRoutes.POST("/student/login", middleware.RateLimiterMiddleware(2, time.Minute), controllers.StudentLogin)
	incomingRoutes.POST("/student/complaint", middleware.AuthorizeStudent(), controllers.PostInventory)

	incomingRoutes.POST("/student/bulk", func(c *gin.Context) {
		log.Printf("KafkaManager before setting in context: %v", km)
		c.Set("km", km) // Set KafkaManager to context
		controllers.PostComplaintKafka(c)
	})
	incomingRoutes.POST("/verify-otp", middleware.AuthorizeStudent(), controllers.VerifyAdminOTP)
	incomingRoutes.GET("/getInventory", middleware.AuthorizeStudent(), controllers.GetAllInventory)
	incomingRoutes.GET("/getAdminDetails", middleware.AuthorizeStudent(), controllers.GetBusinessAdmin)
}
