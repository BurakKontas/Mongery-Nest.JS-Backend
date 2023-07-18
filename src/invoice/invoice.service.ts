import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { FileService } from "src/file/file.service";

@Injectable()
export class InvoiceService {
    constructor(private readonly prisma: PrismaService, private readonly fileService: FileService) {}

    async findAll(userId: number) {
        let invoices = await this.prisma.client.invoice.findMany({
            where: {
                userId,
            },
            include: {
                order: {
                    include: {
                        category: true,
                        state: true,
                        customer: true,
                        Order_Product: {
                            include: {
                                product: true,
                            },
                        },
                    },
                },
            },
        });
        let results = invoices.map(async (invoice) => {
            let file = await this.fileService.findOne(invoice.fileName, userId);
            return {
                fileName: invoice.fileName,
                file: file,
                order: invoice.order,
                mimeType: file.mimeType,
                createdAt: invoice.createdAt,
                updatedAt: invoice.updatedAt,
                proforma: invoice.proforma,
            };
        });

        return results;
    }

    async findOne(fileName: string, userId: number) {
        let invoice = await this.prisma.client.invoice.findFirst({
            where: {
                fileName,
            },
            include: {
                order: {
                    include: {
                        category: true,
                        state: true,
                        customer: true,
                        Order_Product: {
                            include: {
                                product: true,
                            },
                        },
                    },
                },
            },
        });
        let file = await this.fileService.findOne(invoice.fileName, userId);
        return {
            fileName: invoice.fileName,
            file: file,
            order: invoice.order,
            mimeType: file.mimeType,
            createdAt: invoice.createdAt,
            updatedAt: invoice.updatedAt,
            proforma: invoice.proforma,
        };
    }
}
