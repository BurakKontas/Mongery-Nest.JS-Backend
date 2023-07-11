import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { StatesService } from './states.service';
import { CreateStateInput } from './dto/create-state.input';
import { UpdateStateInput } from './dto/update-state.input';

@Resolver('State')
export class StatesResolver {
  constructor(private readonly statesService: StatesService) {}

  @Mutation('createState')
  create(@Args('createStateInput') createStateInput: CreateStateInput) {
    return this.statesService.create(createStateInput);
  }

  @Query('states')
  findAll() {
    return this.statesService.findAll();
  }

  @Query('state')
  findOne(@Args('id') id: number) {
    return this.statesService.findOne(id);
  }

  @Mutation('updateState')
  update(@Args('updateStateInput') updateStateInput: UpdateStateInput) {
    return this.statesService.update(updateStateInput.id, updateStateInput);
  }

  @Mutation('removeState')
  remove(@Args('id') id: number) {
    return this.statesService.remove(id);
  }
}
