import { Module } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { OrdersResolver } from "./orders.resolver";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
    providers: [OrdersResolver, OrdersService, PrismaService],
})
export class OrdersModule {}
