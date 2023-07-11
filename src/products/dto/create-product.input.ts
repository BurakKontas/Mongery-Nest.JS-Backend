import { CustomInputs } from "@prisma/client";

export class CreateProductInput {
    title: string;
    image: string;
    stateId: number; //states
    categoryId: number; //categories 
    price: number;
    stock: number;
    variant: string;
    customInputs: CustomInputs[];
}
