exports.extractMetadata = (file) => {
    return {
        name: file.originalname,
        type: file.mimetype,
        size: file.size
    };
};
