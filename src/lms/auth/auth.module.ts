import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
import { UsersModule as UsersModuleLms } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schemas/user.schema';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy as LocalStrategyLms } from './strategies/local.strategy';
import { JwtStrategy as JwtStrategyLms } from './strategies/jwt.strategy';
import { JwtRefreshStrategy as JwtRefreshStrategyLms } from './strategies/jwt-refresh.strategy';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { AuthModule as AuthModuleQBank } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    UsersModule,
    UsersModuleLms,
    PassportModule,
    AuthModuleQBank,
    JwtModule.register({}),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }], 'lms'),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    ConfigService,
    LocalStrategyLms,
    JwtStrategyLms,
    JwtRefreshStrategyLms,
    JwtStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
