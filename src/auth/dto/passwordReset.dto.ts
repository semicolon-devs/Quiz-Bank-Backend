import { IsEmail, IsString } from "class-validator";

export class PasswordResetDto {
  @IsEmail()
  readonly email: string;
  @IsString()
  readonly newPassword: string;
}
