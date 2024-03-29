import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { User } from '../users/interfaces/user.interface';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard as JwtAuthGuardQBank } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/enums/roles.enum';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // need to authenticate with a jwt token for qbank moderator or Admin
  @UseGuards(JwtAuthGuardQBank)
  @Roles(Role.ADMIN, Role.MODERATOR)
  @Post('register')
  async register(@Body() registerDto: CreateAuthDto): Promise<User> { 
    return await this.authService.register(registerDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() request: any): Promise<any> {
    return this.authService.login(request.user._doc);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
