import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
import { ThrottlerModule } from '@nestjs/throttler';
import { QuestionsModule } from './questions/questions.module';
import { SubjectsModule } from './subjects/subjects.module';
import { PapersModule } from './papers/papers.module';
import { AnswersModule } from './answers/answers.module';
import { LmsModule } from './lms/lms.module';
dotenv.config();

@Module({
  imports: [
    AuthModule,
    UsersModule,
    QuestionsModule,
    SubjectsModule,
    PapersModule,
    AnswersModule,
    LmsModule,
    MongooseModule.forRoot(process.env.MONGO_URI, {
      connectionName: 'quizbank',
    }),
    MongooseModule.forRoot(process.env.MONGO_LMS_URI, {
      connectionName: 'lms',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
