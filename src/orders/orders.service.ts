import { Injectable } from "@nestjs/common";
import { CreateOrderInput } from "./dto/create-order.input";
import { UpdateOrderInput } from "./dto/update-order.input";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class OrdersService {
    constructor(private readonly prisma: PrismaService) {}

    async create(createOrderInput: Required<CreateOrderInput>, userId: number) {
        let order = await this.prisma.client.orders.create({
            data: {
                ...createOrderInput,
                userId,
            },
            include: {
                product: true,
                customer: true,
                state: true,
                category: true,
            },
        });
        //@ts-ignore
        order.createdAt = order.createdAt.toISOString();
        //@ts-ignore
        order.updatedAt = order.updatedAt.toISOString();

        return order;
    }

    async findAll(userId: number) {
        let orders = await this.prisma.client.orders.findMany({
            where: {
                userId,
            },
            include: {
                product: true,
                customer: true,
                state: true,
                category: true,
            },
        });
        //@ts-ignore
        order.createdAt = order.createdAt.toISOString();
        //@ts-ignore
        order.updatedAt = order.updatedAt.toISOString();

        return orders;
    }

    async findOne(id: number) {
        let order = await this.prisma.client.orders.findUnique({
            where: {
                id,
            },
            include: {
                product: true,
                customer: true,
                state: true,
                category: true,
            },
        });

        //@ts-ignore
        order.createdAt = order.createdAt.toISOString();
        //@ts-ignore
        order.updatedAt = order.updatedAt.toISOString();

        return order;
    }

    async update(id: number, updateOrderInput: UpdateOrderInput) {
        let order = await this.prisma.client.orders.update({
            where: {
                id,
            },
            data: {
                ...updateOrderInput,
            },
            include: {
                product: true,
                customer: true,
                state: true,
                category: true,
            },
        });

        //@ts-ignore
        order.createdAt = order.createdAt.toISOString();
        //@ts-ignore
        order.updatedAt = order.updatedAt.toISOString();

        return order;
    }

    async remove(id: number) {
        await this.prisma.client.orders.delete({
            where: {
                id,
            },
        });
        return true;
    }
}
