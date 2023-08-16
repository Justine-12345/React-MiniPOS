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

func generateRandomInvoiceCode() string {
	rand.Seed(time.Now().UnixNano())
	numbers := "1234567890"
	code := fmt.Sprintf("%c%c%c%c%c%c%c%c", numbers[rand.Intn(len(numbers))], numbers[rand.Intn(len(numbers))], numbers[rand.Intn(len(numbers))], numbers[rand.Intn(len(numbers))], numbers[rand.Intn(len(numbers))], numbers[rand.Intn(len(numbers))], numbers[rand.Intn(len(numbers))], numbers[rand.Intn(len(numbers))])
	return code
}

func Sale() http.HandlerFunc {

	return func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Content-Type", "application/json")

		urlpath := r.URL.Path
		idString := strings.Split(urlpath, "/")[2]
		id, _ := primitive.ObjectIDFromHex(idString)
		var Coll = "sales"

		if r.Method == http.MethodGet && idString == "" {
			// GET ALL***********

			// unwindStage := bson.D{{"$unwind", bson.D{{"path", "$orders"}, {"preserveNullAndEmptyArrays", true}}}}

			// lookupStage1 := bson.D{{"$lookup", bson.D{{"from", "products"}, {"localField", "orders.product._id"}, {"foreignField", "_id"}, {"as", "orders.productData"}}}}

			// unwindStage1 := bson.D{{"$unwind", bson.D{{"path", "$orders.productData"}, {"preserveNullAndEmptyArrays", true}}}}

			// projectStage1 := bson.D{{"$project", bson.D{{"orders.product", 1}}}}

			pipeline := mongo.Pipeline{
				{{"$unwind", bson.D{{"path", "$orders"}, {"preserveNullAndEmptyArrays", true}}}},
				{{"$lookup", bson.D{
					{"from", "products"}, // Change this to the name of your product collection
					{"localField", "orders.product._id"},
					{"foreignField", "_id"},
					{"as", "orders.product"},
				}}},
				{{"$lookup", bson.D{
					{"from", "customers"}, // Change this to the name of your product collection
					{"localField", "customer._id"},
					{"foreignField", "_id"},
					{"as", "customer"},
				}}},
				{{"$unwind", bson.D{{"path", "$customer"}, {"preserveNullAndEmptyArrays", true}}}},
				{{"$unwind", bson.D{{"path", "$orders.product"}, {"preserveNullAndEmptyArrays", true}}}},
				{{"$group", bson.D{
					{"_id", "$_id"},
					{"invoice", bson.D{{"$first", "$invoice"}}},
					{"customer", bson.D{{"$first", "$customer"}}},
					{"amount", bson.D{{"$first", "$amount"}}},
					{"profit", bson.D{{"$first", "$profit"}}},
					{"cash", bson.D{{"$first", "$cash"}}},
					{"change", bson.D{{"$first", "$change"}}},
					{"transactionid", bson.D{{"$first", "$transactionid"}}},
					{"transactiondate", bson.D{{"$first", "$transactiondate"}}},
					{"orders", bson.D{{"$push", "$orders"}}},
				}}},
				{{"$sort", bson.D{{"transactiondate", -1}}}},
			}

			cursor, err := utils.Collection("sales").Aggregate(context.Background(), pipeline)

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

			pipeline := mongo.Pipeline{
				{{"$match", bson.D{{"_id", id}}}},
				{{"$unwind", bson.D{{"path", "$orders"}, {"preserveNullAndEmptyArrays", true}}}},
				{{"$lookup", bson.D{
					{"from", "products"}, // Change this to the name of your product collection
					{"localField", "orders.product._id"},
					{"foreignField", "_id"},
					{"as", "orders.product"},
				}}},
				{{"$lookup", bson.D{
					{"from", "customers"}, // Change this to the name of your product collection
					{"localField", "customer._id"},
					{"foreignField", "_id"},
					{"as", "customer"},
				}}},
				{{"$unwind", bson.D{{"path", "$customer"}, {"preserveNullAndEmptyArrays", true}}}},
				{{"$unwind", bson.D{{"path", "$orders.product"}, {"preserveNullAndEmptyArrays", true}}}},
				{{"$group", bson.D{
					{"_id", "$_id"},
					{"invoice", bson.D{{"$first", "$invoice"}}},
					{"customer", bson.D{{"$first", "$customer"}}},
					{"amount", bson.D{{"$first", "$amount"}}},
					{"profit", bson.D{{"$first", "$profit"}}},
					{"cash", bson.D{{"$first", "$cash"}}},
					{"change", bson.D{{"$first", "$change"}}},
					{"transactionid", bson.D{{"$first", "$transactionid"}}},
					{"transactiondate", bson.D{{"$first", "$transactiondate"}}},
					{"orders", bson.D{{"$push", "$orders"}}},
				}}},
			}

			cursor, err := utils.Collection("sales").Aggregate(context.Background(), pipeline)

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

			var totalAmout int
			var totalProfit int

			var sale models.Sale

			json.NewDecoder(r.Body).Decode(&sale)

			outOfStockErrArray := []string{}

			var allOrder []models.Order

			for _, order := range sale.Orders {
				product := GetProduct(order.Product.ID)

				prodSelling, _ := strconv.Atoi(product.SellingPrice)
				prodProf, _ := strconv.Atoi(product.Profit)
				saleQuan := order.Quantity

				totalAmout += prodSelling * saleQuan
				totalProfit += prodProf * saleQuan

				isReduce := reduceStock(order.Product.ID, order.Quantity)

				if isReduce == false {
					outOfStockErrArray = append(outOfStockErrArray, "Issuficient stock for "+product.Name)
				}

				allOrder = append(allOrder, models.Order{Product: GetProduct(order.Product.ID), Quantity: order.Quantity, Amount: prodSelling * saleQuan})

			}
			fmt.Println(sale.Customer.ID)
			sale.Customer = GetCustomer(sale.Customer.ID)
			sale.Orders = allOrder
			sale.Amount = totalAmout
			sale.Profit = totalProfit
			sale.Change = sale.Cash - totalAmout
			sale.Invoice = generateRandomInvoiceCode()
			sale.TransactionId = generateRandomCode()
			cash := sale.Cash

			currentTime := time.Now()

			currentDateTime := currentTime.Format("2006-01-02 15:04:05")
			sale.TransactionDate = currentDateTime

			if (cash - totalAmout) < 0 {
				json.NewEncoder(w).Encode(map[string]interface{}{"success": false, "message": "Insufficient cash"})
			} else {

				if len(outOfStockErrArray) > 0 {
					json.NewEncoder(w).Encode(map[string]interface{}{"success": false, "message": outOfStockErrArray})
				} else {
					res, err := utils.Collection(Coll).InsertOne(context.Background(), sale)
					if err != nil {
						fmt.Println(err)
						json.NewEncoder(w).Encode(map[string]interface{}{"success": false, "message": err.Error()})
					} else {
						json.NewEncoder(w).Encode(map[string]interface{}{"success": true, "_id": res.InsertedID})
					}
				}

			}

			// Continue ....... REDUCE STOCK AND CASH CHECK

		}

		if r.Method == http.MethodPatch {
			//UPDATE ***********

			var sale models.Sale

			json.NewDecoder(r.Body).Decode(&sale)
			var data = map[string]interface{}{"$set": sale}
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
