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

func Category() http.HandlerFunc {

	return func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Content-Type", "application/json")

		urlpath := r.URL.Path
		idString := strings.Split(urlpath, "/")[2]
		id, _ := primitive.ObjectIDFromHex(idString)
		var Coll = "categories"

		if r.Method == http.MethodGet && idString == "" {
			// GET ALL***********
			var categories []models.Category
			res, err := utils.Collection(Coll).Find(context.Background(), bson.D{{}})

			res.All(context.Background(), &categories)

			if err != nil {
				fmt.Println(err)
				json.NewEncoder(w).Encode(map[string]interface{}{"success": "false", "message": err.Error()})
			} else {
				json.NewEncoder(w).Encode(categories)
			}

		}

		if r.Method == http.MethodGet && idString != "" {
			// GET ONE***********
			var category models.Category
			err := utils.Collection(Coll).FindOne(context.Background(), bson.M{"_id": id}).Decode(&category)

			if err != nil {
				fmt.Println(err)
				json.NewEncoder(w).Encode(map[string]interface{}{"success": "false", "message": err.Error()})
			} else {
				json.NewEncoder(w).Encode(category)
			}

		}

		if r.Method == http.MethodPost {
			// INSERT***********

			var category models.Category

			json.NewDecoder(r.Body).Decode(&category)

			res, err := utils.Collection(Coll).InsertOne(context.Background(), category)

			if err != nil {
				fmt.Println(err)
				json.NewEncoder(w).Encode(map[string]interface{}{"success": "false", "message": err.Error()})
			} else {
				json.NewEncoder(w).Encode(map[string]interface{}{"success": "true", "_id": res.InsertedID})
			}
		}

		if r.Method == http.MethodPatch {
			//UPDATE ***********

			var category models.Category

			json.NewDecoder(r.Body).Decode(&category)
			var data = map[string]interface{}{"$set": category}
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

func GetCategory(id primitive.ObjectID) models.Category {
	var category models.Category
	err := utils.Collection("categories").FindOne(context.Background(), bson.M{"_id": id}).Decode(&category)

	if err != nil {
		fmt.Println(err)

	}
	return category
}
