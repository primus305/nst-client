import {Role} from './role.enum';

export class User {
  userID: number;
  firstName: string;
  lastName: string;
  faculty: string;
  organization: string;
  username: string;
  password: string;
  role: Role;
  email: string;
  authdata: string;
}
