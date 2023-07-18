import { Injectable } from "@nestjs/common";
import { CreateOrderInput } from "./dto/create-order.input";
import { UpdateOrderInput } from "./dto/update-order.input";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class OrdersService {
    constructor(private readonly prisma: PrismaService) {}

    async create(createOrderInput: Required<CreateOrderInput>, userId: number) {
        let { products, ...orderData } = createOrderInput;
        let order = await this.prisma.client.orders.create({
            data: {
                ...orderData,
                Order_Product: {
                    createMany: {
                        data: products,
                    },
                },
                userId,
            },
            include: {
                Order_Product: true,
                customer: true,
                state: true,
                Invoice: true,
            },
        });

        let total = 0;
        order.Order_Product.forEach(async (p) => {
            let product = await this.prisma.client.products.findUnique({
                where: {
                    id: p.productId,
                },
            });
            total += p.quantity * product.price;
        });

        order["total"] = total;
        order["products"] = order.Order_Product;

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
                Order_Product: true,
                customer: true,
                state: true,
                Invoice: true,
            },
        });

        orders = orders.map((order) => {
            let total = 0;
            order.Order_Product.forEach(async (p) => {
                let product = await this.prisma.client.products.findUnique({
                    where: {
                        id: p.productId,
                    },
                });
                total += p.quantity * product.price;
            });

            order["total"] = total;
            order["products"] = order.Order_Product;
            //@ts-ignore
            order.createdAt = order.createdAt.toISOString();
            //@ts-ignore
            order.updatedAt = order.updatedAt.toISOString();
            return order;
        });

        return orders;
    }

    async findOne(id: number) {
        let order = await this.prisma.client.orders.findUnique({
            where: {
                id,
            },
            include: {
                Order_Product: true,
                customer: true,
                state: true,
                Invoice: true,
            },
        });
        order["products"] = [];
        let products = await this.prisma.client.order_Product.findMany({
            where: {
                orderId: id,
            },
            include: {
                product: true,
            },
        });
        let total = 0;
        products.forEach((product) => {
            order["products"].push({
                quantity: product.quantity,
                product: product.product,
            });

            total += product.quantity * product.product.price;
            //@ts-ignore
            product.product.createdAt = product.product.createdAt.toISOString();
            //@ts-ignore
            product.product.updatedAt = product.product.updatedAt.toISOString();
        });
        order["total"] = total;
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
                Order_Product: true,
                customer: true,
                state: true,
                Invoice: true,
            },
        });

        let total = 0;
        order.Order_Product.forEach(async (p) => {
            let product = await this.prisma.client.products.findUnique({
                where: {
                    id: p.productId,
                },
            });
            total += p.quantity * product.price;
        });

        order["total"] = total;
        order["products"] = order.Order_Product;

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
