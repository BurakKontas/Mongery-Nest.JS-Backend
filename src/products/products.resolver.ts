import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { ProductsService } from "./products.service";
import { CreateProductInput } from "./dto/create-product.input";
import { UpdateProductInput } from "./dto/update-product.input";
import { UseGuards } from "@nestjs/common";
import { Roles } from "src/roles/roles.decorator";
import { AuthRoles } from "src/users/enums/AuthRoles";
import { AuthGuard } from "src/auth/auth.guard";
import { RolesGuard } from "src/roles/roles.guard";
import { CheckUser } from "src/check-user/check-user.decorator";
import { UserId } from "src/get-user/get-user.decorator";

@Resolver("Product")
@UseGuards(AuthGuard)
@UseGuards(RolesGuard)
@Roles(AuthRoles.USER, AuthRoles.ADMIN)
export class ProductsResolver {
    constructor(private readonly productsService: ProductsService) {}

    @CheckUser("categories", " categoryId")
    @CheckUser("states", " stateId")
    @Mutation("createProduct")
    create(@Args("createProductInput") createProductInput: CreateProductInput, @UserId() userId: number) {
        return this.productsService.create(createProductInput, userId);
    }

    @Query("products")
    findAll(@UserId() userId: number) {
        return this.productsService.findAll(userId);
    }

    @CheckUser("products")
    @Query("product")
    findOne(@Args("id") id: number) {
        return this.productsService.findOne(id);
    }

    @CheckUser("products")
    @Mutation("updateProduct")
    update(@Args("updateProductInput") updateProductInput: UpdateProductInput) {
        return this.productsService.update(updateProductInput.id, updateProductInput);
    }

    @CheckUser("products")
    @Mutation("removeProduct")
    remove(@Args("id") id: number) {
        return this.productsService.remove(id);
    }
}
