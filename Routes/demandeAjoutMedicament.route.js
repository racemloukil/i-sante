const express = require('express');
const router = express.Router();
const DemandeAjoutMedicament = require('../models/demandeAjoutMedicament');
const { authorizeRoles } = require('../Middelwares/authorizeRoles');
const { verifyToken } = require('../Middelwares/verifytoken');

// Route pour créer une demande d'ajout de médicament (accessible à l'utilisateur)
router.post('/creer', verifyToken, authorizeRoles(['user']), async (req, res) => {
  try {
    const { nomMedicament } = req.body;

    const nouvelleDemande = new DemandeAjoutMedicament({
      nomMedicament: nomMedicament,
      remboursable: 'en attente',
      utilisateur: req.user._id
    });

    await nouvelleDemande.save();

    res.status(201).json({ message: 'Demande d\'ajout de médicament créée avec succès', demande: nouvelleDemande });
  } catch (error) {
    res.status(500).json({ error: 'Une erreur est survenue lors de la création de la demande' });
  }
});

// Route pour récupérer toutes les demandes d'ajout de médicament (accessible à l'admin)
router.get('/liste', verifyToken, authorizeRoles(['admin']), async (req, res) => {
  try {
    const demandes = await DemandeAjoutMedicament.find().populate('utilisateur').exec();
    res.status(200).json(demandes);
  } catch (error) {
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des demandes' });
  }
});

// Route pour mettre à jour le statut d'une demande (accessible à l'admin)
router.put('/mise-a-jour/:id', verifyToken, authorizeRoles(['admin']), async (req, res) => {
  try {
    const demandeId = req.params.id;
    const nouveauStatut = req.body.statut;

    const demandeMiseAJour = await DemandeAjoutMedicament.findByIdAndUpdate(demandeId, {
      $set: { statut: nouveauStatut }
    }, { new: true });

    if (!demandeMiseAJour) {
      return res.status(404).json({ error: 'Demande introuvable' });
    }

    res.status(200).json(demandeMiseAJour);
  } catch (error) {
    res.status(500).json({ error: 'Une erreur est survenue lors de la mise à jour de la demande' });
  }
});

module.exports = router;
