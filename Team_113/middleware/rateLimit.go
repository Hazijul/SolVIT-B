package middleware

import (
	"log"
	"net/http"
	"strconv"
	"time"

	db "github.com/adityjoshi/Dosahostel/database"
	"github.com/go-redis/redis/v8"

	"github.com/gin-gonic/gin"
)

func RateLimiterMiddleware(limit int, duration time.Duration) gin.HandlerFunc {
	return func(c *gin.Context) {
		client := db.GetRedisClient()
		ip := c.ClientIP()
		key := "rate_limit:" + ip

		// Check if the key exists before incrementing, so we don't reset the count each time
		count, err := client.Get(db.Ctx, key).Result()
		if err == redis.Nil {
			// Key doesn't exist, so initialize it
			count = "0"
		} else if err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error"})
			return
		}

		// Increment the request count for the IP
		newCount, err := client.Incr(db.Ctx, key).Result()
		if err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error"})
			return
		}

		// Set expiration time only once, when it's the first request (count == 1)
		if count == "0" {
			client.Expire(db.Ctx, key, duration)
			log.Printf("Setting expiration for IP: %s, Duration: %s", ip, duration)
		}

		// Debug log to check request count and IP
		log.Printf("Rate limit check for IP: %s, Count: %d", ip, newCount)

		// Check if the limit is exceeded
		if newCount > int64(limit) {
			ttl, err := client.TTL(db.Ctx, key).Result()
			if err != nil {
				c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error"})
				return
			}
			c.Header("Retry-After", strconv.Itoa(int(ttl.Seconds())))
			c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{"error": "Rate limit exceeded. Try again later.", "ip": c.ClientIP()})
			return
		}

		// Proceed with the request
		c.Next()
	}
}
