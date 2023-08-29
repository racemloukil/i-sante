const express = require('express');
const mongoose = require("mongoose")
const dotenv = require('dotenv');
const userRouter = require('./Routes/user.route')
const adherantRouter = require('./Routes/Adhérant.route')
const beneficaireRouter = require('./Routes/Beneficaire.route')
const consultationRouter = require('./Routes/consultation.route')
const demandeAjoutMedicamentRouter = require('./Routes/demandeAjoutMedicament.route')
const medecinRouter = require('./Routes/medecin.route')
const MédicamentsRouter = require('./Routes/médicaments.route')
const ordonnanceRouter = require('./Routes/ordonnance.route')

dotenv.config()
const app = express();
const cors = require('cors')
//BodyParser Middleware 
app.use(express.json());
mongoose.set("strictQuery", false);
// Initialize compression module
const compression = require('compression');

// Connexion à la base données  
mongoose.connect(process.env.DATABASECLOUD, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("Connexion à la base de données réussie");
    }).catch(err => {
        console.log('Impossible de se connecter à la base de données', err);
        process.exit();
    });

app.get("/", (req, res) => {
    res.send("Bonjour a tous");
});
// Compress all HTTP responses
app.use(compression());
app.use(cors())
app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
});

app.use('/api/users', userRouter)
app.use('/api/adherant', adherantRouter)

app.use('/api/demandeAjoutMedicament', demandeAjoutMedicamentRouter)
app.use('/api/medecin', medecinRouter)
app.use('/api/consultation', consultationRouter)
app.use('/api/beneficaire', beneficaireRouter)
app.use('/api/médicaments', MédicamentsRouter)
app.use('/api/ordonnance', ordonnanceRouter)
module.exports = app;