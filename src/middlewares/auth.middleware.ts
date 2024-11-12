import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config.ts';
import { logger } from '../utils/logger'

// Middleware pour vérifier le JWT
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.header('Authorization');
    
    const jwtSecret = config.jwtSecret;

    if (!authHeader) {
        logger.warn("Auth middleware: 'Accès interdit. Aucun token fourni.") ;
        return res.status(401).json({ message: 'Accès interdit. Aucun token fourni.' });
    }
    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, jwtSecret);

        // Les méthodes DELETE ne fonctionne pas, le body est undefined et on ne peut pas ajouté à req.body.user,
        // donc j'ai ajouté cette condition
        if(req.method == "DELETE") {
          req.body = decoded;
        } else {
          req.body.user = decoded;
        }
        
        next();
      } catch (error) {
        logger.warn("Auth middleware: Token invalide ou expiré");
        res.status(401).json({ message: 'Token invalide ou expiré.' });
      }
};
