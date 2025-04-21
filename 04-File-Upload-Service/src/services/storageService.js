const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const File = require('../models/File');

class StorageService {
  constructor() {
    this.storageType = process.env.STORAGE_TYPE || 'local';
    this.uploadDir = process.env.UPLOAD_DIR || './uploads';
    
    // Initialize S3 if using cloud storage
    if (this.storageType === 's3') {
      this.s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION
      });
      this.bucket = process.env.S3_BUCKET;
    }
  }

  /**
   * Save file metadata to database
   * @param {Object} file - File object from multer
   * @param {Object} userId - User ID (optional)
   * @returns {Promise<Object>} - Saved file document
   */
  async saveFileMetadata(file, userId = null) {
    try {
      const fileDoc = new File({
        filename: file.filename,
        originalName: file.originalname,
        encoding: file.encoding,
        mimetype: file.mimetype,
        destination: file.destination,
        path: file.path,
        size: file.size,
        user: userId
      });
      
      await fileDoc.save();
      return fileDoc;
    } catch (error) {
      console.error('Error saving file metadata:', error);
      throw new Error('Failed to save file metadata');
    }
  }

  /**
   * Upload file to S3 bucket (if using S3 storage)
   * @param {Object} file - File object from multer
   * @returns {Promise<Object>} - S3 upload result
   */
  async uploadToS3(file) {
    if (this.storageType !== 's3') {
      throw new Error('S3 storage not configured');
    }
    
    try {
      const fileContent = fs.readFileSync(file.path);
      
      const params = {
        Bucket: this.bucket,
        Key: file.filename,
        Body: fileContent,
        ContentType: file.mimetype
      };
      
      const result = await this.s3.upload(params).promise();
      
      // Delete local file after S3 upload
      fs.unlinkSync(file.path);
      
      return result;
    } catch (error) {
      console.error('Error uploading to S3:', error);
      throw new Error('Failed to upload file to S3');
    }
  }

  /**
   * Get file stream for download
   * @param {Object} fileDoc - File document from database
   * @returns {Promise<Object>} - File stream
   */
  async getFileStream(fileDoc) {
    try {
      if (this.storageType === 's3') {
        const params = {
          Bucket: this.bucket,
          Key: fileDoc.filename
        };
        
        return this.s3.getObject(params).createReadStream();
      } else {
        // Local file system
        return fs.createReadStream(fileDoc.path);
      }
    } catch (error) {
      console.error('Error getting file stream:', error);
      throw new Error('Failed to get file stream');
    }
  }

  /**
   * Delete file from storage
   * @param {Object} fileDoc - File document from database
   * @returns {Promise<boolean>} - Success status
   */
  async deleteFile(fileDoc) {
    try {
      if (this.storageType === 's3') {
        const params = {
          Bucket: this.bucket,
          Key: fileDoc.filename
        };
        
        await this.s3.deleteObject(params).promise();
      } else {
        // Local file system
        if (fs.existsSync(fileDoc.path)) {
          fs.unlinkSync(fileDoc.path);
        }
      }
      
      // Delete from database
      await File.findByIdAndDelete(fileDoc._id);
      
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error('Failed to delete file');
    }
  }

  /**
   * Update file metadata
   * @param {string} fileId - File ID
   * @param {Object} metadata - Metadata object
   * @returns {Promise<Object>} - Updated file document
   */
  async updateMetadata(fileId, metadata) {
    try {
      const fileDoc = await File.findById(fileId);
      
      if (!fileDoc) {
        throw new Error('File not found');
      }
      
      // Update metadata
      for (const [key, value] of Object.entries(metadata)) {
        fileDoc.metadata.set(key, value);
      }
      
      // Save updated document
      await fileDoc.save();
      
      return fileDoc;
    } catch (error) {
      console.error('Error updating metadata:', error);
      throw new Error('Failed to update metadata');
    }
  }
}

module.exports = new StorageService();