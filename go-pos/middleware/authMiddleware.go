package middleware

import (
	"fmt"
	"net/http"
)

func AuthMiddleware(routFunc http.HandlerFunc) http.HandlerFunc {

	return func(w http.ResponseWriter, r *http.Request) {

		fmt.Printf(r.Header.Get("Origin"))
		routFunc.ServeHTTP(w, r)

	}

}
