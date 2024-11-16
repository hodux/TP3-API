import { User } from '../../models/v2/user.model.ts';
import { IUser } from '../../interfaces/v2/user.interface.ts';

export class UserService {
  public static async findByEmail(email: string): Promise<IUser | null> {
    try {
      return await User.findOne({ email });
    } catch (error) {
      throw error;
    }
  }

  public static async findByUsername(username: string): Promise<IUser | null> {
    try {
      return await User.findOne({ username });
    } catch (error) {
      throw error;
    }
  }

  public static async getAllUsers(): Promise<IUser[]> {
    try {
      return await User.find();
    } catch (error) {
      throw error;
    }
  }
}
