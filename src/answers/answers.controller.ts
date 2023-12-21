import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Role } from 'src/enums/roles.enum';
import { ParseObjectIdPipe } from 'src/utils/validation/parseObjectIDPipe';
import { AnswersService } from './answers.service';
import { FinishPaperDto, SubmitAnswerDto } from './dto/submit-answers.dto';

// TODO:: shift api/v1 to global routes.. (in all occurences)
@Controller('api/v1/answers')
export class AnswersController {
    constructor(private readonly answersService : AnswersService) {}

    // TODO:: To be completed!!
    @UseGuards(JwtAuthGuard)
    @Roles(Role.ADMIN, Role.MODERATOR, Role.USER)
    @Get('status/:userId/:paperId/')
    async getQuestionAnsweredStatus(
        @Param('userId') userId : string,
        @Param('paperId', ParseObjectIdPipe) paperId: string
        
    ) {
        return this.answersService.getAnsweredStatus(paperId, userId);
    }

    // TODO:: UserId's should be gained from jwt, rather than request body
    @UseGuards(JwtAuthGuard)
    @Roles(Role.ADMIN, Role.MODERATOR, Role.USER)
    @Post('answers/submit/')
    async submitQuestion(@Body() submitAnswerDto : SubmitAnswerDto) {
        return await this.answersService.submitAnswer(submitAnswerDto);
    }

    @UseGuards(JwtAuthGuard)
    @Roles(Role.ADMIN, Role.MODERATOR, Role.USER)
    @Post('answers/finish/')
    finishPaper(@Body() finishPaperDto : FinishPaperDto) {
        return this.answersService.finishPaper(finishPaperDto);
    }
    
    // @UseGuards(JwtAuthGuard)
    // @Roles(Role.ADMIN, Role.MODERATOR, Role.USER)
    // @Get('answers/:userId/:paper_id/:question_index')
    // async getAnswer(
    //     @Param('userId') userId : string,
    //     @Param('paper_id') paperId: string,
    //     @Param('questionNo') questionNo: string
    // ) {
    //     return this.answersService.getAnswer(userId, paperId, questionNo);

    // }
}