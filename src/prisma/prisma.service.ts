import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
    client: PrismaClient;

    constructor() {
        this.client = new PrismaClient();
    }

    async onModuleInit() {
        await this.client.$connect();
    }

    async onModuleDestroy() {
        await this.client.$disconnect();
    }
}
