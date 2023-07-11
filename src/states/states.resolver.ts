import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { StatesService } from "./states.service";
import { CreateStateInput } from "./dto/create-state.input";
import { UpdateStateInput } from "./dto/update-state.input";
import { AuthGuard } from "src/auth/auth.guard";
import { RolesGuard } from "src/roles/roles.guard";
import { UseGuards } from "@nestjs/common";
import { Roles } from "src/roles/roles.decorator";
import { AuthRoles } from "src/users/enums/AuthRoles";
import { UserId } from "src/get-user/get-user.decorator";
import { CheckUser } from "src/check-user/check-user.decorator";

@UseGuards(AuthGuard)
@UseGuards(RolesGuard)
@Roles(AuthRoles.USER, AuthRoles.ADMIN)
@Resolver("State")
export class StatesResolver {
    constructor(private readonly statesService: StatesService) {}

    @Mutation("createState")
    create(@Args("createStateInput") createStateInput: CreateStateInput, @UserId() userId: number) {
        return this.statesService.create(createStateInput, userId);
    }

    @Query("states")
    findAll(@UserId() userId: number) {
        return this.statesService.findAll(userId);
    }

    @CheckUser("states")
    @Query("state")
    findOne(@Args("id") id: number) {
        return this.statesService.findOne(id);
    }

    @CheckUser("states")
    @Mutation("updateState")
    update(@Args("updateStateInput") updateStateInput: UpdateStateInput) {
        return this.statesService.update(updateStateInput.id, updateStateInput);
    }

    @CheckUser("states")
    @Mutation("removeState")
    remove(@Args("id") id: number) {
        return this.statesService.remove(id);
    }
}
