// package consumer

// import (
// 	"fmt"
// 	"log"

// 	"github.com/IBM/sarama"
// )

// type NorthConsumer struct {
// 	Consumer sarama.Consumer
// 	Topics   []string
// }

// func NewNorthConsumer(broker string, topics []string) (*NorthConsumer, error) {
// 	config := sarama.NewConfig()
// 	config.Consumer.Return.Errors = true

// 	// Create the consumer
// 	consumer, err := sarama.NewConsumer([]string{broker}, config)
// 	if err != nil {
// 		log.Printf("Error creating consumer: %v", err)
// 		return nil, fmt.Errorf("error creating consumer: %v", err)
// 	}

// 	log.Printf("Kafka consumer created successfully, subscribing to topics: %v", topics)

// 	// Return a NorthConsumer instance with the list of topics
// 	return &NorthConsumer{Consumer: consumer, Topics: topics}, nil
// }

// func (nc *NorthConsumer) Listen() {
// 	defer func() {
// 		if err := nc.Consumer.Close(); err != nil {
// 			log.Printf("Error closing consumer: %v\n", err)
// 		}
// 	}()

// 	// Create a consumer for each topic, listening to partition 0 for each one
// 	for _, topic := range nc.Topics {
// 		partitionConsumer, err := nc.Consumer.ConsumePartition(topic, 0, sarama.OffsetNewest)
// 		if err != nil {
// 			log.Fatalf("Failed to start consumer for partition 0 of topic %s: %v", topic, err)
// 		}
// 		defer partitionConsumer.Close()

// 		// Log that the consumer has started listening
// 		log.Printf("Consumer is now listening to topic: %s from partition 0\n", topic)

// 		// Start a goroutine for each topic to consume messages concurrently
// 		go nc.consumeMessages(partitionConsumer)
// 	}

// 	// Block indefinitely (since we're listening to multiple topics concurrently)
// 	select {}
// }

// func (nc *NorthConsumer) consumeMessages(partitionConsumer sarama.PartitionConsumer) {
// 	for msg := range partitionConsumer.Messages() {
// 		// Log received message and metadata
// 		log.Printf("Received message from topic %s: %s\n", msg.Topic, string(msg.Value))
// 		log.Printf("Message metadata - Partition: %d, Offset: %d\n", msg.Partition, msg.Offset)

// 		// Process the message (e.g., save data to the database or trigger further actions)
// 		if err := processMessage(msg.Topic, msg); err != nil {
// 			log.Printf("Error processing message: %v", err)
// 		} else {
// 			log.Printf("Message processed successfully")
// 		}
// 	}
// }

// func processMessage(topic string, msg *sarama.ConsumerMessage) error {
// 	log.Printf("Processing message: %s \n", string(msg.Value))
// 	switch topic {
// 	case "Inventory":
// 		log.Printf("Processing hospital_admin message: %s", string(msg.Value))

// 	case "hospital_registration":
// 		log.Printf("Processing hospital_registration message: %s", string(msg.Value))

//		default:
//			// Handle any other topics or log an error if the topic is not recognized
//			log.Printf("Received message from unknown topic: %s", topic)
//			// Add your default logic here
//		}
//		return nil
//	}
package consumer

import (
	"encoding/json"
	"fmt"
	"log"

	db "github.com/adityjoshi/Dosahostel/database"
	"github.com/adityjoshi/Dosahostel/models"

	"github.com/IBM/sarama"
)

type NorthConsumer struct {
	Consumer sarama.Consumer
	Topics   []string
}

func NewNorthConsumer(broker string, topics []string) (*NorthConsumer, error) {
	log.Printf("Creating NorthConsumer for broker: %s, topics: %v", broker, topics)
	config := sarama.NewConfig()
	config.Consumer.Return.Errors = true

	// Create the consumer
	consumer, err := sarama.NewConsumer([]string{broker}, config)
	if err != nil {
		log.Printf("Error creating consumer: %v", err)
		return nil, fmt.Errorf("error creating consumer: %v", err)
	}

	log.Printf("Kafka consumer created successfully, subscribing to topics: %v", topics)
	return &NorthConsumer{Consumer: consumer, Topics: topics}, nil
}

func (nc *NorthConsumer) Listen() {
	defer func() {
		if err := nc.Consumer.Close(); err != nil {
			log.Printf("Error closing consumer: %v\n", err)
		}
	}()

	// Create a consumer for each topic, listening to partition 0 for each one
	for _, topic := range nc.Topics {
		partitionConsumer, err := nc.Consumer.ConsumePartition(topic, 0, sarama.OffsetNewest)
		if err != nil {
			log.Fatalf("Failed to start consumer for partition 0 of topic %s: %v", topic, err)
		}
		defer partitionConsumer.Close()

		log.Printf("Consumer is now listening to topic: %s from partition 0\n", topic)

		// Start a goroutine for each topic to consume messages concurrently
		go nc.consumeMessages(partitionConsumer)
	}

	// Block indefinitely (since we're listening to multiple topics concurrently)
	select {}
}

func (nc *NorthConsumer) consumeMessages(partitionConsumer sarama.PartitionConsumer) {
	for msg := range partitionConsumer.Messages() {
		log.Printf("Received message from topic %s: %s\n", msg.Topic, string(msg.Value))
		log.Printf("Message metadata - Partition: %d, Offset: %d\n", msg.Partition, msg.Offset)

		// Process the message (e.g., save data to the database or trigger further actions)
		if err := processMessage(msg); err != nil {
			log.Printf("Error processing message: %v", err)
		} else {
			log.Printf("Message processed successfully")
		}
	}
}

func processMessage(msg *sarama.ConsumerMessage) error {
	log.Printf("Processing message: %s \n", string(msg.Value))

	// Process the Inventory message
	if msg.Topic == "inventory" {
		var inventory models.Inventory
		if err := json.Unmarshal(msg.Value, &inventory); err != nil {
			log.Printf("Failed to unmarshal inventory message: %v", err)
			return err
		}

		if err := saveInventoryData(inventory); err != nil {
			log.Printf("Failed to save inventory data: %v", err)
			return err
		}

		log.Printf("Inventory data processed successfully")
	} else {
		log.Printf("Received message from unknown topic: %s", msg.Topic)
	}

	return nil
}

func saveInventoryData(inventory models.Inventory) error {
	database, err := db.GetDB("north")
	if err != nil || database == nil {
		log.Printf("Database error: %v", err)
		return err
	}

	var inventories []models.Inventory
	inventories = append(inventories, inventory)

	if err := database.CreateInBatches(inventories, 100).Error; err != nil {
		log.Printf("Error inserting inventory data in batch: %v", err)
		return err
	}

	log.Printf("Batch insert successful")
	return nil
}
