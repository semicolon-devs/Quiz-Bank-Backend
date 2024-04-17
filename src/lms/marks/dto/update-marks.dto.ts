import { PartialType } from '@nestjs/mapped-types';
import { AddmarksDto } from './add-marks.dto';

export class UpdateMarksDto extends PartialType(AddmarksDto) {}
