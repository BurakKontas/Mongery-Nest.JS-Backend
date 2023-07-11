import { Module, forwardRef } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { jwtConstants } from "./constants";
import { UsersModule } from "../users/users.module";
import { UsersService } from "src/users/users.service";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
    imports: [
        forwardRef(() => UsersModule),
        JwtModule.register({
            global: jwtConstants.global,
            secret: jwtConstants.secret,
            signOptions: { expiresIn: jwtConstants.expiresIn },
        }),
    ],
    providers: [AuthService, UsersService, PrismaService],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}
