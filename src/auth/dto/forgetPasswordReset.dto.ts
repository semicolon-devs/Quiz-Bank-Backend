import { IsEmail, IsString } from "class-validator";

export class ForgetPasswordReset {
  @IsEmail()
  readonly email: string;
  @IsString()
  readonly newPassword: string;
  @IsString()
  readonly otp: string;
}
