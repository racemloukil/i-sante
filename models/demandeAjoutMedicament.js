const mongoose = require('mongoose');

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
 user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  }
}, { timestamps: true });

const DemandeAjoutMedicament = mongoose.model('DemandeAjoutMedicament', demandeAjoutMedicamentSchema);

module.exports = DemandeAjoutMedicament;
