package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/rs/cors"
	"pos.com/connection"
	"pos.com/controllers"
)

func main() {

	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	connection.ConnectMakeDb(os.Getenv("DB_HOST"), os.Getenv("DB_NAME"))

	mux := http.NewServeMux()

	mux.HandleFunc("/user/", controllers.User())
	mux.HandleFunc("/permission/", controllers.Permission())
	mux.HandleFunc("/role/", controllers.Role())
	mux.HandleFunc("/supplier/", controllers.Supplier())
	mux.HandleFunc("/customer/", controllers.Customer())
	mux.HandleFunc("/category/", controllers.Category())
	mux.HandleFunc("/product/", controllers.Product())
	mux.HandleFunc("/sale/", controllers.Sale())
	mux.HandleFunc("/login/", controllers.Login())
	mux.HandleFunc("/auth-user/", controllers.GetAuthUser())
	mux.HandleFunc("/logout/", controllers.Logout())
	mux.HandleFunc("/dashboard/", controllers.Dashboard())
	// handler := cors.Default().Handler(mux)

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedMethods:   []string{http.MethodGet, http.MethodPost, http.MethodDelete, http.MethodPatch, http.MethodPut, http.MethodOptions},
		AllowCredentials: true,
		AllowedHeaders:   []string{"*"},
	})

	http.ListenAndServe(":8001", c.Handler(mux))

	// =================

	// r := mux.NewRouter()

	// r.HandleFunc("/login", helloHandler)

	// headers := handlers.AllowedHeaders([]string{"*"})
	// methods := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"})
	// origins := handlers.AllowedOrigins([]string{"*"})

	// handler := handlers.CORS(headers, methods, origins)(r)

	// customHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	// 	w.Header().Add("Access-Control-Allow-Methods", "POST, PUT, PATCH, GET, DELETE, OPTIONS")
	// 	w.Header().Add("Access-Control-Allow-Headers", "*")
	// 	w.Header().Add("Access-Control-Allow-Origin", "*")
	// 	w.Header().Add("Access-Control-Allow-Credentials", "true")
	// 	handler.ServeHTTP(w, r)
	// })

	// http.Handle("/", customHandler)

	// http.ListenAndServe(":8001", nil)

}

func helloHandler(w http.ResponseWriter, r *http.Request) {

	fmt.Print(r.Method)

	// cookie := http.Cookie{
	// 	Name:    "posCookie",
	// 	Value:   "success",
	// 	Expires: time.Now().Add(24 * time.Hour),
	// 	Path:    "/",
	// }

	// // Set the cookie in the response
	// http.SetCookie(w, &cookie)

	// w.WriteHeader(http.StatusOK)
	w.Write([]byte("success"))

}
