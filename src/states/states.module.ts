import { Module } from "@nestjs/common";
import { StatesService } from "./states.service";
import { StatesResolver } from "./states.resolver";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
    providers: [StatesResolver, StatesService, PrismaService],
})
export class StatesModule {}
