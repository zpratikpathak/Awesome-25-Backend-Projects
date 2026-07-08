package main

import (
	"log"
	"net/http"
	"time"
	"polling-app/routes"
)

func main() {
	r := routes.SetupRouter()
	log.Println("Server running on port 8080")
	server := &http.Server{Addr: ":8080", Handler: r, ReadHeaderTimeout: 5 * time.Second, ReadTimeout: 10 * time.Second, WriteTimeout: 10 * time.Second}
	log.Fatal(server.ListenAndServe())
}
