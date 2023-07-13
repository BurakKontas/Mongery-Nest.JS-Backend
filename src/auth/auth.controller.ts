import { Controller, Post, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserInput } from "src/users/dto/create-user.input";
import { LoginUserInput } from "src/users/dto/login-user.input";
import { VerifyInput } from "src/users/dto/verify.input";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("register")
    async register(@Body() createUserDto: CreateUserInput) {
        try {
            const result = await this.authService.register(createUserDto);
            return { success: true, data: result };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    @Post("login")
    async login(@Body() loginUserDto: LoginUserInput) {
        try {
            const result = await this.authService.signIn(loginUserDto.email, loginUserDto.password);
            return { success: true, data: result };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    @Post("verify")
    async verify(@Body() token: VerifyInput) {
        try {
            const result = await this.authService.verifyToken(token.token);
            return { success: true, data: result };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}
