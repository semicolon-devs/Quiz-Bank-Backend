import { PaperType } from "src/enums/paperType.enum";

export interface PaperInterface {
    paperId: string;
    name: string;
    timeInMinutes: Number;
    isTimed: boolean;
    paperType: PaperType;
    questions?: string[];
}