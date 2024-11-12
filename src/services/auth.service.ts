import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; 
import { UserService } from '../services/user.service';
import { config } from '../config/config.ts';

export class AuthService {
  public static async login(email: string, password: string): Promise<string | null> {
      const jwtSecret = config.jwtSecret;
      const user = await UserService.findByEmail(email);
      if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ id: user.id, role: user.role }, jwtSecret, { expiresIn: '1h' });
        return token;
      }
      return null;
  }
}