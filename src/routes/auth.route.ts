import { Router } from 'express';
import { AuthService } from '../services/auth.service.ts';
import { verifyRegex } from '../utils/regex.ts'
import { logger } from '../utils/logger'

const router = Router();

/**
 * @openapi
 * /users/login:
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
 *                 example: "david_r@gmail.com"
 *               password:
 *                 type: string
 *                 description: Le mot de passe de l'utilisateur
 *                 example: "3478*#54"
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
router.post('/users/login', async (req, res) => {
    if (!req.body.email || !req.body.password) {
        logger.warn("POST Auth: Données manquantes")
        return res.status(400).send("Données manquantes");
    }

    // regex
    const emailRegex : RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (verifyRegex(req.body.email, emailRegex)) {
        logger.warn("POST Auth: Format email invalid")
        return res.status(400).send("Le format de l’adresse email pour la connexion doit être valide");
    }

    try {
        const token = await AuthService.login(req.body.email, req.body.password);
        
        if (token) {
            logger.info("POST Auth: Succès")
            return res.status(200).json({ token });
        } else {
            logger.warn("POST Auth: Email or mot de passe incorrect")
            return res.status(401).send('Email ou mot de passe incorrect');
        }
    } catch (error) {
        logger.warn("POST Auth: Erreur du serveur")
        return res.status(500).send("Erreur du serveur");
    }
});


export default router;