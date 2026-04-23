from fastapi import FastAPI, File, UploadFile
from fastapi.responses import Response
from PIL import Image
import io

app = FastAPI()

@app.post("/resize")
async def resize_image(width: int, height: int, file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))
    resized_image = image.resize((width, height))
    
    img_byte_arr = io.BytesIO()
    resized_image.save(img_byte_arr, format=image.format or 'JPEG')
    return Response(content=img_byte_arr.getvalue(), media_type=f"image/{image.format.lower() if image.format else 'jpeg'}")
