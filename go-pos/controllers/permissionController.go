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

func Permission() http.HandlerFunc {

	return func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Methods", "POST, PUT, PATCH, GET, DELETE, OPTIONS")

		urlpath := r.URL.Path
		idString := strings.Split(urlpath, "/")[2]
		id, _ := primitive.ObjectIDFromHex(idString)

		if r.Method == http.MethodGet && idString == "" {
			// GET ALL***********

			cursor, err := utils.Collection("permissions").Find(context.Background(), bson.D{{}})

			if err != nil {
				fmt.Println(err)
				json.NewEncoder(w).Encode(map[string]interface{}{"success": false, "message": err})
			} else {
				var permissions []models.Permission

				cursor.All(context.Background(), &permissions)

				jsonRes, _ := json.Marshal(permissions)

				w.Write(jsonRes)
			}

		}

		if r.Method == http.MethodGet && idString != "" {
			var permissions models.Permission
			err := utils.Collection("permissions").FindOne(context.Background(), bson.M{"_id": id}).Decode(&permissions)

			if err != nil {
				fmt.Println(err)
				json.NewEncoder(w).Encode(map[string]interface{}{"success": false, "message": err.Error()})
			} else {
				json.NewEncoder(w).Encode(permissions)
			}

		}

		if r.Method == http.MethodPost {

			var permissions models.Permission

			json.NewDecoder(r.Body).Decode(&permissions)

			res, err := utils.Collection("permissions").InsertOne(context.Background(), permissions)

			if err != nil {
				fmt.Println(err)
				json.NewEncoder(w).Encode(map[string]interface{}{"success": false, "message": err})
			} else {
				json.NewEncoder(w).Encode(map[string]interface{}{"success": true, "_id": res.InsertedID})
			}

		}

		if r.Method == http.MethodPatch {
			//UPDATE ***********
			var permissions models.Permission

			json.NewDecoder(r.Body).Decode(&permissions)
			var data = map[string]interface{}{"$set": permissions}
			_, err := utils.Collection("permissions").UpdateOne(context.Background(), bson.M{"_id": id}, data)

			if err != nil {
				fmt.Println(err)
				json.NewEncoder(w).Encode(map[string]interface{}{"success": false, "message": err})
			} else {
				json.NewEncoder(w).Encode(map[string]interface{}{"success": true})
			}

		}

		if r.Method == http.MethodDelete {
			//DELETE ***********

			_, err := utils.Collection("permissions").DeleteOne(context.Background(), bson.M{"_id": id})

			if err != nil {
				fmt.Println(err)
				json.NewEncoder(w).Encode(map[string]interface{}{"success": false, "message": &err})
			} else {
				json.NewEncoder(w).Encode(map[string]interface{}{"success": true})
			}

		}
	}

}

func GetPermission(id primitive.ObjectID) models.Permission {
	var permissions models.Permission
	err := utils.Collection("permissions").FindOne(context.Background(), bson.M{"_id": id}).Decode(&permissions)

	if err != nil {
		fmt.Println(err)

	}
	return permissions
}
