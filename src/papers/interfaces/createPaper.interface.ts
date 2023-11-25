import { PaperType } from "src/enums/paperType.enum";

export interface CreatePaperInterface {
    paperId: string;
    timeInMinutes: Number;
    paperType: PaperType;
}