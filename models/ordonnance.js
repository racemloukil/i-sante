const mongoose = require('mongoose');
const Medecin = require('../models/medecin');
const Beneficiaire = require('../models/beneficiaire');
const ordonnanceSchema = new mongoose.Schema({
  matricule: {
    type: String,
    unique: true,
    required: true
  },
  medecinID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Medecin,
    required: true
  },
  beneficiaireID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Beneficiaire,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  listeMedicaments: [
    {
      nomMedicament: {
        type: String,
        required: true
      },
      remboursable: {
        type: String,
        enum: ['remboursable', 'nonremboursable', 'attente'],
        default: 'attente'
      },
      prix: {
        type: Number,
        default: 0
      },
      quantite: {
        type: Number,
        required: true
      },
      posologie: String,
      dureeTraitement: String,
      instructionSpecifique: String
    }
  ]
});

// Pré-hook pour générer automatiquement le matricule unique
ordonnanceSchema.pre('save', async function (next) {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const count = await mongoose.models['Ordonnance'].countDocuments({});

  this.matricule = `ORD-${year}-${count + 1}`;

  next();
});

const Ordonnance = mongoose.model('Ordonnance', ordonnanceSchema);

module.exports = Ordonnance;
