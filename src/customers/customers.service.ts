import { Injectable } from "@nestjs/common";
import { CreateCustomerInput } from "./dto/create-customer.input";
import { UpdateCustomerInput } from "./dto/update-customer.input";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class CustomersService {
    constructor(private readonly prisma: PrismaService) {}

    create(createCustomerInput: CreateCustomerInput, userId: number) {
        let customer = this.prisma.client.customers.create({
            data: {
                ...createCustomerInput,
                userId: userId,
            },
        });

        return customer;
    }

    findAll(userId: number) {
        let customers = this.prisma.client.customers.findMany({
            where: {
                userId,
            },
        });
        return customers;
    }

    findOne(id: number) {
        let customer = this.prisma.client.customers.findUnique({
            where: {
                id: id,
            },
        });
        return customer;
    }

    update(id: number, updateCustomerInput: UpdateCustomerInput) {
        let customer = this.prisma.client.customers.update({
            where: {
                id: id,
            },
            data: {
                ...updateCustomerInput,
            },
        });
        return customer;
    }

    remove(id: number) {
        this.prisma.client.customers.delete({
            where: {
                id: id,
            },
        });
        return true;
    }
}
