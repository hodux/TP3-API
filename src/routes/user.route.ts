import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

const router = Router();

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Récupérer une liste d'utilisateurs
 *     description: Permet de récupérer tous les utilisateurs
 *     responses:
 *       200:
 *         description: Une liste d'utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         description: Requête invalide
 *     tags:
 *       - Utilisateurs
 */
router.get('/users', UserController.getAllUsers);

export default router;