import { Injectable } from "@nestjs/common";
import { CreateCustomerInput } from "./dto/create-customer.input";
import { UpdateCustomerInput } from "./dto/update-customer.input";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class CustomersService {
    constructor(private readonly prisma: PrismaService) {}

    async create(createCustomerInput: CreateCustomerInput, userId: number) {
        let customer = await this.prisma.client.customers.create({
            data: {
                ...createCustomerInput,
                userId: userId,
            },
        });

        //@ts-ignore
        customer.createdAt = customer.createdAt.toISOString();
        //@ts-ignore
        customer.updatedAt = customer.updatedAt.toISOString();

        return customer;
    }

    async findAll(userId: number) {
        let customers = await this.prisma.client.customers.findMany({
            where: {
                userId,
            },
        });

        customers.forEach((customer) => {
            //@ts-ignore
            customer.createdAt = customer.createdAt.toISOString();
            //@ts-ignore
            customer.updatedAt = customer.updatedAt.toISOString();
        });

        return customers;
    }

    async findOne(id: number) {
        let customer = await this.prisma.client.customers.findUnique({
            where: {
                id: id,
            },
        });

        //@ts-ignore
        customer.createdAt = customer.createdAt.toISOString();
        //@ts-ignore
        customer.updatedAt = customer.updatedAt.toISOString();

        return customer;
    }

    async update(id: number, updateCustomerInput: UpdateCustomerInput) {
        let customer = await this.prisma.client.customers.update({
            where: {
                id: id,
            },
            data: {
                ...updateCustomerInput,
            },
        });

        //@ts-ignore
        customer.createdAt = customer.createdAt.toISOString();
        //@ts-ignore
        customer.updatedAt = customer.updatedAt.toISOString();

        return customer;
    }

    async remove(id: number) {
        await this.prisma.client.customers.delete({
            where: {
                id: id,
            },
        });
        return true;
    }
}
