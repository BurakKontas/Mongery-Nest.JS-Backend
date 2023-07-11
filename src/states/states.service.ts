import { Injectable } from '@nestjs/common';
import { CreateStateInput } from './dto/create-state.input';
import { UpdateStateInput } from './dto/update-state.input';

@Injectable()
export class StatesService {
  create(createStateInput: CreateStateInput) {
    return 'This action adds a new state';
  }

  findAll() {
    return `This action returns all states`;
  }

  findOne(id: number) {
    return `This action returns a #${id} state`;
  }

  update(id: number, updateStateInput: UpdateStateInput) {
    return `This action updates a #${id} state`;
  }

  remove(id: number) {
    return `This action removes a #${id} state`;
  }
}
