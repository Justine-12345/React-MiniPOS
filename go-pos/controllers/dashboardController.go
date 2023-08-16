package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"pos.com/utils"
)

func Dashboard() http.HandlerFunc {

	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		urlpath := r.URL.Path
		idString := strings.Split(urlpath, "/")[2]
		// id, _ := primitive.ObjectIDFromHex(idString)

		if r.Method == http.MethodGet && idString == "" {
			// GET ALL***********

			// SALES PER MONTH
			pipeline1 := mongo.Pipeline{
				{{"$addFields", bson.D{{"date_started", bson.D{{"$toDate", "$transactiondate"}}}}}},
				{{"$group", bson.D{
					{"_id", bson.D{
						{"year", bson.D{{"$year", "$date_started"}}},
						{"month", bson.D{{"$month", "$date_started"}}},
					}},
					{"total_sale_month", bson.D{{"$sum", "$amount"}}},
				}}},
			}

			// TOP 10 BEST SELLING PRODUCT
			pipeline2 := mongo.Pipeline{
				{{"$unwind", bson.D{{"path", "$orders"}, {"preserveNullAndEmptyArrays", true}}}},
				{{"$lookup", bson.D{
					{"from", "products"}, // Change this to the name of your product collection
					{"localField", "orders.product._id"},
					{"foreignField", "_id"},
					{"as", "orders.product"},
				}}},
				{{"$unwind", bson.D{{"path", "$orders.product"}, {"preserveNullAndEmptyArrays", false}}}},
				{{"$group", bson.D{
					{"_id", bson.D{
						{"product", "$orders.product.name"},
					}},
					{"total", bson.D{{"$sum", "$orders.amount"}}},
				}}},
				{{"$sort", bson.D{{"total", -1}}}},
				{{"$limit", 10}},
			}

			// PROFIT PER MONTH
			pipeline3 := mongo.Pipeline{
				{{"$addFields", bson.D{{"date_started", bson.D{{"$toDate", "$transactiondate"}}}}}},
				{{"$group", bson.D{
					{"_id", bson.D{
						{"year", bson.D{{"$year", "$date_started"}}},
						{"month", bson.D{{"$month", "$date_started"}}},
					}},
					{"total_profit_month", bson.D{{"$sum", "$profit"}}},
				}}},
			}

			pipeline4 := mongo.Pipeline{
				{{"$group", bson.D{
					{"_id", nil},
					{"totalSale", bson.D{{"$sum", "$amount"}}},
					{"totalProfit", bson.D{{"$sum", "$profit"}}},
				}}},
			}

			pipeline5 := mongo.Pipeline{
				{{"$group", bson.D{
					{"_id", nil},
					{"totalProduct", bson.D{{"$sum", 1}}},
				}}},
			}

			cursor1, err := utils.Collection("sales").Aggregate(context.Background(), pipeline1)
			cursor2, err := utils.Collection("sales").Aggregate(context.Background(), pipeline2)
			cursor3, err := utils.Collection("sales").Aggregate(context.Background(), pipeline3)
			cursor4, err := utils.Collection("sales").Aggregate(context.Background(), pipeline4)
			cursor5, err := utils.Collection("products").Aggregate(context.Background(), pipeline5)

			var salesPerMonth []bson.M
			var bestSelling []bson.M
			var profitPerMonth []bson.M
			var totalSalesProfit []bson.M
			var totalProduct []bson.M

			if err != nil {
				fmt.Println(err)
				json.NewEncoder(w).Encode(map[string]interface{}{"success": "false", "message": err.Error()})
			} else {

				cursor1.All(context.Background(), &salesPerMonth)
				cursor2.All(context.Background(), &bestSelling)
				cursor3.All(context.Background(), &profitPerMonth)
				cursor4.All(context.Background(), &totalSalesProfit)
				cursor5.All(context.Background(), &totalProduct)

				json.NewEncoder(w).Encode(map[string]interface{}{"totalProduct": totalProduct, "totalSalesProfit": totalSalesProfit, "salesPerMonth": salesPerMonth, "bestSelling": bestSelling, "profitPerMonth": profitPerMonth})
			}

		}

	}
}
