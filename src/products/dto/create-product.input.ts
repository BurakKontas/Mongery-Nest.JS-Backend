import { CustomInputs } from "@prisma/client";

export class CreateProductInput {
    title: string;
    image: string;
    stateId: number;
    categoryId: number;
    price: number;
    stock: number;
    variant: string;
    customInputs: Partial<CustomInputs>[];
    userId: number;
}
