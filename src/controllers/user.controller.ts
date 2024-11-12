import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { logger } from '../utils/logger'

export class UserController {
  public static async getAllUsers(req: Request, res: Response) {
    try {
      const users = await UserService.getAllUsers();
      logger.info("GET Users: Succès")
      res.status(200).json(users); 
    } catch (error) {
      logger.warn("GET Users: Requête invalide")
      return res.status(400).json({ message: "Requête invalide", error})
    }
  }
}