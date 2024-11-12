import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger'

export function errorMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
    logger.warn("Error middleware: " + err.stack)
    res.status(500).send({ message: 'Internal Server Error' });
}
