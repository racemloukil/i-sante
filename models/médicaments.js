const mongoose = require('mongoose');

const medicamentSchema = new mongoose.Schema({
  nomMédicament: {
    type: String,
    required: true
  },
  dosage: String,
  forme: String,
  presentation: String,
  dci: String,
  classe: String,
  sousClasse: String,
  laboratoire: String,
  amm: String,
  dateAmm: Date,
  conditionnementPrimaire: String,
  specificationConditionnementPrimaire: String,
  tableau: String,
  dureeConservation: Number,
  indications: String,
  gpb: String,
  veic: String,
  prix: Number,
  remboursement: {
    type: String,
    enum: ['remboursable','en attente', 'non remboursable']
  },
  Validation: {
    type: Boolean,
    default: false
  }
});

const Medicament = mongoose.model('Medicament', medicamentSchema);

module.exports = Medicament;
