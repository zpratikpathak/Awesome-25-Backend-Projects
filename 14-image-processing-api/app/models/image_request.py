from pydantic import BaseModel, HttpUrl
from typing import Literal


class ImageRequest(BaseModel):
    url: HttpUrl
    filter_type: Literal["grayscale", "blur", "sepia"]
