import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersResolver } from "./users.resolver";
import { CrypterService } from "@crypter/crypter";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
    providers: [UsersResolver, UsersService, CrypterService, PrismaService],
})
export class UsersModule {}
