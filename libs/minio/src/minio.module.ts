import { Module } from "@nestjs/common";
import { MinioService } from "./minio.service";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
    providers: [MinioService, PrismaService],
    exports: [MinioService],
})
export class MinioModule {}
