import { Injectable } from "@nestjs/common";
import { CreateProductInput } from "./dto/create-product.input";
import { UpdateProductInput } from "./dto/update-product.input";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ProductsService {
    constructor(private readonly prisma: PrismaService) {}

    create(createProductInput: CreateProductInput, userId: number) {
        let product = this.prisma.client.products.create({
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
        });

        return product;
    }

    findAll(userId: number) {
        return `This action returns all products`;
    }

    findOne(id: number) {
        return `This action returns a #${id} product`;
    }

    update(id: number, updateProductInput: UpdateProductInput) {
        return `This action updates a #${id} product`;
    }

    remove(id: number) {
        return `This action removes a #${id} product`;
    }
}
