import { Module } from "@nestjs/common";
import { FileService } from "./file.service";
import { FileResolver } from "./file.resolver";
import { MinioService } from "../../libs/minio/src/minio.service";

@Module({
    providers: [FileResolver, FileService, MinioService],
})
export class FileModule {}
