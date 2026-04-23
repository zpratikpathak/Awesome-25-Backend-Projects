from app.services.image_service import ImageService
from app.models.image_request import ImageRequest

service = ImageService()

def process_image(req: ImageRequest):
    return service.apply_filter(req.url, req.filter_type)
