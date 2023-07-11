import { Injectable } from "@nestjs/common";
import { CreateCategoryInput } from "./dto/create-category.input";
import { UpdateCategoryInput } from "./dto/update-category.input";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class CategoriesService {
    constructor(private readonly prisma: PrismaService) {}

    create(createCategoryInput: CreateCategoryInput, userId: number) {
        let category = this.prisma.client.categories.create({
            data: {
                ...createCategoryInput,
            },
        });

        return category;
    }

    findAll(userId: number) {
        let categories = this.prisma.client.categories.findMany({
            where: {
                userId,
            },
        });
        return categories;
    }

    findOne(id: number) {
        let category = this.prisma.client.categories.findUnique({
            where: {
                id: id,
            },
        });
        return category;
    }

    update(id: number, updateCategoryInput: UpdateCategoryInput) {
        let category = this.prisma.client.categories.update({
            where: {
                id: id,
            },
            data: {
                ...updateCategoryInput,
            },
        });
        return category;
    }

    remove(id: number) {
        this.prisma.client.categories.delete({
            where: {
                id: id,
            },
        });
        return true;
    }
}
