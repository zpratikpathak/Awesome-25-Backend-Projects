package main

import (
	"os"
	"weather-api-wrapper/src/middlewares"
	"weather-api-wrapper/src/routes"
	"weather-api-wrapper/src/utils"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	utils.InitLogger()

	if err := godotenv.Load(); err != nil {
		utils.Logger.Warn("No .env file found, using system environment variables")
	}

	env := os.Getenv("ENVIRONMENT")
	if env == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.Default()

	// Global Middlewares
	r.Use(middlewares.ErrorHandler())

	// Routes
	routes.SetupWeatherRoutes(r)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	utils.Logger.Infof("Server starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		utils.Logger.Fatalf("Could not start server: %v", err)
	}
}
