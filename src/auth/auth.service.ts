import { Injectable, ConflictException, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { CreateUserInput } from "src/users/dto/create-user.input";

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) {}

    async register(createUserDto: CreateUserInput) {
        const { email } = createUserDto;

        const existingUser = await this.usersService.findByEmail(email);
        if (existingUser) {
            throw new ConflictException("Email already exists");
        }

        const user = await this.usersService.create(createUserDto);
        delete user.passwordHash;

        const payload = user;
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async signIn(username: string, password: string) {
        const user = await this.usersService.findByEmail(username);
        if (!user || user.passwordHash !== password) {
            throw new UnauthorizedException("Invalid credentials");
        }

        delete user.passwordHash;
        const payload = user;
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}
