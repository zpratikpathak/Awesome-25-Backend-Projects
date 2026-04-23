package routes

import (
	"weather-api-wrapper/src/controllers"

	"github.com/gin-gonic/gin"
)

func SetupWeatherRoutes(router *gin.Engine) {
	weatherGroup := router.Group("/api/v1/weather")
	{
		weatherGroup.GET("", controllers.GetWeather)
	}
}
