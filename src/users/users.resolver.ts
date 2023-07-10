import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { UsersService } from "./users.service";
import { CreateUserInput } from "./dto/create-user.input";
import { UpdateUserInput } from "./dto/update-user.input";
import { User } from "./entities/user.entity";
import { AuthGuard } from "../auth/auth.guard";
import { UseGuards } from "@nestjs/common";
import { Roles } from "src/roles/roles.decorator";
import { AuthRoles } from "./enums/AuthRoles";
import { RolesGuard } from "src/roles/roles.guard";

@Resolver("User")
@UseGuards(AuthGuard)
@UseGuards(RolesGuard)
export class UsersResolver {
    constructor(private readonly usersService: UsersService) {}

    @Roles(AuthRoles.ADMIN)
    @Mutation("createUser")
    async create(@Args("createUserInput") createUserInput: CreateUserInput) {
        return this.usersService.create(createUserInput);
    }

    @Query("users")
    async findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Query("user")
    async findOne(@Args("id") id: number): Promise<User> {
        return this.usersService.findOne(id);
    }

    @Roles(AuthRoles.ADMIN)
    @Mutation("updateUser")
    async updateUser(@Args("updateUserInput") updateUserInput: UpdateUserInput) {
        return this.usersService.update(updateUserInput.id, updateUserInput);
    }

    @Roles(AuthRoles.ADMIN)
    @Mutation("removeUser")
    async remove(@Args("id") id: number): Promise<Boolean> {
        return this.usersService.remove(id);
    }
}
