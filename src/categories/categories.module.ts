import { Module } from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { CategoriesResolver } from "./categories.resolver";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
    providers: [CategoriesResolver, CategoriesService, PrismaService],
})
export class CategoriesModule {}
