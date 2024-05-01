import { IsEmail } from "class-validator";

export class UpdatePasswordDto {
  readonly password: string;
  readonly newPassword: string;
}
