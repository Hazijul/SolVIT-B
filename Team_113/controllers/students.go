package controllers

import (
	"context"
	"net/http"
	"strconv"

	db "github.com/adityjoshi/Dosahostel/database"
	"github.com/adityjoshi/Dosahostel/models"
	"github.com/adityjoshi/Dosahostel/utils"
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func BusinessAdminReg(c *gin.Context) {
	var admin models.Users

	if err := c.BindJSON(&admin); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	database, err := db.GetDB(admin.Region)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if database == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "invalid region"})
		return
	}
	var existingUser models.Users
	if err := database.Where("email =?", admin.Email).First(&existingUser).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "user already exists"})
		return
	}
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(admin.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}
	admin.Password = string(hashedPassword)
	admin.User_type = "Admin"

	userStudent := models.Users{
		Full_Name:     admin.Full_Name,
		GenderInfo:    models.Gender(admin.GenderInfo),
		ContactNumber: admin.ContactNumber,
		Email:         admin.Email,
		Password:      admin.Password,
		GSTNumber:     admin.GSTNumber,
		BusinessName:  admin.BusinessName,
		Region:        admin.Region,
		User_type:     models.Buyer,
	}
	if err := database.Create(&userStudent).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "User registered successfully",
	})
}

func StudentLogin(c *gin.Context) {
	var loginRequest struct {
		Email    string `json:"email"`
		Password string `json:"password"`
		Region   string `json:"region"`
	}
	if err := c.BindJSON(&loginRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	database, err := db.GetDB(loginRequest.Region)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if database == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "invalid region"})
		return
	}

	var admin models.Users
	if err := database.Where("email = ?", loginRequest.Email).First(&admin).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(admin.Password), []byte(loginRequest.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid Password"})
		return
	}

	jwtToken, err := utils.GenerateStudentJWT(int(admin.ID), admin.Region, string(admin.User_type))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate JWT token"})
		return
	}
	utils.GenerateAndSendOTP(admin.Email)

	c.JSON(http.StatusOK, gin.H{"Status": "Login successful", "token": jwtToken})
}

func VerifyAdminOTP(c *gin.Context) {
	var otpRequest struct {
		Email string `json:"email"`
		OTP   string `json:"otp"`
	}
	if err := c.BindJSON(&otpRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get region from context and assert its type
	region, exists := c.Get("region")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized region"})
		return
	}
	regionStr, ok := region.(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid region type"})
		return
	}

	// Verify the OTP
	isValid, err := utils.VerifyOtp(otpRequest.Email, otpRequest.OTP)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error verifying OTP"})
		return
	}
	if !isValid {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid OTP"})
		return
	}

	// Retrieve the appropriate database based on region
	database, err := db.GetDB(regionStr)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error connecting to regional database"})
		return
	}

	// Retrieve user information after OTP verification
	var user models.Users
	if err := database.Where("email = ?", otpRequest.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	// Set OTP verification status in Redis
	redisClient := db.GetRedisClient()
	err = redisClient.Set(context.Background(), "otp_verified:"+strconv.Itoa(int(user.ID)), "verified", 0).Err()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error setting OTP verification status"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success", "region": regionStr})
}

func GetBusinessAdmin(c *gin.Context) {
	// Fetch the admin ID from the URL parameter

	// Validate if adminID is provided
	tokenString := c.GetHeader("Authorization")
	if tokenString == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing token"})
		return
	}

	// Decode token to extract student details
	claims, err := utils.DecodeStudentJWT(tokenString)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}

	// Check if the token contains valid user claims
	userClaims, ok := claims["user"].(map[string]interface{})
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token structure"})
		return
	}

	// Check if user_id is present and valid in the token
	adminID, ok := userClaims["user_id"].(float64)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user_id in token"})
		return
	}

	// Check if region is available in the token
	region, ok := userClaims["region"].(string)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid region in token"})
		return
	}

	// Fetch the database connection for the region
	database, err := db.GetDB(region)
	if err != nil || database == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error or invalid region"})
		return
	}

	// Fetch admin details from the database using the provided adminID
	var admin models.Users
	if err := database.Where("id = ?", adminID).First(&admin).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Admin not found"})
		return
	}

	// Return the admin details as a JSON response
	c.JSON(http.StatusOK, gin.H{
		"admin_id":       admin.ID,
		"full_name":      admin.Full_Name,
		"gender_info":    admin.GenderInfo,
		"contact_number": admin.ContactNumber,
		"business_name":  admin.BusinessName,
		"email":          admin.Email,
		"gst_number":     admin.GSTNumber,
		"user_type":      admin.User_type,
		"region":         admin.Region,
	})
}
