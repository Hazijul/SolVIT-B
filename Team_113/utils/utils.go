package utils

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt"
)

var jwtSecret = []byte("JWT123")

func GenerateStudentJWT(userID int, region string, userType string) (string, error) {
	// Create a new JWT token with user payload
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["user"] = map[string]interface{}{
		"user_id":   userID,
		"region":    region,
		"user_type": userType,
	}
	claims["exp"] = time.Now().Add(time.Hour).Unix()

	// Sign the token with the secret key and return
	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		return "", err
	}
	return tokenString, nil
}
func DecodeStudentJWT(tokenString string) (map[string]interface{}, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})
	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {

		return claims, nil
	}

	return nil, fmt.Errorf("invalid token")
}
