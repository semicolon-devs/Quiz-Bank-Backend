import { Role } from 'src/enums/roles.enum';

export interface UserInterface {
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
  roles: Role[];
  otp?: {
    key: string;
    expireAt: Date;
  };
}

