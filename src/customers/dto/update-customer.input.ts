import { CreateCustomerInput } from './create-customer.input';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateCustomerInput extends PartialType(CreateCustomerInput) {
  id: number;
}
