import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CategoriesService } from './categories.service';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';

@Resolver('Category')
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Mutation('createCategory')
  create(@Args('createCategoryInput') createCategoryInput: CreateCategoryInput) {
    return this.categoriesService.create(createCategoryInput);
  }

  @Query('categories')
  findAll() {
    return this.categoriesService.findAll();
  }

  @Query('category')
  findOne(@Args('id') id: number) {
    return this.categoriesService.findOne(id);
  }

  @Mutation('updateCategory')
  update(@Args('updateCategoryInput') updateCategoryInput: UpdateCategoryInput) {
    return this.categoriesService.update(updateCategoryInput.id, updateCategoryInput);
  }

  @Mutation('removeCategory')
  remove(@Args('id') id: number) {
    return this.categoriesService.remove(id);
  }
}
