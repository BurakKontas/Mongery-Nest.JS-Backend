import { CreateProductInput } from './create-product.input';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateProductInput extends PartialType(CreateProductInput) {
  id: number;
}
