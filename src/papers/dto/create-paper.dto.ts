import { PaperType } from 'src/enums/paperType.enum';

export class CreatePaperDto {
  readonly paperId: string;
  readonly name: string;
  readonly timeInMinutes: Number;
  readonly isTimed: boolean;
  readonly paperType: PaperType;
}
