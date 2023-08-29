const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../app');
const User = require('../models/user');

describe('User Model and Middleware Tests', () => {
    let mongoServer;

    before(async () => {
        mongoServer = new MongoMemoryServer();
        const mongoUri = await mongoServer.getUri();

        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    beforeEach(async () => {
        await User.deleteMany({});
    });

    after(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    it('should create a new user', async () => {
        const newUser = {
            email: 'ayman1@example.com',
            password: '123456',
            firstname: 'John',
            lastname: 'Doe'
        };

        const response = await request(app)
            .post('/api/users/register')
            .send(newUser);

        expect(response.status).to.equal(201);
        expect(response.body.success).to.equal(true);
        expect(response.body.user).to.have.property('_id');
    });

    it('should hash the password before saving', async () => {
        const newUser = new User({
            email: 'ayman1@example.com',
            password: '123456',
            firstname: 'Jane',
            lastname: 'Smith'
        });

        await newUser.save();

        const savedUser = await User.findOne({ email: newUser.email });
        console.log('Saved user from database:', savedUser);

        // Vérifiez si le mot de passe original et le hachage sont corrects
        const isPasswordMatch = await bcrypt.compare('testpassword', savedUser.password);
        console.log('Is password match:', isPasswordMatch);
        expect(isPasswordMatch).to.be.false;
    });
});
