const mongoose = require('mongoose');

const medecinSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true
  },
  prenom: {
    type: String,
    required: true
  },
  specialite: String,
  adresse: String,
  numeroTelephone: String,
  conventionne: {
    type: Boolean,
    default: false
  }
});

const Medecin = mongoose.model('Medecin', medecinSchema);

module.exports = Medecin;
