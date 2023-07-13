import { Injectable, ConflictException, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import { CreateUserInput } from "src/users/dto/create-user.input";
import { CrypterService } from "@crypter/crypter";
import { ExtractTokenFromHeader } from "src/helpers/extractTokenFromHeader";

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

        const payload = structuredClone(user);
        delete payload.passwordHash;

        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async verifyToken(bearer: string) {
        try {
            let [type, token] = bearer.split(" ");
            if (type.toLowerCase() !== "bearer") return false;
            await this.jwtService.verifyAsync(token);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async signIn(username: string, password: string) {
        const user = await this.usersService.findByEmailWithPasswordHash(username);
        if (!user || !(await CrypterService.comparePassword(password, user.passwordHash))) {
            throw new UnauthorizedException("Invalid credentials");
        }

        const payload = structuredClone(user);
        delete payload.passwordHash;

        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}
