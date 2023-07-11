import { Injectable } from "@nestjs/common";
import { CreateUserInput } from "./dto/create-user.input";
import { UpdateUserInput } from "./dto/update-user.input";
import { User } from "./entities/user.entity";
import { PrismaClient } from "@prisma/client";
import { CrypterService } from "@crypter/crypter";

@Injectable()
export class UsersService {
    private readonly prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async create(createUserInput: CreateUserInput): Promise<User> {
        const hash = await CrypterService.hashPassword(createUserInput.password);
        const newUser: User = {
            name: createUserInput.name,
            email: createUserInput.email,
            passwordHash: hash,
            role: createUserInput.role,
        };
        const user = await this.prisma.users.create({
            data: {
                name: newUser.name,
                role: newUser.role,
                email: newUser.email,
                passwordHash: newUser.passwordHash,
            },
        });
        return User.fromPrisma(user);
    }

    async findAll(): Promise<User[]> {
        let results = (await this.prisma.users.findMany()).map((user) => User.fromPrisma(user));
        return results;
    }

    async findByEmail(email: string): Promise<User> {
        let user = await this.prisma.users.findUnique({
            where: {
                email: email,
            },
        });
        if (user) {
            return User.fromPrisma(user);
        }
        return null;
    }

    async findOne(id: number): Promise<User> {
        let user = await this.prisma.users.findUnique({
            where: {
                id: id,
            },
        });
        if (user) {
            return User.fromPrisma(user);
        }
        return null;
    }

    async update(id: number, updateUserInput: UpdateUserInput): Promise<User> {
        let user = await this.prisma.users.update({
            where: {
                id: id,
            },
            data: {
                name: updateUserInput.name,
                email: updateUserInput.email,
                role: updateUserInput.role,
            },
        });

        return User.fromPrisma(user);
    }

    async remove(id: number): Promise<boolean> {
        await this.prisma.users.delete({
            where: {
                id: id,
            },
        });

        return true;
    }
}
