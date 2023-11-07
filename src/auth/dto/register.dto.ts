import { Role } from 'src/enums/roles.enum';

export class RegisterDto {
  readonly firstname: string;
  readonly lastname: string;
  readonly username: string;
  readonly email: string;
  readonly password: string;
}
