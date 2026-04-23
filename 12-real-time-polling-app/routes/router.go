package routes

import (
	"net/http"
	"polling-app/controllers"
)

func SetupRouter() *http.ServeMux {
	mux := http.NewServeMux()
	mux.HandleFunc("/api/polls", controllers.PollHandler)
	return mux
}
