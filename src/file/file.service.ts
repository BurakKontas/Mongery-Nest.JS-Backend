import { Injectable } from "@nestjs/common";
import { CreateFileInput } from "./dto/create-file.input";
import { UpdateFileInput } from "./dto/update-file.input";
import { MinioService } from "@minio/minio";
import { randomUUID } from "crypto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class FileService {
    constructor(private readonly minio: MinioService) {}

    async create(createFileInput: CreateFileInput, userId: number) {
        let uuid = randomUUID();
        let fileName = await this.minio.uploadFile(createFileInput.file, uuid, userId.toString());
        return fileName;
    }

    async findAll(userId: number) {
        let files = await this.minio.getAllFiles(userId.toString());
        return files;
    }

    async findOne(fileName: string, userId: number) {
        let file = await this.minio.getFile(fileName, userId.toString());
        return file;
    }

    async update(updateFileInput: UpdateFileInput, userId: number) {
        let updated = await this.minio.uploadFile(updateFileInput.file, updateFileInput.fileName, userId.toString());
        return updated;
    }

    async remove(fileName: string, userId: number) {
        let deleted = await this.minio.deleteFile(fileName, userId.toString());
        return deleted;
    }
}
