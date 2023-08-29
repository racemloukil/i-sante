const mongoose = require('mongoose');
const Adhérant = require('../models/adhérant');
const beneficiaireSchema = new mongoose.Schema({
  AdhérantID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Adhérant
},
  nom: {
    type: String,
    required: true
  },
  prenom: {
    type: String,
    required: true
  },
  dateNaissance: Date,
  lienParente: String,
  situationBeneficiaire: {
    type: String,
    enum: ['en_attente', 'valide', 'non_valide'],
    default: 'en_attente'
  },
  dateValidation: Date
});

const Beneficiaire = mongoose.model('Beneficiaire', beneficiaireSchema);

module.exports = Beneficiaire;
