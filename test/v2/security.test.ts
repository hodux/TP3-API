import request from 'supertest';
import { expect } from 'chai';
import app from '../../src/app';

// Testing against sql injections

describe('SQL Injection Tests', () => {

    it('should recognise email is invalid', async () => {
        const injectionReq = {
            email: "john@email.com' OR 1=1 --",
            password: "mdp"
        };

        const res = await request(app)
            .post('/v2/users/login')
            .send(injectionReq)
            .expect(400);

        expect(res.body.message).to.equal('Le format de l’adresse email pour la connexion doit être valide');
    });

    it('should recognise password is incorrect', async () => {
        const injectionReq = {
            email: "john@email.com",
            password: "mdp' OR 1=1 --"
        };

        const res = await request(app)
            .post('/v2/users/login')
            .send(injectionReq)
            .expect(401);

        expect(res.body.message).to.equal('Email ou mot de passe incorrect');
    });

});
