package utils

import (
	"crypto/rand"
	"crypto/tls"
	"fmt"
	"log"
	"math/big"
	"time"

	db "github.com/adityjoshi/Dosahostel/database"
	"gopkg.in/gomail.v2"

	"github.com/go-redis/redis/v8"
)

func GenerateAndSendOTP(email string) (string, error) {
	// Generate OTP
	otp, err := GenerateOtp()
	if err != nil {
		return "", err
	}

	// Store OTP in Redis with an expiration time
	err = StoreOtp(email+"_otp", otp)
	if err != nil {
		return "", err
	}

	// Send OTP to user via email asynchronously
	go func() {
		err := OtpRegistration(email, otp)
		if err != nil {
			log.Printf("Failed to send OTP email to %s: %v", email, err)
		} else {
			log.Printf("Successfully sent OTP to %s", email)
		}
	}()

	return otp, nil
}

// VerifyOtp verifies the provided OTP against the stored OTP.
func VerifyOtp(email, otp string) (bool, error) {
	storedOtp, err := GetOtp(email + "_otp")
	if err == redis.Nil {
		log.Printf("OTP not found for email: %s", email)
		return false, nil
	} else if err != nil {
		return false, err
	}

	if otp != storedOtp {
		log.Printf("OTP mismatch for email: %s", email)
		return false, nil
	}

	// Delete OTP after successful verification
	err = DeleteOTP(email + "_otp")
	if err != nil {
		log.Printf("Failed to delete OTP for email: %s", email)
		return false, err
	}

	return true, nil
}

func GenerateOtp() (string, error) {
	otp, err := rand.Int(rand.Reader, big.NewInt(1000000))
	if err != nil {
		return "", err
	}
	return fmt.Sprintf("%06d", otp.Int64()), nil
}

func StoreOtp(key, otp string) error {
	client := db.GetRedisClient()
	// otp will expire after 5 min
	return client.Set(db.Ctx, key, otp, 5*time.Minute).Err()
}

// Retrieve OTP from Redis
func GetOtp(key string) (string, error) {
	client := db.GetRedisClient()

	otp, err := client.Get(db.Ctx, key).Result()
	if err != nil {
		return "", err
	}
	return otp, nil
}

// Delete OTP from Redis
func DeleteOTP(key string) error {
	client := db.GetRedisClient()
	return client.Del(db.Ctx, key).Err()
}

func OtpRegistration(to, otp string) error {
	message := gomail.NewMessage()
	message.SetHeader("From", "mohantybrajesh4@gmail.com")
	message.SetHeader("To", to, "aditya30joshi@gmail.com")
	message.SetHeader("Subject", "Otp Verification")

	htmlBody := `
    <html>
    <body>
        <h1>Your OTP Code</h1>
        <p>Dear User,</p>
        <p>Your One-Time Password (OTP) is <strong>` + otp + `</strong>.</p>
        <p>Please use this OTP to complete your verification.</p>
        <p>If you did not request this OTP, please ignore this email.</p>
        <p>Best regards,<br>Swaasthya</p>
    </body>
    </html>
    `
	body := htmlBody
	body += "*Best regards*\n"
	body += "*Team Swaasthaya*"
	message.SetBody("text/html", htmlBody)

	//message.Attach("/home/Alex/lolcat.jpg")

	dialer := gomail.NewDialer("smtp.gmail.com", 587, "mohantybrajesh4@gmail.com", "axrbvuubnrsrctso")
	dialer.TLSConfig = &tls.Config{
		InsecureSkipVerify: true, // ⚠️ Not recommended for production
	} // Update with your SMTP server details

	// Send email
	if err := dialer.DialAndSend(message); err != nil {
		panic(err)
	}

	fmt.Println("Email sent successfully!")
	return nil
}
