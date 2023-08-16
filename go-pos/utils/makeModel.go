package utils

import (
	"log"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"pos.com/connection"
)

func Collection(collName string) *mongo.Collection {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	return connection.Database.Collection(collName)

	// return connection.ConnectMakeDb(os.Getenv("DB_HOST"), os.Getenv("DB_NAME")).Collection(collName)
}
