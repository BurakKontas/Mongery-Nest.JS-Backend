import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { CartService } from "./cart.service";
import { CreateCartInput } from "./dto/create-cart.input";
import { UpdateCartInput } from "./dto/update-cart.input";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { RolesGuard } from "src/roles/roles.guard";
import { AuthRoles } from "src/users/enums/AuthRoles";
import { Roles } from "src/roles/roles.decorator";
import { CheckUser } from "src/check-user/check-user.decorator";
import { UserId } from "src/get-user/get-user.decorator";

@UseGuards(AuthGuard)
@UseGuards(RolesGuard)
@Roles(AuthRoles.USER, AuthRoles.ADMIN)
@Resolver("Cart")
export class CartResolver {
    constructor(private readonly cartService: CartService) {}

    @CheckUser("products", "productId")
    @Mutation("createCart")
    create(@Args("createCartInput") createCartInput: CreateCartInput, @UserId() userId: number) {
        return this.cartService.create(createCartInput, userId);
    }

    @Query("carts")
    findAll(@UserId() userId: number) {
        return this.cartService.findAll(userId);
    }

    @Query("cart")
    findOne(@Args("id") id: number, @UserId() userId: number) {
        return this.cartService.findOne(id, userId);
    }

    @CheckUser("products", "productId")
    @Mutation("updateCart")
    update(@Args("updateCartInput") updateCartInput: UpdateCartInput, @UserId() userId: number) {
        return this.cartService.update(updateCartInput, userId);
    }

    @CheckUser("products", "productId")
    @Mutation("removeCart")
    remove(@Args("id") id: number, @UserId() userId: number) {
        return this.cartService.remove(id, userId);
    }
}
