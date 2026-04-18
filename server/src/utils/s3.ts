import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

const {
    AWS_REGION,
    AWS_ACCESS_KEY,
    AWS_SECRET_KEY,
    AWS_BUCKET_NAME,
} = process.env;

if (!AWS_REGION || !AWS_ACCESS_KEY || !AWS_SECRET_KEY || !AWS_BUCKET_NAME) {
    throw new Error("Missing AWS environment variables");
}


const s3Client = new S3Client({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_KEY,
    },
});


export interface IMulterFile {
    originalname: string;
    mimetype: string;
    buffer: Buffer;
}


export const uploadToS3 = async (file: IMulterFile): Promise<string> => {
    const fileName = `profiles/${Date.now()}_${file.originalname}`;

    const params = {
        Bucket: AWS_BUCKET_NAME,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
        // ACL: "public-read", // enable only if needed
    };

    try {
        const command = new PutObjectCommand(params);
        await s3Client.send(command);

        return `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${fileName}`;
    } catch (error) {
        console.error("S3 Upload Error:", error);
        throw new Error("File upload failed");
    }
};