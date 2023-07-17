import { Injectable } from "@nestjs/common";
import * as Minio from "minio";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class MinioService {
    private readonly client: Minio.Client;

    constructor(private readonly prisma: PrismaService) {
        this.client = new Minio.Client({
            endPoint: process.env.MINIO_ENDPOINT,
            port: 9001,
            useSSL: false,
            accessKey: process.env.MINIO_ACCESS_KEY,
            secretKey: process.env.MINIO_SECRET_KEY,
        });
    }

    private async ensureBucketExists(bucketName: string): Promise<void> {
        const bucketExists = await this.client.bucketExists(bucketName);
        if (!bucketExists) {
            await this.client.makeBucket(bucketName);
        }
    }

    async createObject(bucketName: string, objectName: string, data: string, mimeType: string, userId: number): Promise<string> {
        await this.ensureBucketExists(bucketName);

        return new Promise<string>((resolve, reject) => {
            this.client.putObject(bucketName, objectName, data, (err: Error | null, etag: string) => {
                if (err) {
                    return reject(err);
                }
                this.prisma.client.minio
                    .create({
                        data: {
                            userId,
                            fileName: objectName,
                            mimeType: mimeType,
                        },
                    })
                    .then(() => {
                        resolve(etag);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        });
    }

    async readObject(bucketName: string, objectName: string, userId: number): Promise<{ file: string; mimeType: string }> {
        await this.ensureBucketExists(bucketName);

        return new Promise<{ file: string; mimeType: string }>((resolve, reject) => {
            let data = "";
            this.client.getObject(bucketName, objectName, (err: Error | null, dataStream?: NodeJS.ReadableStream) => {
                if (err) {
                    return reject(err);
                }

                if (dataStream) {
                    dataStream.on("data", (chunk: any) => {
                        data += chunk;
                    });

                    dataStream.on("end", () => {
                        this.prisma.client.minio
                            .findFirst({
                                where: {
                                    userId,
                                    fileName: objectName,
                                },
                            })
                            .then((minio) => {
                                resolve({
                                    file: data,
                                    mimeType: minio.mimeType,
                                });
                            });
                    });
                } else {
                    reject(new Error("Data stream not available"));
                }
            });
        });
    }

    async deleteObject(bucketName: string, objectName: string, userId: number): Promise<void> {
        await this.ensureBucketExists(bucketName);

        return new Promise<void>((resolve, reject) => {
            this.client.removeObject(bucketName, objectName, (err: Error | null) => {
                if (err) {
                    return reject(err);
                }
                this.prisma.client.minio
                    .deleteMany({
                        where: {
                            userId,
                            fileName: objectName,
                        },
                    })
                    .then(() => {
                        resolve();
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        });
    }

    async updateObject(bucketName: string, objectName: string, data: string, mimeType: string): Promise<string> {
        await this.ensureBucketExists(bucketName);

        return new Promise<string>((resolve, reject) => {
            this.client.putObject(bucketName, objectName, data, (err: Error | null, etag: string) => {
                if (err) {
                    return reject(err);
                }
                this.prisma.client.minio
                    .updateMany({
                        where: {
                            fileName: objectName,
                        },
                        data: {
                            mimeType: mimeType,
                        },
                    })
                    .then(() => {
                        resolve(etag);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        });
    }

    async findAll(bucketName: string, userId: number): Promise<{ fileName: string; file: string; mimeType: string }[]> {
        await this.ensureBucketExists(bucketName);

        return new Promise<{ fileName: string; file: string; mimeType: string }[]>((resolve, reject) => {
            console.log(userId);
            this.prisma.client.minio
                .findMany({
                    where: {
                        userId,
                    },
                })
                .then((minios) => {
                    const filesPromises = minios.map((minio) => {
                        return new Promise<{ fileName: string; file: string; mimeType: string }>((resolve, reject) => {
                            let data = "";
                            this.client.getObject(bucketName, minio.fileName, (err: Error | null, dataStream?: NodeJS.ReadableStream) => {
                                if (err) {
                                    return reject(err);
                                }

                                if (dataStream) {
                                    dataStream.on("data", (chunk: any) => {
                                        data += chunk;
                                    });

                                    dataStream.on("end", () => {
                                        resolve({
                                            fileName: minio.fileName,
                                            file: data,
                                            mimeType: minio.mimeType,
                                        });
                                    });
                                } else {
                                    reject(new Error("Data stream not available"));
                                }
                            });
                        });
                    });

                    Promise.all(filesPromises)
                        .then((files) => {
                            resolve(files);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
}
