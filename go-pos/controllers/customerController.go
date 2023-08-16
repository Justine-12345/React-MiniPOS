package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"pos.com/models"
	"pos.com/utils"
)

func Customer() http.HandlerFunc {

	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		urlpath := r.URL.Path
		idString := strings.Split(urlpath, "/")[2]
		id, _ := primitive.ObjectIDFromHex(idString)
		var Coll = "customers"

		if r.Method == http.MethodGet && idString == "" {
			// GET ALL***********
			var customers []models.Customer
			res, err := utils.Collection(Coll).Find(context.Background(), bson.D{{}})

			res.All(context.Background(), &customers)

			if err != nil {
				fmt.Println(err)
				json.NewEncoder(w).Encode(map[string]interface{}{"success": "false", "message": err.Error()})
			} else {
				json.NewEncoder(w).Encode(customers)
			}

		}

		if r.Method == http.MethodGet && idString != "" {
			// GET ONE***********
			var customer models.Customer
			err := utils.Collection(Coll).FindOne(context.Background(), bson.M{"_id": id}).Decode(&customer)

			if err != nil {
				fmt.Println(err)
				json.NewEncoder(w).Encode(map[string]interface{}{"success": "false", "message": err.Error()})
			} else {
				json.NewEncoder(w).Encode(customer)
			}

		}

		if r.Method == http.MethodPost {
			// INSERT***********

			var customer models.Customer

			json.NewDecoder(r.Body).Decode(&customer)

			res, err := utils.Collection(Coll).InsertOne(context.Background(), customer)

			if err != nil {
				fmt.Println(err)
				json.NewEncoder(w).Encode(map[string]interface{}{"success": "false", "message": err.Error()})
			} else {
				json.NewEncoder(w).Encode(map[string]interface{}{"success": "true", "_id": res.InsertedID})
			}
		}

		if r.Method == http.MethodPatch {
			//UPDATE ***********

			var customer models.Customer

			json.NewDecoder(r.Body).Decode(&customer)
			var data = map[string]interface{}{"$set": customer}
			_, err := utils.Collection(Coll).UpdateOne(context.Background(), bson.M{"_id": id}, data)

			if err != nil {
				fmt.Println(err)
				json.NewEncoder(w).Encode(map[string]interface{}{"success": "false", "message": err})
			} else {
				json.NewEncoder(w).Encode(map[string]interface{}{"success": "true"})
			}

		}

		if r.Method == http.MethodDelete {
			//DELETE ***********

			_, err := utils.Collection(Coll).DeleteOne(context.Background(), bson.M{"_id": id})

			if err != nil {
				fmt.Println(err)
				json.NewEncoder(w).Encode(map[string]interface{}{"success": "false", "message": &err})
			} else {
				json.NewEncoder(w).Encode(map[string]interface{}{"success": "true"})
			}

		}
	}
}

func GetCustomer(id primitive.ObjectID) models.Customer {
	var customer models.Customer
	err := utils.Collection("customers").FindOne(context.Background(), bson.M{"_id": id}).Decode(&customer)

	if err != nil {
		fmt.Println(err)

	}
	return customer
}
