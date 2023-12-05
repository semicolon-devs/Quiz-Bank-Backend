import { IsEmail } from "class-validator";

export class RegisterDto {
  readonly firstname: string;
  readonly lastname: string;
  @IsEmail()
  readonly email: string;
  readonly password: string;
}
