package controllers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	db "github.com/adityjoshi/Dosahostel/database"
	kafkamanager "github.com/adityjoshi/Dosahostel/kafka/manager"
	"github.com/adityjoshi/Dosahostel/models"
	"github.com/adityjoshi/Dosahostel/utils"
	"github.com/gin-gonic/gin"
)

var count int = 0

func PostInventory(c *gin.Context) {
	count++

	if count >= 500 {
		// Simulate failure when counter reaches 500
		log.Printf("Simulated failure: reached %d inventory entries", count)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Simulated failure: reached 500 inventory entries",
		})
		os.Exit(1)
		return
	}
	// Extract token from header
	tokenString := c.GetHeader("Authorization")
	if tokenString == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing token"})
		return
	}

	// Decode token to extract admin details
	claims, err := utils.DecodeStudentJWT(tokenString)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}
	userClaims, ok := claims["user"].(map[string]interface{})
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token structure"})
		return
	}

	adminID, ok := userClaims["user_id"].(float64)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user_id in token"})
		return
	}
	region, ok := userClaims["region"].(string) // Extracting region from JWT
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid region in token"})
		return
	}

	database, err := db.GetDB(region)
	if err != nil || database == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	var admin models.Users
	if err := database.Where("id = ?", uint(adminID)).First(&admin).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Admin not found"})
		return
	}

	// Bind JSON request body
	var inventoryReq struct {
		ProductName string `json:"product_name"`
		GSTNumber   string `json:"gst_number"`
		Quantity    int    `json:"quantity"`
		Price       uint   `json:"price"`
	}

	if err := c.ShouldBindJSON(&inventoryReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Create new inventory record
	inventory := models.Inventory{
		AdminID:      uint(adminID),
		BusinessName: admin.BusinessName,
		GSTNumber:    inventoryReq.GSTNumber,
		ProductName:  inventoryReq.ProductName,
		Quantity:     inventoryReq.Quantity,
	}

	if err := database.Create(&inventory).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Inventory item registered successfully",
	})
}

/*
 */
// func PostComplaintKafka(c *gin.Context) {
// 	// Check if KafkaManager is available in the context
// 	km, exists := c.Get("km")
// 	if !exists {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "KafkaManager not found"})
// 		return
// 	}

// 	log.Printf("KafkaManager retrieved from context: %v", km)

// 	kafkaManager, ok := km.(*kafkamanager.KafkaManager)
// 	if !ok {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid KafkaManager"})
// 		return
// 	}
// 	// Check if Authorization token is present
// 	tokenString := c.GetHeader("Authorization")
// 	if tokenString == "" {
// 		c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing token"})
// 		return
// 	}

// 	// Decode token to extract student details
// 	claims, err := utils.DecodeStudentJWT(tokenString)
// 	if err != nil {
// 		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
// 		return
// 	}

// 	// Check if the token contains valid user claims
// 	userClaims, ok := claims["user"].(map[string]interface{})
// 	if !ok {
// 		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token structure"})
// 		return
// 	}

// 	// Check if user_id is present and valid in the token
// 	adminID, ok := userClaims["user_id"].(float64)
// 	if !ok {
// 		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user_id in token"})
// 		return
// 	}

// 	// Check if region is available in the token
// 	region, ok := userClaims["region"].(string)
// 	if !ok {
// 		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid region in token"})
// 		return
// 	}

// 	// Struct for inventory request validation
// 	var inventoryReq struct {
// 		ProductName string `json:"product_name"`
// 		GSTNumber   string `json:"gst_number"`
// 		Quantity    int    `json:"quantity"`
// 		Price       uint   `json:"price"`
// 	}

// 	// Bind and validate the incoming JSON body
// 	if err := c.ShouldBindJSON(&inventoryReq); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
// 		return
// 	}

// 	// Fetch the database for the given region
// 	database, err := db.GetDB(region)
// 	if err != nil || database == nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error or invalid hostel"})
// 		return
// 	}

// 	// Fetch the admin information from the database
// 	var admin models.Users
// 	if err := database.Where("id = ?", uint(adminID)).First(&admin).Error; err != nil {
// 		c.JSON(http.StatusNotFound, gin.H{"error": "Admin not found"})
// 		return
// 	}
// 	if err := database.Select("gst_number").Where("id = ?", uint(adminID)).First(&admin).Error; err != nil {
// 		c.JSON(http.StatusNotFound, gin.H{"error": "Gst not found"})
// 		return
// 	}

// 	// Prepare the inventory data
// 	Inventory := models.Inventory{
// 		AdminID:      uint(adminID),
// 		BusinessName: admin.BusinessName,
// 		GSTNumber:    inventoryReq.GSTNumber,
// 		ProductName:  inventoryReq.ProductName,
// 		Quantity:     inventoryReq.Quantity,
// 		Price:        inventoryReq.Price,
// 		Time:         time.Now(),
// 		TotalPrice:   inventoryReq.Quantity * int(inventoryReq.Price),
// 	}

// 	// Marshal the inventory data into JSON
// 	complaints, err := json.Marshal(Inventory)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to marshal complaint admin data to JSON"})
// 		return
// 	}

// 	// Declare a variable to capture Kafka errors
// 	var errKafka error

// 	// Send the complaint data to Kafka based on region
// 	switch region {
// 	case "north":
// 		errKafka = kafkaManager.ComplaintRegistration(region, "inventory", string(complaints))
// 	case "south":
// 		errKafka = kafkaManager.ComplaintRegistration(region, "inventory", string(complaints))
// 	default:
// 		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Invalid region: %s", region)})
// 		return
// 	}

// 	// Check if sending data to Kafka failed
// 	if errKafka != nil {
// 		log.Printf("Failed to send hospital registration data to Kafka: %v", errKafka)
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send data to Kafka"})
// 		return
// 	}

// 	// Send a success response
// 	c.JSON(http.StatusCreated, gin.H{"message": "Complaint created successfully", "region": Inventory.BusinessName})
// }

func PostComplaintToKafka(c *gin.Context) {
	// Check if KafkaManager is available in the context
	km, exists := c.Get("km")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "KafkaManager not found"})
		return
	}

	log.Printf("KafkaManager retrieved from context: %v", km)

	kafkaManager, ok := km.(*kafkamanager.KafkaManager)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid KafkaManager"})
		return
	}

	// Check if Authorization token is present
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

	// Struct for inventory request validation
	var inventoryReq struct {
		ProductName string `json:"product_name"`
		GSTNumber   string `json:"gst_number"`
		Quantity    int    `json:"quantity"`
		Price       uint   `json:"price"`
	}

	// Bind and validate the incoming JSON body
	if err := c.ShouldBindJSON(&inventoryReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Fetch the database for the given region
	database, err := db.GetDB(region)
	if err != nil || database == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error or invalid hostel"})
		return
	}

	// Fetch the admin's GST number using GORM's Pluck method
	var gstNumber string
	if err := database.Model(&models.Users{}).Where("id = ?", uint(adminID)).Pluck("gst_number", &gstNumber).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "GST number not found for the given admin ID"})
		return
	}

	// Fetch admin's business name
	var businessName string
	if err := database.Model(&models.Users{}).Where("id = ?", uint(adminID)).Pluck("business_name", &businessName).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Business name not found for the given admin ID"})
		return
	}

	// Prepare the inventory data
	Inventory := models.Inventory{
		AdminID:      uint(adminID),
		BusinessName: businessName,
		GSTNumber:    gstNumber,
		ProductName:  inventoryReq.ProductName,
		Quantity:     inventoryReq.Quantity,
		Price:        inventoryReq.Price,
		Time:         time.Now(),
		TotalPrice:   inventoryReq.Quantity * int(inventoryReq.Price),
	}

	// Marshal the inventory data into JSON
	complaints, err := json.Marshal(Inventory)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to marshal complaint admin data to JSON"})
		return
	}

	// Declare a variable to capture Kafka errors
	var errKafka error

	// Send the complaint data to Kafka based on region
	switch region {
	case "north":
		errKafka = kafkaManager.ComplaintRegistration(region, "inventory", string(complaints))
	case "south":
		errKafka = kafkaManager.ComplaintRegistration(region, "inventory", string(complaints))
	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Invalid region: %s", region)})
		return
	}

	// Check if sending data to Kafka failed
	if errKafka != nil {
		log.Printf("Failed to send inventory registration data to Kafka: %v", errKafka)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send data to Kafka"})
		return
	}

	// Send a success response
	c.JSON(http.StatusCreated, gin.H{"message": "Complaint created successfully", "business_name": businessName})
}

func PostComplaintKafka(c *gin.Context) {
	// Check if KafkaManager is available in the context
	km, exists := c.Get("km")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "KafkaManager not found"})
		return
	}

	log.Printf("KafkaManager retrieved from context: %v", km)

	kafkaManager, ok := km.(*kafkamanager.KafkaManager)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid KafkaManager"})
		return
	}

	// Check if Authorization token is present
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

	// Struct for inventory request validation
	var inventoryReq struct {
		ProductName string `json:"product_name"`
		GSTNumber   string `json:"gst_number"`
		Quantity    int    `json:"quantity"`
		Price       uint   `json:"price"`
	}

	// Bind and validate the incoming JSON body
	if err := c.ShouldBindJSON(&inventoryReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Fetch the database for the given region
	database, err := db.GetDB(region)
	if err != nil || database == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error or invalid hostel"})
		return
	}

	// Fetch the admin's GST number using GORM's Pluck method
	var gstNumber string
	if err := database.Model(&models.Users{}).Where("id = ?", uint(adminID)).Pluck("gst_number", &gstNumber).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "GST number not found for the given admin ID"})
		return
	}

	// Fetch admin's business name
	var businessName string
	if err := database.Model(&models.Users{}).Where("id = ?", uint(adminID)).Pluck("business_name", &businessName).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Business name not found for the given admin ID"})
		return
	}

	// Fetch admin's email
	var email string
	if err := database.Model(&models.Users{}).Where("id = ?", uint(adminID)).Pluck("email", &email).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Email not found for the given admin ID"})
		return
	}

	// Prepare the inventory data
	Inventory := models.Inventory{
		AdminID:      uint(adminID),
		BusinessName: businessName,
		GSTNumber:    gstNumber,
		ProductName:  inventoryReq.ProductName,
		Quantity:     inventoryReq.Quantity,
		Price:        inventoryReq.Price,
		Time:         time.Now(),
		TotalPrice:   inventoryReq.Quantity * int(inventoryReq.Price),
	}

	// Marshal the inventory data into JSON
	complaints, err := json.Marshal(Inventory)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to marshal complaint admin data to JSON"})
		return
	}

	// Declare a variable to capture Kafka errors
	var errKafka error

	// Send the complaint data to Kafka based on region
	switch region {
	case "north":
		errKafka = kafkaManager.ComplaintRegistration(region, "inventory", string(complaints))
	case "south":
		errKafka = kafkaManager.ComplaintRegistration(region, "inventory", string(complaints))
	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Invalid region: %s", region)})
		return
	}

	// Check if sending data to Kafka failed
	if errKafka != nil {
		log.Printf("Failed to send inventory registration data to Kafka: %v", errKafka)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send data to Kafka"})
		return
	}

	// Create a slice of InvoiceItem
	items := []utils.InvoiceItem{
		{Description: inventoryReq.ProductName, Quantity: inventoryReq.Quantity, UnitPrice: uint(inventoryReq.Price)},
	}

	// Call GenerateAndSendInvoice with the email, customer name, and items slice
	if err := utils.GenerateAndSendInvoice(email, businessName, items); err != nil {
		log.Printf("Failed to generate and send invoice: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate and send invoice"})
		return
	}

	// Send a success response
	c.JSON(http.StatusCreated, gin.H{"message": "Complaint created successfully", "business_name": businessName})
}
func GetAllInventory(c *gin.Context) {
	// Check if Authorization token is present
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

	// Extract region from the token
	userClaims, ok := claims["user"].(map[string]interface{})
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token structure"})
		return
	}
	region, ok := userClaims["region"].(string)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid region in token"})
		return
	}

	// Fetch the database for the given region
	database, err := db.GetDB(region)
	if err != nil || database == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error or invalid hostel"})
		return
	}

	// Fetch all inventory records
	var inventory []models.Inventory
	if err := database.Find(&inventory).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch inventory"})
		return
	}

	// Send the response
	c.JSON(http.StatusOK, gin.H{"inventory": inventory})
}
