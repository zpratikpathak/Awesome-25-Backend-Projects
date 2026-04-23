class ImageService:
    def apply_filter(self, url: str, filter_type: str):
        return {"url": url, "filter": filter_type, "status": "processed"}
