import { Module } from '@nestjs/common';
import { StatesService } from './states.service';
import { StatesResolver } from './states.resolver';

@Module({
  providers: [StatesResolver, StatesService]
})
export class StatesModule {}
