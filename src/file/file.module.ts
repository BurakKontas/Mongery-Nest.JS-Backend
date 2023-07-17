import { Module } from "@nestjs/common";
import { FileService } from "./file.service";
import { FileResolver } from "./file.resolver";
import { MinioService } from "@minio/minio";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
    providers: [FileResolver, FileService, MinioService, PrismaService],
})
export class FileModule {}
