import { IsEmail } from "class-validator";

export class UpdatePasswordDto {
  @IsEmail()
  readonly email: string;
  readonly password: string;
  readonly newPassword: string;
}
