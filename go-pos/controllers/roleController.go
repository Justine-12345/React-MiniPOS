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

func Role() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Content-Type", "application/json")

		urlpath := r.URL.Path
		idString := strings.Split(urlpath, "/")[2]
		id, _ := primitive.ObjectIDFromHex(idString)

		if r.Method == http.MethodGet && idString == "" {
			// GET ALL***********

			fmt.Println(r.Cookie("mycookie"))
			var roles []models.Role
			res, err := utils.Collection("roles").Find(context.Background(), bson.D{{}})

			res.All(context.Background(), &roles)

			lookupStage := bson.D{{"$lookup", bson.D{{"from", "permissions"}, {"localField", "permissions._id"}, {"foreignField", "_id"}, {"as", "permissions"}}}}
			cursor, err := utils.Collection("roles").Aggregate(context.Background(), mongo.Pipeline{lookupStage})

			var showsLoaded []bson.M
			cursor.All(context.Background(), &showsLoaded)

			if err != nil {
				fmt.Println(err)
				json.NewEncoder(w).Encode(map[string]interface{}{"success": "false", "message": err.Error()})
			} else {
				json.NewEncoder(w).Encode(showsLoaded)

			}

		}

		if r.Method == http.MethodGet && idString != "" {
			// GET ONE***********

			isEdit := r.URL.Query().Get("for")

			fmt.Println(isEdit == "edit")

			// var role models.Role

			matchStage := bson.D{{"$match", bson.D{{"_id", id}}}}
			lookupStage := bson.D{{"$lookup", bson.D{{"from", "permissions"}, {"localField", "permissions._id"}, {"foreignField", "_id"}, {"as", "permissions"}}}}
			cursor, err := utils.Collection("roles").Aggregate(context.Background(), mongo.Pipeline{matchStage, lookupStage})

			var showResult []bson.M

			cursor.All(context.Background(), &showResult)

			if err != nil {
				fmt.Println(err)
				json.NewEncoder(w).Encode(map[string]interface{}{"success": false, "message": err.Error()})
			} else {
				json.NewEncoder(w).Encode(showResult[0])
			}

		}

		if r.Method == http.MethodPost {
			// INSERT***********

			var role models.Role

			json.NewDecoder(r.Body).Decode(&role)

			var allRolePermission []models.Permission

			for _, rolePermission := range role.Permissions {
				permission := GetPermission(rolePermission.ID)
				allRolePermission = append(allRolePermission, permission)
			}

			role.Permissions = allRolePermission

			res, err := utils.Collection("roles").InsertOne(context.Background(), role)

			if err != nil {
				fmt.Println(err)
				json.NewEncoder(w).Encode(map[string]interface{}{"success": false, "message": err.Error()})
			} else {
				json.NewEncoder(w).Encode(map[string]interface{}{"success": true, "_id": res.InsertedID})
			}
		}

		if r.Method == http.MethodPatch || r.Method == http.MethodPut {
			//UPDATE ***********

			var role models.Role

			json.NewDecoder(r.Body).Decode(&role)

			var allRolePermission []models.Permission

			fmt.Println(role.Permissions)
			for _, rolePermission := range role.Permissions {
				permission := GetPermission(rolePermission.ID)
				allRolePermission = append(allRolePermission, permission)
			}

			role.Permissions = allRolePermission

			var data = map[string]interface{}{"$set": role}
			_, err := utils.Collection("roles").UpdateOne(context.Background(), bson.M{"_id": id}, data)

			if err != nil {
				fmt.Println(err)
				json.NewEncoder(w).Encode(map[string]interface{}{"success": false, "message": err})
			} else {
				json.NewEncoder(w).Encode(map[string]interface{}{"success": true})
			}

		}

		if r.Method == http.MethodDelete {
			//DELETE ***********

			_, err := utils.Collection("roles").DeleteOne(context.Background(), bson.M{"_id": id})

			if err != nil {
				fmt.Println(err)
				json.NewEncoder(w).Encode(map[string]interface{}{"success": false, "message": &err})
			} else {
				json.NewEncoder(w).Encode(map[string]interface{}{"success": true})
			}

		}
	}
}

func GetRole(id primitive.ObjectID) *models.Role {

	var role models.Role
	err := utils.Collection("roles").FindOne(context.Background(), bson.M{"_id": id}).Decode(&role)

	if err != nil {
		fmt.Println(err)
	}

	return &role

}
