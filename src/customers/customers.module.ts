import { Module } from "@nestjs/common";
import { CustomersService } from "./customers.service";
import { CustomersResolver } from "./customers.resolver";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
    providers: [CustomersResolver, CustomersService, PrismaService],
})
export class CustomersModule {}
