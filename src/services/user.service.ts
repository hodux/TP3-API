import { User } from '../interfaces/user.interface';
import fs from "fs/promises";

export class UserService {
  public static async findByEmail(email: string) {
    return this.getAllUsers().then(users=> users.filter(user => user.email === email)[0]);
  }
  public static async findByUsername(username: string) {
    return this.getAllUsers().then(users=> users.filter(user => user.username === username)[0]);
  }
  public static async getAllUsers(): Promise<User[]> {
    const data = await fs.readFile("json/users.json", "utf-8");
    const result = JSON.parse(data); 
    return result;
  }
}