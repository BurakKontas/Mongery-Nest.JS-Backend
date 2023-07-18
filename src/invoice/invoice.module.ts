import { Module } from "@nestjs/common";
import { InvoiceService } from "./invoice.service";
import { InvoiceResolver } from "./invoice.resolver";
import { PrismaService } from "src/prisma/prisma.service";
import { MinioService } from "@minio/minio";
import { FileService } from "src/file/file.service";

@Module({
    providers: [InvoiceResolver, InvoiceService, PrismaService, FileService, MinioService],
})
export class InvoiceModule {}
