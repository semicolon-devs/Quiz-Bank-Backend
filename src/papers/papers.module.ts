import { Module } from '@nestjs/common';
import { PapersService } from './papers.service';
import { PapersController } from './papers.controller';

@Module({
  providers: [PapersService],
  controllers: [PapersController]
})
export class PapersModule {}
