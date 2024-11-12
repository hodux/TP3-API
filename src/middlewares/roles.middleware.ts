import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger'

export function roleMiddleware(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    let userRole = req.body.user?.role;
    
    // Regarder auth.middleware pour comprendre
    if(req.method == "DELETE") {
      userRole = req.body?.role;
    }

    if (!roles.includes(userRole)) {
      logger.warn("Roles middleware: Accès refusé")
      return res.status(403).json({ message: "Accès refusé. Vous n'êtes pas gestionnaire" });
    }
    next();
  };
}