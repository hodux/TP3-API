import request from 'supertest';
import { expect } from 'chai';
import app from '../../src/app';

// CRUD testing with authentication via jwt tokens

// can't run tests without this, it'll refuse self-signed certificates
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// ----- CRUD testing -----
describe('Public Product Routes', () => {
    it('should get all products', async () => {
        const res = await request(app)
            .get('/v2/products')
            .expect(200);

        expect(res.body).to.be.an('array');
        expect(res.body.length).to.be.greaterThan(0);
    });
});

let gestionnaireToken: string;
let employeeToken: string;
let createdId: string;
const invalidToken = 'Bearer invalid';
const newProduct = { name: 'test headcrab', description: 'test headcrab plushie', category: 'test plushies', quantity: 1, price: 1.99 }
const updatedProduct = { name: 'updated name', description: 'updated description', category: 'updated category', quantity: 99, price: 9.99 };

before(async () => {

    const gestionnaireRes = await request(app)
        .post('/v2/users/login')
        .send({ email: 'admin@email.com', password: 'abc-123' })
        .expect(200);

    const employeeRes = await request(app)
        .post('/v2/users/login')
        .send({ email: 'john@email.com', password: 'abc-123' })
        .expect(200);

    gestionnaireToken = gestionnaireRes.body.token;
    employeeToken = employeeRes.body.token;

});

describe('Protected Product Routes', () => {
    it('should try to create product as employee', async () => {
        const res = await request(app)
            .post('/v2/products')
            .set('Authorization', `Bearer ${employeeToken}`)
            .send(newProduct)
            .expect(403);

        expect(res.body).to.have.property('message', "Accès refusé. Vous n\'êtes pas gestionnaire");
    });

    it('should create product as gestionnaire', async () => {
        const res = await request(app)
            .post('/v2/products')
            .set('Authorization', `Bearer ${gestionnaireToken}`)
            .send(newProduct)
            .expect(201);

        expect(res.body).to.have.property('_id');
        createdId = res.body._id;
    });

    it('should update product by id as gestionnaire', async () => {

        const res = await request(app)
            .put(`/v2/products/${createdId}`)
            .set('Authorization', `Bearer ${gestionnaireToken}`)
            .send(updatedProduct)
            .expect(200);

        expect(res.body).to.have.property('_id', createdId);
        expect(res.body.name).to.equal(updatedProduct.name);
        expect(res.body.description).to.equal(updatedProduct.description);
        expect(res.body.category).to.equal(updatedProduct.category);
        expect(res.body.quantity).to.equal(updatedProduct.quantity);
        expect(res.body.price).to.equal(updatedProduct.price);
    });

    it('should delete product by id as gestionnaire', async () => {
        const res = await request(app)
            .delete(`/v2/products/${createdId}`)
            .set('Authorization', `Bearer ${gestionnaireToken}`)
            .expect(200);

        expect(res.body).to.have.property('message', 'Produit supprimer avec succès');
    });

});

// ----- Invalid token testing -----
describe("Invalid token where it isn't employee or gestionnaire", () => {

    it('should refuse put with invalid token', async () => {
        await request(app)
            .put(`/v2/products/${createdId}`)
            .set('Authorization', invalidToken)
            .send(updatedProduct)
            .expect(401);
    });

    it('should refuse delete with invalid token', async () => {
        await request(app)
            .delete(`/v2/products/${createdId}`)
            .set('Authorization', invalidToken)
            .expect(401);
    });
});
