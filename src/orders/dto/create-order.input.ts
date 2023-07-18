import { Order_Product } from "@prisma/client";

export class CreateOrderInput {
    image: string;
    title: string;
    categoryId: number;
    stateId: number;
    shortDesc: string;
    total: number;
    quantity: number;
    variant: string;
    products: Order_Product[];
    customerId: number;
}
