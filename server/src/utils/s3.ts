import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    },
});

/**
 * Uploads a profile photo (in-memory multer file) to S3 and returns its
 * public URL, which gets stored on `user.photo`.
 */
export const uploadToS3 = async (file: Express.Multer.File): Promise<string> => {
    const fileName = `profiles/${Date.now()}_${file.originalname}`;

    try {
        await s3Client.send(
            new PutObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: fileName,
                Body: file.buffer,
                ContentType: file.mimetype,
            })
        );

        return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    } catch (error) {
        console.error("S3 upload error:", error);
        throw new Error("File upload failed");
    }
};
