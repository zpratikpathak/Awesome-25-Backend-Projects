class ImageService:
    def apply_filter(self, url: str, filter_type: str):
        # ponytail: metadata preview only; add bounded image decoding before claiming processing.
        return {"url": str(url), "filter": filter_type, "status": "preview"}
