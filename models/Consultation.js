const mongoose = require('mongoose');
const Medcien = require('./medecin');
const Beneficiaire = require('./beneficiaire'); 
const consultationSchema = new mongoose.Schema({
    medcienID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Medcien
    },
  beneficiaireID: {
       type: mongoose.Schema.Types.ObjectId,
       ref:  Beneficiaire
    },
    date: {
        type: Date,
        default: Date.now
    },
    prixDeLaConsultation : Number,
    symptomes: String,
    diagnostic: String,
    commentaires: String
});

const Consultation = mongoose.model('Consultation', consultationSchema);

module.exports = Consultation;