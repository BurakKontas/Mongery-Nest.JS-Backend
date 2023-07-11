import { CreateStateInput } from './create-state.input';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateStateInput extends PartialType(CreateStateInput) {
  id: number;
}
