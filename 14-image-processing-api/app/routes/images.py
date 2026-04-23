from fastapi import APIRouter, Depends
from app.controllers.image_controller import process_image
from app.models.image_request import ImageRequest

router = APIRouter()

@router.post("/process")
def process(req: ImageRequest):
    return process_image(req)
