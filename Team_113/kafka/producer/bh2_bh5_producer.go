package producer

import (
	"fmt"
	"log"

	"github.com/IBM/sarama"
)

type SouthProducer struct {
	producer sarama.SyncProducer
}

// BigBoysProducer initializes and returns a new NorthProducer
func NewSouthProducer(brokers []string) (*SouthProducer, error) {
	config := sarama.NewConfig()
	config.Producer.RequiredAcks = sarama.WaitForAll
	config.Producer.Retry.Max = 5
	config.Producer.Return.Successes = true

	producer, err := sarama.NewSyncProducer(brokers, config)
	if err != nil {
		return nil, fmt.Errorf("failed to start North Kafka producer: %w", err)
	}

	return &SouthProducer{producer: producer}, nil
}

// SendMessage sends a message to a specific topic in the North region
func (p *SouthProducer) SouthMessage(topic, message string) error {
	log.Printf("Producer received message: %s", message)
	msg := &sarama.ProducerMessage{
		Topic: topic,
		Value: sarama.StringEncoder(message),
	}
	_, _, err := p.producer.SendMessage(msg)
	if err != nil {
		log.Printf("Failed to send message to topic %s: %v", topic, err)
		return err
	}
	log.Printf("Message sent to topic %s in BH2-BH5 region", topic)
	return nil
}
