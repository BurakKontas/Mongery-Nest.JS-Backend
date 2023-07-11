import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersResolver } from "./users.resolver";
import { CrypterService } from "@crypter/crypter";

@Module({
    providers: [UsersResolver, UsersService, CrypterService],
})
export class UsersModule {}
