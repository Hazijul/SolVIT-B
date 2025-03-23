package db

import (
	"fmt"
	"log"
	"os"

	"github.com/adityjoshi/Dosahostel/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var (
	Northdb *gorm.DB
	Southdb *gorm.DB
)
var err error

func InitDB() {

	// Big Boys Database credentials
	bigBoysDBUser := os.Getenv("DB_BIG_BOYS_USER")
	bigBoysDBPassword := os.Getenv("DB_BIG_BOYS_PASSWORD")
	bigBoysDBHost := os.Getenv("DB_BIG_BOYS_HOST")
	bigBoysDBPort := os.Getenv("DB_BIG_BOYS_PORT")
	bigBoysDBName := os.Getenv("DB_BIG_BOYS_NAME")

	// Boys One Database credentials
	boysOneDBUser := os.Getenv("DB_BOYS_ONE_USER")
	boysOneDBPassword := os.Getenv("DB_BOYS_ONE_PASSWORD")
	boysOneDBHost := os.Getenv("DB_BOYS_ONE_HOST")
	boysOneDBPort := os.Getenv("DB_BOYS_ONE_PORT")
	boysOneDBName := os.Getenv("DB_BOYS_ONE_NAME")

	// Data Source Names (DSNs) for both databases
	bigBoysDSN := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable", bigBoysDBHost, bigBoysDBUser, bigBoysDBPassword, bigBoysDBName, bigBoysDBPort)
	boysOneDSN := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable", boysOneDBHost, boysOneDBUser, boysOneDBPassword, boysOneDBName, boysOneDBPort)

	// Connecting to Big Boys Database
	Northdb, err = gorm.Open(postgres.Open(bigBoysDSN), &gorm.Config{})
	if err != nil {
		log.Fatalf("Error connecting to the Big Boys database: %v", err)
	}

	// Connecting to Boys One Database
	Southdb, err = gorm.Open(postgres.Open(boysOneDSN), &gorm.Config{})
	if err != nil {
		log.Fatalf("Error connecting to the Boys One database: %v", err)
	}

	// Ensure the connections are established
	sqlBigBoysDB, err := Northdb.DB()
	if err != nil {
		log.Fatalf("Error getting the Big Boys database object: %v", err)
	}
	err = sqlBigBoysDB.Ping()
	if err != nil {
		log.Fatalf("Error pinging the Big Boys database: %v", err)
	}

	sqlBoysOneDB, err := Southdb.DB()
	if err != nil {
		log.Fatalf("Error getting the Boys One database object: %v", err)
	}
	err = sqlBoysOneDB.Ping()
	if err != nil {
		log.Fatalf("Error pinging the Boys One database: %v", err)
	}

	// Print successful connection messages
	fmt.Println("Big Boys and Boys One Database connections successful")

	NorthDB()
	SouthDB()
}

func NorthDB() {

	err = Northdb.AutoMigrate(&models.Users{}, &models.Inventory{}, models.Invoice{})
	if err != nil {
		log.Fatalf("Error migrating models (students, wardens): %v", err)
	}

	fmt.Println("Big Boys Database migrations completed successfully")
}

// Boys One DB migrations
func SouthDB() {

	err = Southdb.AutoMigrate(&models.Users{}, &models.Inventory{}, models.Invoice{})
	if err != nil {
		log.Fatalf("Error migrating models (students, wardens, user): %v", err)
	}

	fmt.Println("Boys One Database migrations completed successfully")
}

func GetDB(region string) (*gorm.DB, error) {
	switch region {
	case "north":
		return Northdb, nil
	case "south":
		return Southdb, nil
	default:
		return nil, fmt.Errorf("invalid region: %s", region)
	}
}
