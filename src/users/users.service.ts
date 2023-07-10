import { Injectable } from "@nestjs/common";
import { CreateUserInput } from "./dto/create-user.input";
import { UpdateUserInput } from "./dto/update-user.input";
import { User } from "./entities/user.entity";
import { AuthRoles } from "./enums/AuthRoles";

@Injectable()
export class UsersService {
    private readonly users: User[] = [
        {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            passwordHash: "changeme",
            role: AuthRoles.ADMIN,
        },
        {
            id: 2,
            name: "Jane Smith",
            email: "jane@example.com",
            passwordHash: "changeme",
            role: AuthRoles.USER,
        },
    ];

    create(createUserInput: CreateUserInput): User {
        const newUser: User = {
            id: this.users.length + 1,
            name: createUserInput.name,
            email: createUserInput.email,
            // passwordHash: hash(createUserInput.password)
            passwordHash: createUserInput.password,
            role: createUserInput.role,
        };
        this.users.push(newUser);
        return newUser;
    }

    findAll(): User[] {
        return this.users;
    }

    findByEmail(email: string): User {
        return this.users.find((user) => user.email === email);
    }

    findOne(id: number): User {
        return this.users.find((user) => user.id === id);
    }

    update(id: number, updateUserInput: UpdateUserInput): User {
        const user = this.findOne(id);
        if (user) {
            user.name = updateUserInput.name;
            user.email = updateUserInput.email;
            user.role = updateUserInput.role;
        }
        return user;
    }

    remove(id: number): boolean {
        const index = this.users.findIndex((user) => user.id === id);
        if (index !== -1) {
            this.users.splice(index, 1)[0];
            return true;
        }
        return false;
    }
}
