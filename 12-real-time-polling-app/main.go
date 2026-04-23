package main

import (
	"log"
	"net/http"
	"polling-app/routes"
)

func main() {
	r := routes.SetupRouter()
	log.Println("Server running on port 8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}
