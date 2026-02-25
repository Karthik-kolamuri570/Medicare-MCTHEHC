const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
require('dotenv').config();

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

/**
 * Generates a pre-signed URL for a given S3 key.
 * @param {string} key - The S3 object key.
 * @param {number} expiresIn - Expiration time in seconds (default 3600).
 * @returns {Promise<string>} - The pre-signed URL.
 */
const generatePresignedUrl = async (key, expiresIn = 3600) => {
    if (!key) return null;

    // If the key is already a full URL, try to extract the key
    if (key.startsWith('http')) {
        const bucketUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`;
        if (key.startsWith(bucketUrl)) {
            key = key.replace(bucketUrl, '');
        } else {
            // If it's another URL (e.g. from multer-s3 .location), it might already contain the prefix
            // We need to be careful here. Multer-S3 location is the full S3 URL.
            // Let's try to extract the path part.
            try {
                const url = new URL(key);
                key = url.pathname.substring(1); // Remove leading slash
            } catch (e) {
                // If parsing fails, just use it as is or return null
            }
        }
    }

    // Determine the correct MIME type based on file extension
    const getMimeType = (fileKey) => {
        const ext = fileKey.split('.').pop().toLowerCase();
        const mimeTypes = {
            'pdf': 'application/pdf',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'webp': 'image/webp',
            'svg': 'image/svg+xml',
            'doc': 'application/msword',
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'txt': 'text/plain',
        };
        return mimeTypes[ext] || 'application/octet-stream';
    };

    const contentType = getMimeType(key);

    const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        ResponseContentDisposition: 'inline',
        ResponseContentType: contentType,
    });

    return await getSignedUrl(s3Client, command, { expiresIn });
};

module.exports = {
    s3Client,
    generatePresignedUrl
};
