package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"pos.com/models"
	"pos.com/utils"
)

func Login() http.HandlerFunc {

	return func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Content-Type", "application/json")

		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")

		w.Header().Set("Access-Control-Allow-Methods", "POST, PUT, PATCH, GET, DELETE, OPTIONS")

		w.Header().Set("Access-Control-Allow-Headers", "*")

		w.Header().Set("Access-Control-Allow-Credentials", "true")

		if r.Method == http.MethodPost {

			fmt.Println(r.Method)

			var User []models.User
			var req models.User

			json.NewDecoder(r.Body).Decode(&req)

			// err := utils.Collection("users").FindOne(context.Background(), bson.M{"username": req.Username}).Decode(&User)

			matchStage := bson.D{{"$match", bson.D{{"username", req.Username}}}}

			lookupStage := bson.D{{"$lookup", bson.D{{"from", "roles"}, {"localField", "role._id"}, {"foreignField", "_id"}, {"as", "role"}}}}

			unwindStage := bson.D{{"$unwind", bson.D{{"path", "$role"}, {"preserveNullAndEmptyArrays", true}}}}

			lookupStage2 := bson.D{{"$lookup", bson.D{{"from", "permissions"}, {"localField", "role.permissions._id"}, {"foreignField", "_id"}, {"as", "role.permissions"}}}}

			cursor, err := utils.Collection("users").Aggregate(context.Background(), mongo.Pipeline{matchStage, lookupStage, unwindStage, lookupStage2})

			cursor.All(context.Background(), &User)

			if err != nil {
				json.NewEncoder(w).Encode(map[string]interface{}{"success": false, "message": "User Not found"})
			} else {

				if req.Password == User[0].Password {

					var (
						t *jwt.Token
						s string
					)

					key := []byte("posbackendsecret")
					t = jwt.NewWithClaims(jwt.SigningMethodHS256,
						jwt.MapClaims{
							"user": User[0],
						})
					s, _ = t.SignedString(key)

					cookie := http.Cookie{
						Name:    "posCookie",
						Value:   s,
						Expires: time.Now().Add(24 * time.Hour),
						Path:    "/",
					}

					// Set the cookie in the response
					http.SetCookie(w, &cookie)

					json.NewEncoder(w).Encode(map[string]interface{}{"success": true, "user": &User[0]})
				} else {
					json.NewEncoder(w).Encode(map[string]interface{}{"success": false, "message": "Wrong password"})
				}

			}

		}

	}

}

func Logout() http.HandlerFunc {

	return func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Content-Type", "application/json")

		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")

		w.Header().Set("Access-Control-Allow-Methods", "POST, PUT, PATCH, GET, DELETE, OPTIONS")

		w.Header().Set("Access-Control-Allow-Headers", "*")

		w.Header().Set("Access-Control-Allow-Credentials", "true")

		if r.Method == http.MethodGet {

			expiredCookie := http.Cookie{
				Name:    "posCookie", // Replace with your cookie name
				Value:   "",
				Expires: time.Now().Add(-time.Hour), // Set expiration in the past
				Path:    "/",
			}

			// Set the expired cookie in the response, effectively removing it
			http.SetCookie(w, &expiredCookie)
			json.NewEncoder(w).Encode(map[string]interface{}{"success": true})

		}

	}

}

func GetAuthUser() http.HandlerFunc {

	return func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")

		w.Header().Set("Content-Type", "application/json")

		w.Header().Set("Access-Control-Allow-Methods", "POST, PUT, PATCH, GET, DELETE, OPTIONS")

		w.Header().Set("Access-Control-Allow-Headers", "*")

		w.Header().Set("Access-Control-Allow-Credentials", "true")

		if r.Method == http.MethodGet {
			res := GetAuhtUserFunc(w, r)
			if len(res) > 0 {
				json.NewEncoder(w).Encode(res)
			}

		}

	}

}

func GetAuhtUserFunc(w http.ResponseWriter, r *http.Request) jwt.MapClaims {

	res := r.Header.Get("Authorization")

	fmt.Println(r.URL.Host)

	tokenString := res

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte("posbackendsecret"), nil
	})

	if err != nil {
		fmt.Println("Error Token1")
		// w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]interface{}{"success": false})
		return jwt.MapClaims{}

	} else {
		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {

			for key, claim := range claims {

				if key == "user" { // Assuming the user information is stored under the "user" claim
					if userMap, ok := claim.(map[string]interface{}); ok {

						for k, um := range userMap {
							if k == "_id" {

								objId, _ := primitive.ObjectIDFromHex(um.(string))

								res := GetUserFunc(objId)

								return jwt.MapClaims{"authUser": res}
							}
						}

					}
				}

			}

			return claims

		} else {
			fmt.Println("Error Token2")
			// w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(map[string]interface{}{"success": false})

			return jwt.MapClaims{}
		}
	}

}

func HasPermission(permission string, w http.ResponseWriter, r *http.Request) {

	claims := GetAuhtUserFunc(w, r)
	if len(claims) > 0 {
		for _, claim := range claims {
			claimMap, _ := claim.(primitive.M)
			id, _ := claimMap["_id"]
			idPri := id.(primitive.ObjectID)
			GetUserPermissionFunc(idPri)

		}
	}

}
