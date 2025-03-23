package db

import (
	"context"
	"log"
	"os"

	"github.com/go-redis/redis/v8"
)

var RedisClient *redis.Client
var Ctx = context.Background()

func InitializeRedisClient() {
	redisAddr := os.Getenv("REDIS_URL") // Fetch from environment variables
	if redisAddr == "" {
		redisAddr = "redis:6379" // Fallback if env var is not set
	}

	RedisClient = redis.NewClient(&redis.Options{
		Addr:     redisAddr,
		Password: "", // No password set
		DB:       0,  // Use default DB
	})

	_, err := RedisClient.Ping(Ctx).Result()
	if err != nil {
		log.Fatalf("❌ Redis is not connected: %v", err)
	}

	log.Println("✅ Redis is successfully connected!")
}

func GetRedisClient() *redis.Client {
	if RedisClient == nil {
		InitializeRedisClient()
	}
	return RedisClient
}
