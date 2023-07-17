import { Injectable } from "@nestjs/common";
import { CreateFileInput } from "./dto/create-file.input";
import { UpdateFileInput } from "./dto/update-file.input";
import { randomUUID } from "crypto";
import { MinioService } from "@minio/minio";

@Injectable()
export class FileService {
    constructor(private readonly minio: MinioService) {}

    async create(createFileInput: CreateFileInput, userId: number) {
        if (!createFileInput.file) {
            throw new Error("File is required");
        }
        let uuid = randomUUID();
        await this.minio.createObject(`id-${userId.toString()}`, uuid, createFileInput.file, createFileInput.mimeType, userId);
        return {
            fileName: uuid,
            file: createFileInput.file,
            mimeType: createFileInput.mimeType,
        };
    }

    async findAll(userId: number) {
        return await this.minio.findAll(`id-${userId.toString()}`, userId);
    }

    async findOne(fileName: string, userId: number) {
        if (!fileName) {
            throw new Error("File name is required");
        }
        let file = await this.minio.readObject(`id-${userId.toString()}`, fileName, userId);
        return {
            fileName: fileName,
            file: file.file,
            mimeType: file.mimeType,
        };
    }

    async update(updateFileInput: UpdateFileInput, userId: number) {
        let fileName = updateFileInput.fileName;
        if (!fileName) {
            throw new Error("File name is required");
        }

        const file = await this.minio.readObject(`id-${userId.toString()}`, fileName, userId);

        if (!file) {
            throw new Error("File not found");
        }

        await this.minio.updateObject(`id-${userId.toString()}`, fileName, updateFileInput.file, updateFileInput.mimeType);

        return {
            fileName: fileName,
            file: updateFileInput.file,
            mimeType: updateFileInput.mimeType,
        };
    }

    async remove(fileName: string, userId: number) {
        if (!fileName) {
            throw new Error("File name is required");
        }

        const file = await this.minio.readObject(`id-${userId.toString()}`, fileName, userId);

        if (!file) {
            throw new Error("File not found");
        }

        await this.minio.deleteObject(`id-${userId.toString()}`, fileName, userId);

        return true;
    }
}
