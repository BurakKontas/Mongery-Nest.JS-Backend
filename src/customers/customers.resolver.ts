import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { CustomersService } from "./customers.service";
import { CreateCustomerInput } from "./dto/create-customer.input";
import { UpdateCustomerInput } from "./dto/update-customer.input";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { RolesGuard } from "src/roles/roles.guard";
import { AuthRoles } from "src/users/enums/AuthRoles";
import { Roles } from "src/roles/roles.decorator";
import { CheckUser } from "src/check-user/check-user.decorator";
import { UserId } from "src/get-user/get-user.decorator";
import { Customers } from "@prisma/client";

@Resolver("Customer")
@UseGuards(AuthGuard)
@UseGuards(RolesGuard)
@Roles(AuthRoles.USER, AuthRoles.ADMIN)
export class CustomersResolver {
    constructor(private readonly customersService: CustomersService) {}

    @Mutation("createCustomer")
    create(@Args("createCustomerInput") createCustomerInput: CreateCustomerInput, @UserId() userId: number) {
        return this.customersService.create(createCustomerInput, userId);
    }

    @Query("customers")
    findAll(@UserId() userId: number) {
        return this.customersService.findAll(userId);
    }

    @CheckUser("customers")
    @Query("customer")
    findOne(@Args("id") id: number) {
        return this.customersService.findOne(id);
    }

    @CheckUser("customers")
    @Mutation("updateCustomer")
    update(@Args("updateCustomerInput") updateCustomerInput: UpdateCustomerInput) {
        return this.customersService.update(updateCustomerInput.id, updateCustomerInput);
    }

    @CheckUser("customers")
    @Mutation("removeCustomer")
    remove(@Args("id") id: number) {
        return this.customersService.remove(id);
    }
}
