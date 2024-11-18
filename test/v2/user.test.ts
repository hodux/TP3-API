import request from "supertest";
import app from "../../src/app";
import {expect} from "chai";

describe('Public User Routes', () => {
    it('should get all users', async () => {
        const res = await request(app)
            .get('/v2/users')
            .expect(200);

        expect(res.body).to.be.an('array');
        expect(res.body.length).to.be.greaterThan(0);
    });
});