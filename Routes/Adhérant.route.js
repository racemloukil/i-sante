const express = require('express');
const Adherant = require('../models/Adhérant');
const { authorizeRoles } = require('../Middelwares/authorizeRoles');
const { verifyToken } = require('../Middelwares/verifytoken');

const router = express.Router();

// Route pour créer un nouvel adhérant (accessible à l'admin et à l'utilisateur)
router.post('/creer', verifyToken, authorizeRoles(['admin', 'user']), async (req, res) => {
  try {
    const newAdherant = new Adherant(req.body);
    await newAdherant.save();
    res.status(201).json(newAdherant);
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la création de l\'adhérant' });
  }
});

// Route pour récupérer tous les adhérants (accessible à l'admin et à l'utilisateur)
router.get('/liste', verifyToken, authorizeRoles(['admin', 'user']), async (req, res) => {
  try {
    const adherants = await Adherant.find();
    res.status(200).json(adherants);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des adhérants' });
  }
});

// Route pour récupérer un adhérant par critère de recherche (accessible à l'admin et à l'utilisateur)
router.get('/rechercher/:critere/:valeur', verifyToken, authorizeRoles(['admin', 'user']), async (req, res) => {
  try {
    const critereRecherche = req.params.critere;
    const valeurRecherche = req.params.valeur;

    // Définissez les attributs sur lesquels vous souhaitez effectuer la recherche
    const attributsRecherchables = ['nom', 'prenom', 'situationAdhesion','matriculeAdherant','numeroCarteIdentite','dateNaissance'] 

    if (!attributsRecherchables.includes(critereRecherche)) {
      return res.status(400).json({ error: 'Critère de recherche non valide' });
    }

    // Créez un objet de recherche avec le critère spécifié
    const recherche = { [critereRecherche]: valeurRecherche };

    // Recherchez l'adhérant dans la base de données en utilisant l'objet de recherche
    const adherant = await Adherant.findOne(recherche);

    if (!adherant) {
      return res.status(404).json({ error: 'Aucun adhérant trouvé avec ce critère de recherche' });
    }

    res.status(200).json(adherant);
  } catch (error) {
    res.status(500).json({ error: 'Une erreur est survenue lors de la recherche de l\'adhérant' });
  }
});

// Route pour mettre à jour la situation d'adhésion (accessible à l'admin)
router.put('/update-situation/:id', verifyToken, authorizeRoles(['admin']), async (req, res) => {
  try {
    const adherantId = req.params.id;
    const newSituation = req.body.situation;

    const updatedAdherant = await Adherant.findByIdAndUpdate(adherantId, {
      $set: { situationAdhesion: newSituation }
    }, { new: true });

    if (!updatedAdherant) {
      return res.status(404).json({ error: 'Adhérant non trouvé' });
    }

    res.status(200).json(updatedAdherant);
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de la mise à jour de la situation d\'adhésion' });
  }
});

// Route pour supprimer un adhérant (accessible à l'admin uniquement)
router.delete('/supprimer/:id', verifyToken, authorizeRoles(['admin']), async (req, res) => {
  try {
    const adherantId = req.params.id;

    // Vérifier si l'adhérant existe
    const adherantExists = await Adherant.findById(adherantId);
    if (!adherantExists) {
      return res.status(404).json({ error: 'Adhérant non trouvé' });
    }

    // Supprimer l'adhérant de la base de données
    await Adherant.findByIdAndRemove(adherantId);

    res.status(200).json({ message: 'Adhérant supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Une erreur est survenue lors de la suppression de l\'adhérant' });
  }
});

module.exports = router;
