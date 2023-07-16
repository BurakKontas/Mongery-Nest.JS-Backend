import { CustomInputs } from "@prisma/client";

export class CreateProductInput {
    title: string;
    image: string;
    stateId: number; //states
    categoryId: number; //categories
    description: string;
    price: number;
    stock: number;
    variant: string;
    customInputs: CustomInputs[];
}
