from pydantic import BaseModel, HttpUrl

class ImageRequest(BaseModel):
    url: HttpUrl
    filter_type: str
