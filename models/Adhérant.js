const mongoose = require('mongoose');

const adherantSchema = new mongoose.Schema({
  matriculeAdherant: {
    type: String,
    default: () => Math.random().toString(36).substring(7).toUpperCase(),
    unique: true
  },
  nom: {
    type: String,
    required: true
  },
  prenom: {
    type: String,
    required: true
  },
  numeroCarteIdentite: String,
  dateNaissance: Date,
  situationFamiliale: String,
  telephone: String,
  situationAdhesion: {
    type: String,
    enum: ['en_attente', 'valide', 'non_valide'],
    default: 'en_attente'
  },
  dateAdhesion: {
    type: Date,
    default: Date.now
  },
  apci: {
    type: String,
    enum: ['affecté', 'non_affecté'],
    default: 'non_affecté'
  },
  photo: String // Stocker l'URL ou le chemin de la photo
});

const Adherant = mongoose.model('Adherant', adherantSchema);

module.exports = Adherant;
