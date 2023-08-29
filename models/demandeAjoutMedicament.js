const mongoose = require('mongoose');
const user = require('../models/user');
const demandeAjoutMedicamentSchema = new mongoose.Schema({
  nomMedicament: {
    type: String,
    required: true
  },
  remboursable: {
    type: String,
    enum: ['remboursable', 'non remboursable', 'en attente'],
    default: 'en attente'
  },
  statut: {
    type: String,
    enum: ['en attente', 'acceptee', 'rejetee'],
    default: 'en attente'
  },
 userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: user, 
    required: true
  }
}, { timestamps: true });

const DemandeAjoutMedicament = mongoose.model('DemandeAjoutMedicament', demandeAjoutMedicamentSchema);

module.exports = DemandeAjoutMedicament;
