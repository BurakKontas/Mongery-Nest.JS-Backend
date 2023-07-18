import { Order_Product } from "@prisma/client";

export class CreateOrderInput {
    stateId: number;
    quantity: number;
    variant: string;
    products: Order_Product[];
    customerId: number;
}
