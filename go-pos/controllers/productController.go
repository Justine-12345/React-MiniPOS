package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"strconv"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"pos.com/models"
	"pos.com/utils"
)

func generateRandomCode() string {
	rand.Seed(time.Now().UnixNano())
	letters := "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
	numbers := "1234567890"
	code := fmt.Sprintf("%c%c%c%c-%c%c%c%c", letters[rand.Intn(len(letters))], letters[rand.Intn(len(letters))], letters[rand.Intn(len(letters))], letters[rand.Intn(len(letters))], numbers[rand.Intn(len(numbers))], numbers[rand.Intn(len(numbers))], numbers[rand.Intn(len(numbers))], numbers[rand.Intn(len(numbers))])
	return code
}

func Product() http.HandlerFunc {

	return func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Content-Type", "application/json")

		urlpath := r.URL.Path
		idString := strings.Split(urlpath, "/")[2]
		id, _ := primitive.ObjectIDFromHex(idString)
		var Coll = "products"

		if r.Method == http.MethodGet && idString == "" {
			// GET ALL***********

			lookupStage := bson.D{{"$lookup", bson.D{{"from", "categories"}, {"localField", "category._id"}, {"foreignField", "_id"}, {"as", "category"}}}}

			unwindStage := bson.D{{"$unwind", bson.D{{"path", "$category"}, {"preserveNullAndEmptyArrays", true}}}}

			lookupStage1 := bson.D{{"$lookup", bson.D{{"from", "suppliers"}, {"localField", "supplier._id"}, {"foreignField", "_id"}, {"as", "supplier"}}}}

			unwindStage1 := bson.D{{"$unwind", bson.D{{"path", "$supplier"}, {"preserveNullAndEmptyArrays", true}}}}

			cursor, err := utils.Collection("products").Aggregate(context.Background(), mongo.Pipeline{lookupStage, unwindStage, lookupStage1, unwindStage1})

			var showResult []bson.M

			cursor.All(context.Background(), &showResult)

			if err != nil {
				fmt.Println(err)
				json.NewEncoder(w).Encode(map[string]interface{}{"success": "false", "message": err.Error()})
			} else {
				json.NewEncoder(w).Encode(showResult)
			}

		}

		if r.Method == http.MethodGet && idString != "" {
			// GET ONE***********

			matchStage := bson.D{{"$match", bson.D{{"_id", id}}}}

			lookupStage := bson.D{{"$lookup", bson.D{{"from", "categories"}, {"localField", "category._id"}, {"foreignField", "_id"}, {"as", "category"}}}}

			unwindStage := bson.D{{"$unwind", bson.D{{"path", "$category"}, {"preserveNullAndEmptyArrays", true}}}}

			lookupStage1 := bson.D{{"$lookup", bson.D{{"from", "suppliers"}, {"localField", "supplier._id"}, {"foreignField", "_id"}, {"as", "supplier"}}}}

			unwindStage1 := bson.D{{"$unwind", bson.D{{"path", "$supplier"}, {"preserveNullAndEmptyArrays", true}}}}

			cursor, err := utils.Collection("products").Aggregate(context.Background(), mongo.Pipeline{matchStage, lookupStage, unwindStage, lookupStage1, unwindStage1})

			var showResult []bson.M

			cursor.All(context.Background(), &showResult)

			if err != nil {
				fmt.Println(err)
				json.NewEncoder(w).Encode(map[string]interface{}{"success": "false", "message": err.Error()})
			} else {
				json.NewEncoder(w).Encode(showResult[0])
			}

		}

		if r.Method == http.MethodPost {
			// INSERT***********

			var product models.Product

			json.NewDecoder(r.Body).Decode(&product)

			product.Code = generateRandomCode()
			sellPrice, err := strconv.Atoi(product.SellingPrice)
			origPrice, err := strconv.Atoi(product.OriginalPrice)
			product.Profit = strconv.Itoa(sellPrice - origPrice)

			product.Category = GetCategory(product.Category.ID)
			product.Supplier = GetSupplier(product.Supplier.ID)

			res, err := utils.Collection(Coll).InsertOne(context.Background(), product)

			if err != nil {
				fmt.Println(err)
				json.NewEncoder(w).Encode(map[string]interface{}{"success": "false", "message": err.Error()})
			} else {
				json.NewEncoder(w).Encode(map[string]interface{}{"success": "true", "_id": res.InsertedID})
			}
		}

		if r.Method == http.MethodPatch {
			//UPDATE ***********

			var product models.Product
			json.NewDecoder(r.Body).Decode(&product)

			sellPrice, err := strconv.Atoi(product.SellingPrice)
			origPrice, err := strconv.Atoi(product.OriginalPrice)
			product.Profit = strconv.Itoa(sellPrice - origPrice)

			product.Category = GetCategory(product.Category.ID)
			product.Supplier = GetSupplier(product.Supplier.ID)

			var data = map[string]interface{}{"$set": product}

			res, err := utils.Collection(Coll).UpdateOne(context.Background(), bson.M{"_id": id}, data)

			if err != nil {
				fmt.Println(err)
				json.NewEncoder(w).Encode(map[string]interface{}{"success": "false", "message": err})
			} else {
				fmt.Println(res)
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

func GetProduct(id primitive.ObjectID) models.Product {

	var Coll = "products"
	var product models.Product
	err := utils.Collection(Coll).FindOne(context.Background(), bson.M{"_id": id}).Decode(&product)

	fmt.Println(err)

	return product

}

func reduceStock(id primitive.ObjectID, reduceNum int) bool {

	var product models.Product
	var Coll = "products"
	err := utils.Collection(Coll).FindOne(context.Background(), bson.M{"_id": id}).Decode(&product)

	if err != nil {
		fmt.Println(err)
	}

	prodQuan, _ := strconv.Atoi(product.Quantity)
	product.Quantity = strconv.Itoa(prodQuan - reduceNum)

	fmt.Println("remainQuant")
	fmt.Println(prodQuan - reduceNum)

	if (prodQuan - reduceNum) <= 0 {
		return false

	} else {
		var data = map[string]interface{}{"$set": product}

		res, err := utils.Collection(Coll).UpdateOne(context.Background(), bson.M{"_id": id}, data)

		if err != nil {
			fmt.Println(err)
		} else {
			if res.ModifiedCount >= 1 {
				return true
			}

		}
		return false
	}

}
