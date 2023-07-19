import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { RolesGuard } from "src/roles/roles.guard";
import { AuthRoles } from "src/users/enums/AuthRoles";
import { Roles } from "src/roles/roles.decorator";
import { CheckUser } from "src/check-user/check-user.decorator";
import { UserId } from "src/get-user/get-user.decorator";
import { Orders } from "@prisma/client";
import { OrdersService } from "./orders.service";
import { CreateOrderInput } from "./dto/create-order.input";
import { UpdateOrderInput } from "./dto/update-order.input";

@UseGuards(AuthGuard)
@UseGuards(RolesGuard)
@Roles(AuthRoles.USER, AuthRoles.ADMIN)
@Resolver("Order")
export class OrdersResolver {
    constructor(private readonly customersService: OrdersService) {}

    @CheckUser("products", "productId")
    @CheckUser("customers", "customerId")
    @Mutation("createOrder")
    create(@Args("createOrderInput") createOrderInput: CreateOrderInput, @UserId() userId: number) {
        return this.customersService.create(createOrderInput, userId);
    }

    @Query("orders")
    findAll(@UserId() userId: number) {
        return this.customersService.findAll(userId);
    }

    @CheckUser("orders")
    @Query("order")
    findOne(@Args("id") id: number) {
        return this.customersService.findOne(id);
    }

    @CheckUser("products", "productId")
    @CheckUser("orders")
    @Mutation("updateOrder")
    update(@Args("updateOrderInput") updateOrderInput: UpdateOrderInput) {
        return this.customersService.update(updateOrderInput.id, updateOrderInput);
    }

    @CheckUser("orders")
    @Mutation("removeOrder")
    remove(@Args("id") id: number) {
        return this.customersService.remove(id);
    }
}
