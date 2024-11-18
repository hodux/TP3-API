import { User } from '../../interfaces/v1/user.interface.ts';

export class UserModel implements User {
  constructor(
    public id: number, 
    public name: string, 
    public email: string, 
    public username: string, 
    public password: string,
    public role?: string
  ) {}
}