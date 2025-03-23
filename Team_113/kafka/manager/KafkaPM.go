package manager

import (
	"fmt"
	"log"

	"github.com/adityjoshi/Dosahostel/kafka/producer"
)

type KafkaManager struct {
	NorthProducer *producer.NorthProducer
	SouthProducer *producer.SouthProducer
}

// NewKafkaManager initializes the Kafka producers and returns a KafkaManager instance.
func NewKafkaManager(BigBoysBroker, BoysBroker []string) (*KafkaManager, error) {
	log.Println("Initializing KafkaManager...")
	// Initialize the NorthProducer
	NorthProducer, err := producer.NewNorthProducer(BigBoysBroker)
	if err != nil {
		log.Printf("Error initializing NorthProducer: %v", err)
		return nil, fmt.Errorf("error initializing North producer: %w", err)
	}

	// Initialize the SouthProducer
	SouthProducer, err := producer.NewSouthProducer(BoysBroker)
	if err != nil {
		log.Printf("Error initializing SouthProducer: %v", err)
		return nil, fmt.Errorf("error initializing South producer: %w", err)
	}

	log.Println("KafkaManager initialized successfully with both producers.")
	// Return the KafkaManager instance with both producers
	return &KafkaManager{
		NorthProducer: NorthProducer,
		SouthProducer: SouthProducer,
	}, nil
}

// ComplaintRegistration sends a message to the appropriate Kafka topic based on the hostel region.
func (km *KafkaManager) ComplaintRegistration(hostel, topic, messageString string) error {
	log.Printf("Complaint registration initiated for hostel: %s, topic: %s", hostel, topic)

	var err error

	// Ensure that producers are initialized
	if km.NorthProducer == nil || km.SouthProducer == nil {
		log.Printf("Kafka producers are not properly initialized")
		return fmt.Errorf("kafka producers are not properly initialized")
	}

	// Send message based on the hostel region
	switch hostel {
	case "north":
		if km.NorthProducer == nil {
			log.Printf("North producer is not initialized")
			return fmt.Errorf("north producer is not initialized")
		}
		log.Printf("Sending message to North region, topic: %s", topic)
		err = km.NorthProducer.SendMessage(topic, messageString)

	case "south":
		if km.SouthProducer == nil {
			log.Printf("South producer is not initialized")
			return fmt.Errorf("south producer is not initialized")
		}
		log.Printf("Sending message to South region, topic: %s", topic)
		err = km.SouthProducer.SouthMessage(topic, messageString)

	default:
		log.Printf("Invalid hostel: %s", hostel)
		return fmt.Errorf("invalid hostel: %s", hostel)
	}

	// Check for errors in message sending
	if err != nil {
		log.Printf("Failed to send message to Kafka topic %s in %s region: %v", topic, hostel, err)
		return fmt.Errorf("failed to send message to Kafka topic %s in %s region: %w", topic, hostel, err)
	}

	log.Printf("Message successfully sent to topic %s in %s region", topic, hostel)
	return nil
}
