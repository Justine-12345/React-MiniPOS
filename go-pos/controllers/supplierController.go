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

func Supplier() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Content-Type", "application/json")


		urlpath := r.URL.Path
		idString := strings.Split(urlpath, "/")[2]
		id, _ := primitive.ObjectIDFromHex(idString)

		if r.Method == http.MethodGet && idString == "" {
			// GET ALL***********
			var suppliers []models.Supplier
			res, err := utils.Collection("suppliers").Find(context.Background(), bson.D{{}})

			res.All(context.Background(), &suppliers)

			if err != nil {
				fmt.Println(err)
				json.NewEncoder(w).Encode(map[string]interface{}{"success": "false", "message": err.Error()})
			} else {
				json.NewEncoder(w).Encode(suppliers)
			}

		}

		if r.Method == http.MethodGet && idString != "" {
			// GET ONE***********
			var supplier models.Supplier
			err := utils.Collection("suppliers").FindOne(context.Background(), bson.M{"_id": id}).Decode(&supplier)

			if err != nil {
				fmt.Println(err)
				json.NewEncoder(w).Encode(map[string]interface{}{"success": "false", "message": err.Error()})
			} else {
				json.NewEncoder(w).Encode(supplier)
			}

		}

		if r.Method == http.MethodPost {
			// INSERT***********

			var supplier models.Supplier

			json.NewDecoder(r.Body).Decode(&supplier)

			res, err := utils.Collection("suppliers").InsertOne(context.Background(), supplier)

			if err != nil {
				fmt.Println(err)
				json.NewEncoder(w).Encode(map[string]interface{}{"success": "false", "message": err.Error()})
			} else {
				json.NewEncoder(w).Encode(map[string]interface{}{"success": "true", "_id": res.InsertedID})
			}
		}

		if r.Method == http.MethodPatch {
			//UPDATE ***********

			var supplier models.Supplier

			json.NewDecoder(r.Body).Decode(&supplier)
			var data = map[string]interface{}{"$set": supplier}
			_, err := utils.Collection("suppliers").UpdateOne(context.Background(), bson.M{"_id": id}, data)

			if err != nil {
				fmt.Println(err)
				json.NewEncoder(w).Encode(map[string]interface{}{"success": "false", "message": err})
			} else {
				json.NewEncoder(w).Encode(map[string]interface{}{"success": "true"})
			}

		}

		if r.Method == http.MethodDelete {
			//DELETE ***********

			_, err := utils.Collection("suppliers").DeleteOne(context.Background(), bson.M{"_id": id})

			if err != nil {
				fmt.Println(err)
				json.NewEncoder(w).Encode(map[string]interface{}{"success": "false", "message": &err})
			} else {
				json.NewEncoder(w).Encode(map[string]interface{}{"success": "true"})
			}

		}
	}
}

func GetSupplier(id primitive.ObjectID) models.Supplier {

	var supplier models.Supplier
	err := utils.Collection("suppliers").FindOne(context.Background(), bson.M{"_id": id}).Decode(&supplier)

	if err != nil {
		fmt.Println(err)
	}

	return supplier

}
