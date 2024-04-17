import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { GoogleDriveService } from 'src/common/services/google_drive/google_drive.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }], 'quizbank'),
  ],
  providers: [UsersService, GoogleDriveService],
  exports: [UsersService],
})
export class UsersModule {}
