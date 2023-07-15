export class CreateOrderInput {
    id: number;
    image: string;
    title: string;
    categoryId: number;
    shortDesc: string;
    price: number;
    quantity: number;
    variant: string;
    productId: number;
    customerId: number;
    userId: number;
}
