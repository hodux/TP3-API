import { Router } from 'express';
import { AuthService } from '../../services/v2/auth.service.ts';
import { verifyRegex } from '../../utils/regex.ts'
import { logger } from '../../utils/logger'
import {AuthController} from "../../controllers/v2/auth.controller.ts";

const router = Router();

/**
 * @openapi
 * /v2/users/login:
 *   post:
 *     summary: Connexion d'un utilisateur
 *     description: Permet à un utilisateur de se connecter en utilisant son email et mot de passe, regex inclu pour vérifier l'email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: L'adresse email de l'utilisateur
 *                 example: "admin@gmail.com"
 *               password:
 *                 type: string
 *                 description: Le mot de passe de l'utilisateur
 *                 example: "abc-123"
 *     responses:
 *       200:
 *         description: Connexion réussie, retourne un token JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Le token JWT généré pour l'utilisateur
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Niwicm9sZSI6Imdlc3Rpb25uYWlyZSIsImlhdCI6MTcyODg1NTQ3OCwiZXhwIjoxNzI4ODU5MDc4fQ.z6nD8i4o7VGSpjQcPpsNV_Qr1LGh9UbjXE8llYgeTzc"
 *       400:
 *         description: Données manquantes ou format de l'email invalide
 *       401:
 *         description: Nom d'utilisateur ou mot de passe incorrect
 *       500:
 *         description: Erreur interne du serveur
 *     tags:
 *       - Authentification
 */
router.post('/users/login', AuthController.login);


export default router;