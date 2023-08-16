package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Permission struct {
	ID   primitive.ObjectID `json:"_id" bson:"_id,omitempty"`
	Name string             `json:"name"`
}

type Role struct {
	ID          primitive.ObjectID `json:"_id" bson:"_id,omitempty"`
	Name        string             `json:"name"`
	Permissions []Permission       `json:"permissions" bson:"permissions"`
}

type User struct {
	ID       primitive.ObjectID `json:"_id" bson:"_id,omitempty"`
	Username string             `json:"username"`
	Password string             `json:"password"`
	Fullname string             `json:"fullname"`
	Role     Role               `json:"role"  bson:"role"`
}

type Supplier struct {
	ID            primitive.ObjectID `json:"_id" bson:"_id,omitempty"`
	Name          string             `json:"name"`
	ContactPerson string             `json:"contactPerson"`
	Contact       string             `json:"contact"`
	Note          string             `json:"note"`
}

type Customer struct {
	ID           primitive.ObjectID `json:"_id" bson:"_id,omitempty"`
	Name         string             `json:"name"`
	Address      string             `json:"address"`
	Contact      string             `json:"contact"`
	ProductName  string             `json:"productName"`
	Total        string             `json:"total"`
	Note         string             `json:"note"`
	ExpectedDate string             `json:"expectedDate"`
}

type Category struct {
	ID   primitive.ObjectID `json:"_id" bson:"_id,omitempty"`
	Name string             `json:"name"`
}

type Product struct {
	ID            primitive.ObjectID `json:"_id" bson:"_id,omitempty"`
	Code          string             `json:"code" bson:"code,omitempty"`
	Name          string             `json:"name"`
	Category      Category           `json:"category"`
	Arrival       string             `json:"arrival"`
	Expiry        string             `json:"expiry"`
	SellingPrice  string             `json:"sellingPrice"`
	OriginalPrice string             `json:"originalPrice"`
	Profit        string             `json:"profit"`
	Supplier      Supplier           `json:"supplier"`
	Quantity      string             `json:"quantity"`
}

type Order struct {
	Product  Product `json:"product"`
	Quantity int     `json:"quantity"`
	Amount   int     `json:"amount"`
}

type Sale struct {
	ID              primitive.ObjectID `json:"_id" bson:"_id,omitempty"`
	Customer        Customer           `json:"customer"  bson:"customer"`
	Orders          []Order            `json:"orders"`
	Amount          int                `json:"amount"`
	Profit          int                `json:"profit"`
	Cash            int                `json:"cash"`
	Change          int                `json:"change"`
	Invoice         string             `json:"invoice"`
	TransactionId   string             `json:"transactionId"`
	TransactionDate string             `json:"transactionDate"`
}
