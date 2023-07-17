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
    }

    private async checkBucketExists(bucketName: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.minioClient.bucketExists(bucketName, (err, exists) => {
                if (err) {
                    throw err;
                }
                if (!exists) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
    }

    async createBucket(bucketName: string): Promise<boolean> {
        try {
            return new Promise((resolve, reject) => {
                this.minioClient.makeBucket(bucketName, "", (err) => {
                    if (err) {
                        throw err;
                    } else {
                        resolve(true);
                    }
                });
            });
        } catch (err) {
            throw err;
        }
    }

    async uploadFile(file: any, fileName: string, bucketName: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                let exists = await this.checkBucketExists(bucketName);
                if (!exists) await this.createBucket(bucketName);
                let buffer = await file.arrayBuffer();
                this.minioClient.putObject(bucketName, fileName, buffer as Buffer, file.size, (err, etag) => {
                    if (err) {
                        throw err;
                    }
                    resolve(fileName);
                });
            } catch (err) {
                throw err;
            }
        });
    }

    async getFile(fileName: string, bucketName: string) {
        try {
            let exists = await this.checkBucketExists(bucketName);
            if (!exists) throw new Error("Bucket does not exist");
            const file = await this.minioClient.getObject(process.env.MINIO_BUCKET_NAME, fileName);
            return file;
        } catch (err) {
            throw err;
        }
    }

    async deleteFile(fileName: string, bucketName: string) {
        try {
            let exists = await this.checkBucketExists(bucketName);
            if (!exists) throw new Error("Bucket does not exist");
            await this.minioClient.removeObject(process.env.MINIO_BUCKET_NAME, fileName);
            return true;
        } catch (err) {
            throw err;
        }
    }

    async deleteFiles(fileNames: string[], bucketName: string) {
        try {
            let exists = await this.checkBucketExists(bucketName);
            if (!exists) throw new Error("Bucket does not exist");
            await this.minioClient.removeObjects(process.env.MINIO_BUCKET_NAME, fileNames);
            return true;
        } catch (err) {
            throw err;
        }
    }

    async deleteAllFiles(bucketName: string) {
        try {
            let exists = await this.checkBucketExists(bucketName);
            if (!exists) throw new Error("Bucket does not exist");
            const objectsStream = this.minioClient.listObjects(process.env.MINIO_BUCKET_NAME, "", true);
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

    async getAllFileNames(bucketName: string) {
        try {
            let exists = await this.checkBucketExists(bucketName);
            if (!exists) throw new Error("Bucket does not exist");
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

    async getAllFiles(bucketName: string) {
        try {
            let exists = await this.checkBucketExists(bucketName);
            if (!exists) throw new Error("Bucket does not exist");
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
