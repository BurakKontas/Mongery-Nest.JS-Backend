import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CategoriesService } from './categories.service';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';
import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/roles/roles.decorator';
import { AuthRoles } from 'src/users/enums/AuthRoles';
import { RolesGuard } from 'src/roles/roles.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserId } from 'src/get-user/get-user.decorator';
import { CheckUser } from 'src/check-user/check-user.decorator';

@UseGuards(AuthGuard)
@UseGuards(RolesGuard)
@Roles(AuthRoles.USER, AuthRoles.ADMIN)
@Resolver("Category")
export class CategoriesResolver {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Mutation("createCategory")
    create(@Args("createCategoryInput") createCategoryInput: CreateCategoryInput, @UserId() userId: number) {
        return this.categoriesService.create(createCategoryInput, userId);
    }

    @Query("categories")
    findAll(@UserId() userId: number) {
        return this.categoriesService.findAll(userId);
    }

    @CheckUser("categories")
    @Query("category")
    findOne(@Args("id") id: number) {
        return this.categoriesService.findOne(id);
    }

    @CheckUser("categories")
    @Mutation("updateCategory")
    update(@Args("updateCategoryInput") updateCategoryInput: UpdateCategoryInput) {
        return this.categoriesService.update(updateCategoryInput.id, updateCategoryInput);
    }

    @CheckUser("categories")
    @Mutation("removeCategory")
    remove(@Args("id") id: number) {
        return this.categoriesService.remove(id);
    }
}
