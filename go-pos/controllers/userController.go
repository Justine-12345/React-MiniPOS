package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"pos.com/models"
	"pos.com/utils"
)

func User() http.HandlerFunc {

	return func(w http.ResponseWriter, r *http.Request) {

		urlpath := r.URL.Path
		idString := strings.Split(urlpath, "/")[2]
		id, _ := primitive.ObjectIDFromHex(idString)

		w.Header().Set("Content-Type", "application/json")

		if r.Method == http.MethodGet && idString == "" {

			// HasPermission("user list", w, r)

			lookupStage := bson.D{{"$lookup", bson.D{{"from", "roles"}, {"localField", "role._id"}, {"foreignField", "_id"}, {"as", "role"}}}}

			unwindStage := bson.D{{"$unwind", bson.D{{"path", "$role"}, {"preserveNullAndEmptyArrays", true}}}}

			lookupStage2 := bson.D{{"$lookup", bson.D{{"from", "permissions"}, {"localField", "role.permissions._id"}, {"foreignField", "_id"}, {"as", "role.permissions"}}}}

			sortStage2 := bson.D{{"$sort", bson.D{{"_id", -1}}}}

			cursor, err := utils.Collection("users").Aggregate(context.Background(), mongo.Pipeline{lookupStage, unwindStage, lookupStage2, sortStage2})

			var showResult []bson.M

			if err != nil {
				fmt.Println("Erorr: ")
				fmt.Println(err)
				json.NewEncoder(w).Encode(map[string]interface{}{"success": false, "message": err})
			} else {

				cursor.All(context.Background(), &showResult)
				jsonData, _ := json.Marshal(showResult)

				w.Write(jsonData)
			}

		}

		if r.Method == http.MethodGet && idString != "" {

			matchStage := bson.D{{"$match", bson.D{{"_id", id}}}}

			lookupStage := bson.D{{"$lookup", bson.D{{"from", "roles"}, {"localField", "role._id"}, {"foreignField", "_id"}, {"as", "role"}}}}

			unwindStage := bson.D{{"$unwind", bson.D{{"path", "$role"}, {"preserveNullAndEmptyArrays", true}}}}

			lookupStage2 := bson.D{{"$lookup", bson.D{{"from", "permissions"}, {"localField", "role.permissions._id"}, {"foreignField", "_id"}, {"as", "role.permissions"}}}}

			cursor, err := utils.Collection("users").Aggregate(context.Background(), mongo.Pipeline{matchStage, lookupStage, unwindStage, lookupStage2})

			var showResult []bson.M

			cursor.All(context.Background(), &showResult)

			if err != nil {
				json.NewEncoder(w).Encode(map[string]interface{}{"success": "false", "message": err.Error()})
			}

			json.NewEncoder(w).Encode(&showResult[0])

		}

		if r.Method == http.MethodPost {
			// INSERT USER***********
			var data models.User
			json.NewDecoder(r.Body).Decode(&data)

			userRole := GetRole(data.Role.ID)
			data.Role = *userRole

			_, err := utils.Collection("users").InsertOne(context.Background(), data)

			if err != nil {
				fmt.Println("Erorr: ")
				fmt.Println(err)
				json.NewEncoder(w).Encode(map[string]interface{}{"success": "false", "message": err.Error()})
			}

			json.NewEncoder(w).Encode(map[string]interface{}{"success": true, "user": data})
		}

		if r.Method == http.MethodPatch || r.Method == http.MethodPut || r.Method == http.MethodOptions {

			//UPDATE USER ***********

			var data models.User

			json.NewDecoder(r.Body).Decode(&data)
			userRole := GetRole(data.Role.ID)
			data.Role = *userRole

			var updatedData = map[string]interface{}{"$set": data}

			_, err := utils.Collection("users").UpdateOne(context.Background(), bson.M{"_id": id}, updatedData)

			if err != nil {
				fmt.Println("Erorr: ")
				fmt.Println(err)
				json.NewEncoder(w).Encode(map[string]interface{}{"success": "false", "message": err})
			} else {
				json.NewEncoder(w).Encode(map[string]interface{}{"success": true})
			}

		}

		if r.Method == http.MethodDelete {
			// DELETE USER

			_, err := utils.Collection("users").DeleteOne(context.Background(), bson.M{"_id": id})

			if err != nil {
				fmt.Println("Erorr: ")
				fmt.Println(err)
				json.NewEncoder(w).Encode(map[string]interface{}{"success": false, "message": err})
			} else {
				json.NewEncoder(w).Encode(map[string]interface{}{"success": true})
			}

		}

	}

}

func GetUserFunc(id primitive.ObjectID) interface{} {

	matchStage := bson.D{{"$match", bson.D{{"_id", id}}}}

	lookupStage := bson.D{{"$lookup", bson.D{{"from", "roles"}, {"localField", "role._id"}, {"foreignField", "_id"}, {"as", "role"}}}}

	unwindStage := bson.D{{"$unwind", bson.D{{"path", "$role"}, {"preserveNullAndEmptyArrays", true}}}}

	lookupStage2 := bson.D{{"$lookup", bson.D{{"from", "permissions"}, {"localField", "role.permissions._id"}, {"foreignField", "_id"}, {"as", "role.permissions"}}}}

	cursor, _ := utils.Collection("users").Aggregate(context.Background(), mongo.Pipeline{matchStage, lookupStage, unwindStage, lookupStage2})

	var showResult []bson.M

	cursor.All(context.Background(), &showResult)

	return showResult[0]
}

func GetUserPermissionFunc(id primitive.ObjectID) interface{} {

	unwindStagePer := bson.D{{"$unwind", bson.D{{"path", "$role.permissions"}, {"preserveNullAndEmptyArrays", true}}}}
	lookupStage := bson.D{{"$lookup", bson.D{{"from", "roles"}, {"localField", "role._id"}, {"foreignField", "_id"}, {"as", "role"}}}}
	lookupStage1 := bson.D{{"$lookup", bson.D{{"from", "permissions"}, {"localField", "role.permissions._id"}, {"foreignField", "_id"}, {"as", "role.permissions"}}}}

	cursor, _ := utils.Collection("users").Aggregate(context.Background(), mongo.Pipeline{unwindStagePer, lookupStage, lookupStage1})

	var showResult []bson.M

	cursor.All(context.Background(), &showResult)

	fmt.Println(showResult)

	return showResult[0]
}
