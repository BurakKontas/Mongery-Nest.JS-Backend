import { Injectable } from "@nestjs/common";
import { CreateCategoryInput } from "./dto/create-category.input";
import { UpdateCategoryInput } from "./dto/update-category.input";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class CategoriesService {
    constructor(private readonly prisma: PrismaService) {}

    async create(createCategoryInput: CreateCategoryInput, userId: number) {
        let category = await this.prisma.client.categories.create({
            data: {
                ...createCategoryInput,
                userId,
            },
        });

        //@ts-ignore
        category.createdAt = category.createdAt.toISOString();
        //@ts-ignore
        category.updatedAt = category.updatedAt.toISOString();

        return category;
    }

    async findAll(userId: number) {
        let categories = await this.prisma.client.categories.findMany({
            where: {
                userId,
            },
        });

        categories.forEach((category) => {
            //@ts-ignore
            category.createdAt = category.createdAt.toISOString();
            //@ts-ignore
            category.updatedAt = category.updatedAt.toISOString();
        });

        return categories;
    }

    async findOne(id: number) {
        let category = await this.prisma.client.categories.findUnique({
            where: {
                id: id,
            },
        });

        //@ts-ignore
        category.createdAt = category.createdAt.toISOString();
        //@ts-ignore
        category.updatedAt = category.updatedAt.toISOString();

        return category;
    }

    async update(id: number, updateCategoryInput: UpdateCategoryInput) {
        let category = await this.prisma.client.categories.update({
            where: {
                id: id,
            },
            data: {
                ...updateCategoryInput,
            },
        });

        //@ts-ignore
        category.createdAt = category.createdAt.toISOString();
        //@ts-ignore
        category.updatedAt = category.updatedAt.toISOString();

        return category;
    }

    async remove(id: number) {
        await this.prisma.client.categories.delete({
            where: {
                id: id,
            },
        });
        return true;
    }
}
