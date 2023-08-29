const express = require('express');
const router = express.Router();
const Consultation = require('../models/Consultation');
const Medecin = require('../models/medecin');
const beneficiaire = require('../models/Beneficiaire');
const { authorizeRoles } = require('../Middelwares/authorizeRoles');
const { verifyToken } = require('../Middelwares/verifytoken');

// Route pour créer une nouvelle consultation (accessible à l'admin et à l'utilisateur)
router.post('/consultations', verifyToken, authorizeRoles(['admin', 'user']), async (req, res) => {
  try {
    // Obtenez toutes les données de la requête
    const {
      medecinID,
      beneficiaireID,
      date,
      prixDeLaConsultation,
      symptomes,
      diagnostic,
      commentaires
    } = req.body;

    // Créez la consultation avec les données récupérées
    const consultation = new Consultation({
      medecinID,
      beneficiaireID,
      date,
      prixDeLaConsultation,
      symptomes,
      diagnostic,
      commentaires
    });

    // Enregistrez la consultation dans la base de données
    await consultation.save();

    res.status(201).json({ message: 'Consultation créée avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Une erreur est survenue lors de la création de la consultation' });
  }
});

// Route pour consulter la liste complète des consultations (accessible à l'admin et à l'utilisateur)
router.get('/consultations', verifyToken, authorizeRoles(['admin', 'user']), async (req, res) => {
  try {
    // Récupérez la liste complète des consultations depuis la base de données
    const consultations = await Consultation.find();

    res.status(200).json(consultations);
  } catch (error) {
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération de la liste des consultations' });
  }
});

// Route pour consulter une consultation par critères (accessible à l'admin et à l'utilisateur)
router.get('/consultations/:critere/:valeur', verifyToken, authorizeRoles(['admin', 'user']), async (req, res) => {
  try {
    const critereRecherche = req.params.critere;
    const valeurRecherche = req.params.valeur;

    // Définissez les attributs sur lesquels vous souhaitez effectuer la recherche
    const attributsRecherchables = [
      'medecinID', 'beneficiaireID', 'date', 'prixDeLaConsultation', 'symptomes', 'diagnostic', 'commentaires'
    ];

    if (!attributsRecherchables.includes(critereRecherche)) {
      return res.status(400).json({ error: 'Critère de recherche non valide' });
    }

    // Créez un objet de recherche avec le critère spécifié
    const recherche = { [critereRecherche]: valeurRecherche };

    // Recherchez la consultation dans la base de données en utilisant l'objet de recherche
    const consultation = await Consultation.findOne(recherche);

    if (!consultation) {
      return res.status(404).json({ error: 'Aucune consultation trouvée avec ce critère de recherche' });
    }

    res.status(200).json(consultation);
  } catch (error) {
    res.status(500).json({ error: 'Une erreur est survenue lors de la recherche de la consultation' });
  }
});

module.exports = router;
