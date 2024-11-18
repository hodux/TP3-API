import {logger} from "../../utils/logger.ts";
import {verifyRegex} from "../../utils/regex.ts";
import {AuthService} from "../../services/v2/auth.service.ts";
import {Request, Response} from "express";


export class AuthController {

    public static async login(req: Request, res: Response) {
        if (!req.body.email || !req.body.password) {
            logger.warn("POST Auth: Données manquantes")
            return res.status(400).send({message : "Données manquantes"});
        }

        // regex
        const emailRegex : RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (verifyRegex(req.body.email, emailRegex)) {
            logger.warn("POST Auth: Format email invalid")
            return res.status(400).send({message :"Le format de l’adresse email pour la connexion doit être valide"});
        }

        try {
            const token = await AuthService.login(req.body.email, req.body.password);

            if (token) {
                logger.info("POST Auth: Succès")
                return res.status(200).json({ token });
            } else {
                logger.warn("POST Auth: Email or mot de passe incorrect")
                return res.status(401).send({message : 'Email ou mot de passe incorrect'});
            }
        } catch (error) {
            logger.warn("POST Auth: Erreur du serveur")
            return res.status(500).send({message : "Erreur du serveur"});
        }
    }

}