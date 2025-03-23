package producer

import (
	"fmt"
	"log"

	"github.com/IBM/sarama"
)

type NorthProducer struct {
	producer sarama.SyncProducer
}

// NewNorthProducer initializes and returns a new NorthProducer
func NewNorthProducer(brokers []string) (*NorthProducer, error) {
	log.Printf("Initializing NorthProducer with brokers: %v", brokers)
	config := sarama.NewConfig()
	config.Producer.RequiredAcks = sarama.WaitForAll
	config.Producer.Retry.Max = 5
	config.Producer.Return.Successes = true

	producer, err := sarama.NewSyncProducer(brokers, config)
	if err != nil {
		log.Printf("Failed to initialize NorthProducer: %v", err)
		return nil, fmt.Errorf("failed to start North Kafka producer: %w", err)
	}

	log.Println("NorthProducer initialized successfully")
	return &NorthProducer{producer: producer}, nil
}

// SendMessage sends a message to a specific topic in the North region
func (p *NorthProducer) SendMessage(topic, message string) error {
	log.Printf("Producer received message for topic %s: %s", topic, message)
	msg := &sarama.ProducerMessage{
		Topic: topic,
		Value: sarama.StringEncoder(message),
	}
	_, _, err := p.producer.SendMessage(msg)
	if err != nil {
		log.Printf("Failed to send message to topic %s: %v", topic, err)
		return err
	}
	log.Printf("Message successfully sent to topic %s in North region", topic)
	return nil
}
