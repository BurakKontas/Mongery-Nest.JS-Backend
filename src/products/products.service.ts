import { Injectable } from "@nestjs/common";
import { CreateProductInput } from "./dto/create-product.input";
import { UpdateProductInput } from "./dto/update-product.input";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ProductsService {
    constructor(private readonly prisma: PrismaService) {}

    async create(createProductInput: CreateProductInput, userId: number) {
        let product = await this.prisma.client.products.create({
            data: {
                image: createProductInput.image,
                title: createProductInput.title,
                price: createProductInput.price,
                userId: userId,
                stock: createProductInput.stock,
                stateId: createProductInput.stateId,
                categoryId: createProductInput.categoryId,
                variant: createProductInput.variant,
                customInputs: {
                    createMany: {
                        data: createProductInput.customInputs,
                    },
                },
            },
            include: {
                customInputs: true,
            },
        });

        //@ts-ignore
        product.createdAt = product.createdAt.toISOString();
        //@ts-ignore
        product.updatedAt = product.updatedAt.toISOString();

        return product;
    }

    async findAll(userId: number) {
        let products = await this.prisma.client.products.findMany({
            where: {
                userId,
            },
            include: {
                customInputs: true,
            },
        });

        products.forEach((product) => {
            //@ts-ignore
            product.createdAt = product.createdAt.toISOString();
            //@ts-ignore
            product.updatedAt = product.updatedAt.toISOString();
        });

        return products;
    }

    async findOne(id: number) {
        let product = await this.prisma.client.products.findUnique({
            where: {
                id: id,
            },
            include: {
                customInputs: true,
            },
        });

        //@ts-ignore
        product.createdAt = product.createdAt.toISOString();
        //@ts-ignore
        product.updatedAt = product.updatedAt.toISOString();

        return product;
    }

    async update(id: number, updateProductInput: UpdateProductInput) {
        var { customInputs, ...rest } = updateProductInput;

        if (customInputs) {
            var product = await this.prisma.client.products.update({
                where: {
                    id: id,
                },
                data: {
                    ...rest,
                    customInputs: {
                        deleteMany: {
                            id: {
                                notIn: customInputs.map((input) => input.id),
                            },
                        },
                        createMany: {
                            data: customInputs,
                        },
                    },
                },
                include: {
                    customInputs: true,
                },
            });
        } else {
            var product = await this.prisma.client.products.update({
                where: {
                    id: id,
                },
                data: {
                    ...rest,
                },
                include: {
                    customInputs: true,
                },
            });
        }

        //@ts-ignore
        product.createdAt = product.createdAt.toISOString();
        //@ts-ignore
        product.updatedAt = product.updatedAt.toISOString();

        return product;
    }

    async remove(id: number) {
        await this.prisma.client.products.delete({
            where: {
                id: id,
            },
        });

        return true;
    }
}
