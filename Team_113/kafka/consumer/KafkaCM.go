package consumer

// consumer/consumerFile.go

import (
	"fmt"
	"log"
)

func StartConsumer(region string) {
	kafkaBroker := "kafka:9092"
	var topic = []string{
		"inventory", // Add other topics as necessary
	}

	log.Printf("Starting consumer for region: %s, connecting to Kafka broker: %s", region, kafkaBroker)

	switch region {
	case "north":
		log.Println("Initializing North region consumer...")
		northConsumer, err := NewNorthConsumer(kafkaBroker, topic)
		if err != nil {
			log.Fatalf("Failed to create north consumer: %v", err)
		}
		log.Println("North consumer created successfully, starting to listen...")
		northConsumer.Listen()

	case "south":
		log.Println("Initializing South region consumer...")
		// Similar setup for the south region consumer
		fmt.Println("Starting south consumer...")

	case "east":
		log.Println("Initializing East region consumer...")
		// Similar setup for the east region consumer
		fmt.Println("Starting east consumer...")

	case "west":
		log.Println("Initializing West region consumer...")
		// Similar setup for the west region consumer
		fmt.Println("Starting west consumer...")

	default:
		log.Printf("Unknown region: %s. Cannot start consumer.", region)
		fmt.Println("Unknown region:", region)
	}
}
