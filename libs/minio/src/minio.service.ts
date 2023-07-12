import { Injectable } from "@nestjs/common";
import * as Minio from "minio";

@Injectable()
export class MinioService {
    private readonly minioClient: Minio.Client;
    constructor() {
        this.minioClient = new Minio.Client({
            endPoint: process.env.MINIO_ENDPOINT,
            port: 9001,
            useSSL: false,
            accessKey: process.env.MINIO_ACCESS_KEY,
            secretKey: process.env.MINIO_SECRET_KEY,
        });

        this.minioClient.bucketExists(process.env.MINIO_BUCKET_NAME, (err, exists) => {
            if (err) {
                return console.log(err);
            }
            if (!exists) {
                return this.minioClient.makeBucket(process.env.MINIO_BUCKET_NAME, "", (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        });
    }

    async uploadFile(file: any, fileName: string) {
        try {
            this.minioClient.putObject(process.env.MINIO_BUCKET_NAME, fileName, file.buffer, file.size, file.mimetype);
            return fileName;
        } catch (err) {
            throw err;
        }
    }

    async getFile(fileName: string) {
        try {
            const file = await this.minioClient.getObject(process.env.MINIO_BUCKET_NAME, fileName);
            return file;
        } catch (err) {
            throw err;
        }
    }

    async deleteFile(fileName: string) {
        try {
            await this.minioClient.removeObject(process.env.MINIO_BUCKET_NAME, fileName);
            return true;
        } catch (err) {
            throw err;
        }
    }

    async deleteFiles(fileNames: string[]) {
        try {
            await this.minioClient.removeObjects(process.env.MINIO_BUCKET_NAME, fileNames);
            return true;
        } catch (err) {
            throw err;
        }
    }

    async deleteAllFiles() {
        try {
            const objectsStream = await this.minioClient.listObjects(process.env.MINIO_BUCKET_NAME, "", true);
            const fileNames = [];
            for await (const obj of objectsStream) {
                fileNames.push(obj.name);
            }
            await this.minioClient.removeObjects(process.env.MINIO_BUCKET_NAME, fileNames);
            return true;
        } catch (err) {
            throw err;
        }
    }

    async getAllFileNames() {
        try {
            const objectsStream = this.minioClient.listObjects(process.env.MINIO_BUCKET_NAME, "", true);
            const fileNames = [];
            for await (const obj of objectsStream) {
                fileNames.push(obj.name);
            }
            return fileNames;
        } catch (err) {
            throw err;
        }
    }

    async getAllFiles() {
        try {
            const objectsStream = this.minioClient.listObjects(process.env.MINIO_BUCKET_NAME, "", true);
            const files = [];
            for await (const obj of objectsStream) {
                const file = await this.minioClient.getObject(process.env.MINIO_BUCKET_NAME, obj.name);
                files.push(file);
            }
            return files;
        } catch (err) {
            throw err;
        }
    }
}
