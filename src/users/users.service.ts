import { Injectable } from "@nestjs/common";
import { CreateUserInput } from "./dto/create-user.input";
import { UpdateUserInput } from "./dto/update-user.input";
import { PrismaClient, Users } from "@prisma/client";
import { CrypterService } from "@crypter/crypter";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    async create(createUserInput: CreateUserInput): Promise<Partial<Users>> {
        const hash = await CrypterService.hashPassword(createUserInput.password);
        const newUser: Partial<Users> = {
            name: createUserInput.name,
            email: createUserInput.email,
            passwordHash: hash,
            role: createUserInput.role,
        };
        const user = await this.prisma.client.users.create({
            data: {
                name: newUser.name,
                role: newUser.role,
                email: newUser.email,
                passwordHash: newUser.passwordHash,
            },
        });

        var result = structuredClone(user);
        delete result.passwordHash;
        return result;
    }

    async findAll(): Promise<Users[]> {
        let results = (await this.prisma.client.users.findMany()).map((user) => {
            let result = structuredClone(user);

            //@ts-ignore
            result.createdAt = result.createdAt.toISOString();
            //@ts-ignore
            result.updatedAt = result.updatedAt.toISOString();

            delete result.passwordHash;
            return result;
        });
        console.log(results);
        return results;
    }

    async findByEmail(email: string): Promise<Users> {
        let user = await this.prisma.client.users.findUnique({
            where: {
                email: email,
            },
        });
        if (user) {
            let result = structuredClone(user);
            delete result.passwordHash;
            return result;
        }
        return null;
    }

    async findByEmailWithPasswordHash(email: string): Promise<Users> {
        let user = await this.prisma.client.users.findUnique({
            where: {
                email: email,
            },
        });
        if (user) {
            let result = structuredClone(user);
            return result;
        }
        return null;
    }

    async findOne(id: number): Promise<Users> {
        let user = await this.prisma.client.users.findUnique({
            where: {
                id: id,
            },
        });
        if (user) {
            let result = structuredClone(user);
            delete result.passwordHash;
            return result;
        }
        return null;
    }

    async update(id: number, updateUserInput: UpdateUserInput): Promise<Users> {
        let user = await this.prisma.client.users.update({
            where: {
                id: id,
            },
            data: {
                ...updateUserInput,
            },
        });

        let result = structuredClone(user);
        delete result.passwordHash;
        return result;
    }

    async remove(id: number): Promise<boolean> {
        await this.prisma.client.users.delete({
            where: {
                id: id,
            },
        });

        return true;
    }
}
