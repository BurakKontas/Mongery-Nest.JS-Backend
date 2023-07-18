import { Injectable } from "@nestjs/common";
import { CreateCartInput } from "./dto/create-cart.input";
import { UpdateCartInput } from "./dto/update-cart.input";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class CartService {
    constructor(private readonly prisma: PrismaService) {}

    async create(createCartInput: CreateCartInput, userId: number) {
        let item = await this.prisma.client.cart.create({
            data: {
                ...createCartInput,
                userId,
            },
            include: {
                products: {
                    include: {
                        customInputs: true,
                        category: true,
                    },
                },
            },
        });

        //@ts-ignore
        item.products.createdAt = item.products.createdAt.toISOString();
        //@ts-ignore
        item.products.updatedAt = item.products.updatedAt.toISOString();
        //@ts-ignore
        item.createdAt = item.createdAt.toISOString();
        //@ts-ignore
        item.updatedAt = item.updatedAt.toISOString();

        console.log(item);

        return item;
    }

    async findAll(userId: number) {
        let items = await this.prisma.client.cart.findMany({
            where: {
                userId,
            },
            include: {
                products: {
                    include: {
                        customInputs: true,
                        category: true,
                    },
                },
            },
        });
        items = items.map((item) => {
            //@ts-ignore
            item.products.createdAt = item.products.createdAt.toISOString();
            //@ts-ignore
            item.products.updatedAt = item.products.updatedAt.toISOString();
            //@ts-ignore
            item.createdAt = item.createdAt.toISOString();
            //@ts-ignore
            item.updatedAt = item.updatedAt.toISOString();
            return item;
        });

        return items;
    }

    async findOne(id: number, userId: number) {
        let item = await this.prisma.client.cart.findFirst({
            where: {
                id,
                userId,
            },
            include: {
                products: {
                    include: {
                        customInputs: true,
                        category: true,
                    },
                },
            },
        });
        //@ts-ignore
        item.products.createdAt = item.products.createdAt.toISOString();
        //@ts-ignore
        item.products.updatedAt = item.products.updatedAt.toISOString();
        //@ts-ignore
        item.createdAt = item.createdAt.toISOString();
        //@ts-ignore
        item.updatedAt = item.updatedAt.toISOString();

        return item;
    }

    async update(updateCartInput: UpdateCartInput, userId: number) {
        let item = await this.prisma.client.cart.update({
            where: {
                id: updateCartInput.id,
            },
            data: {
                ...updateCartInput,
                userId,
            },
            include: {
                products: {
                    include: {
                        customInputs: true,
                        category: true,
                    },
                },
            },
        });
        //@ts-ignore
        item.products.createdAt = item.products.createdAt.toISOString();
        //@ts-ignore
        item.products.updatedAt = item.products.updatedAt.toISOString();
        //@ts-ignore
        item.createdAt = item.createdAt.toISOString();
        //@ts-ignore
        item.updatedAt = item.updatedAt.toISOString();

        return item;
    }

    async remove(id: number, userId: number) {
        await this.prisma.client.cart.delete({
            where: {
                id,
            },
        });
        return true;
    }
}
