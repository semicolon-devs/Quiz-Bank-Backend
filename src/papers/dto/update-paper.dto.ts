import { PartialType } from '@nestjs/mapped-types';
import { CreatePaperDto } from './create-paper.dto';

export class UpdatePaper extends PartialType(CreatePaperDto) {}
