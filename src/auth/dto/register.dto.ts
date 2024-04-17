import { IsEmail, IsString } from "class-validator";

export class RegisterDto {
  @IsString()
  readonly firstname: string;

  @IsString()
  readonly lastname: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  readonly password: string;
}
