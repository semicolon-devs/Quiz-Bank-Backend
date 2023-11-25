import { PaperType } from 'src/enums/paperType.enum';

export class CreatePaperDto {
  readonly paperId: string;
  readonly timeInMinutes: Number;
  readonly paperType: PaperType;
}
