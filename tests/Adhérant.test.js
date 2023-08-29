// const mongoose = require('mongoose');
// const chai = require('chai');
// const expect = chai.expect;
// const request = require('supertest');
// const { MongoMemoryServer } = require('mongodb-memory-server');
// const app = require('../app'); // Assurez-vous d'importer correctement votre application
// const Adherant = require('../models/Adhérant');

// describe('Adherant Model and Route Tests', () => {
//     let mongoServer;

//     before(async () => {
//         mongoServer = new MongoMemoryServer();
//         const mongoUri = await mongoServer.getUri();

//         await mongoose.connect(mongoUri, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });
//     });
//     beforeEach(async () => {
//         await Adherant.deleteMany({});
//     });

//     after(async () => {
//         await mongoose.disconnect();
//         await mongoServer.stop();
//     });
//     it('should automatically generate matriculeAdherant', async () => {
//         const newAdherant = {
//             nom: 'John',
//             prenom: 'Doe'
//             // ... autres champs obligatoires ...
//         };

//         const response = await request(app)
//             .post('/api/adherant/creer')
//             .send(newAdherant);
//         console.log(newAdherant);

//         expect(response.status).to.equal(201);
//         expect(response.body).to.have.property('matriculeAdherant');
//         console.log(response.body);
//     });

//     it('should automatically generate situationAdhesion as "en_attente"', async () => {
//         const newAdherant = {
//             nom: 'Jane',
//             prenom: 'Smith'
            
//         };

//         const response = await request(app)
//             .post('/api/adherant/creer')
//             .send(newAdherant);
//         console.log(newAdherant);

//         expect(response.status).to.equal(201);
//         expect(response.body).to.have.property('situationAdhesion', 'en_attente');
//     });
// });
