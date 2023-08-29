const express = require('express');
const Beneficiaire = require('../models/beneficiaire');
const { authorizeRoles } = require('../Middelwares/authorizeRoles');
const { verifyToken } = require('../Middelwares/verifytoken');

const router = express.Router();

// Route pour ajouter un nouveau bénéficiaire (Adhérant) (accessible à l'utilisateur et à l'admin)
router.post('/ajouter', verifyToken, authorizeRoles(['admin', 'user']), async (req, res) => {
  try {
    const newBeneficiaire = new Beneficiaire({
      matriculeAdherant: req.user._id,
      nom: req.body.nom,
      prenom: req.body.prenom,
      lienParente: req.body.lienParente
    });

    await newBeneficiaire.save();
    res.status(201).json(newBeneficiaire);
  } catch (error) {
    res.status(400).json({ error: 'Erreur lors de l\'ajout du bénéficiaire' });
  }
});

// Route pour valider un bénéficiaire (Admin) (accessible à l'admin)
router.put('/valider/:id', verifyToken, authorizeRoles(['admin']), async (req, res) => {
  try {
    const beneficiaire = await Beneficiaire.findById(req.params.id);
    if (!beneficiaire) {
      return res.status(404).json({ error: 'Bénéficiaire non trouvé' });
    }

    beneficiaire.situationBeneficiaire = 'valide';
    beneficiaire.dateValidation = new Date();
    await beneficiaire.save();

    res.status(200).json(beneficiaire);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la validation du bénéficiaire' });
  }
});

// Route pour consulter la liste complète des bénéficiaires (accessible à l'admin et à l'utilisateur)
router.get('/beneficiaires', verifyToken, authorizeRoles(['admin', 'user']), async (req, res) => {
  try {
    // Récupérez la liste complète des bénéficiaires depuis la base de données
    const beneficiaires = await Beneficiaire.find();

    res.status(200).json(beneficiaires);
  } catch (error) {
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération de la liste des bénéficiaires' });
  }
});

// Route pour consulter un bénéficiaire par critère (accessible à l'admin et à l'utilisateur)
router.get('/beneficiaires/:critere/:valeur', verifyToken, authorizeRoles(['admin', 'user']), async (req, res) => {
  try {
    const critereRecherche = req.params.critere;
    const valeurRecherche = req.params.valeur;

    // Définissez les attributs sur lesquels vous souhaitez effectuer la recherche
    const attributsRecherchables = ['matriculeAdherant', 'nom', 'prenom', 'lienParente'];

    if (!attributsRecherchables.includes(critereRecherche)) {
      return res.status(400).json({ error: 'Critère de recherche non valide' });
    }

    // Créez un objet de recherche avec le critère spécifié
    const recherche = { [critereRecherche]: valeurRecherche };

    // Recherchez le bénéficiaire dans la base de données en utilisant l'objet de recherche
    const beneficiaire = await Beneficiaire.findOne(recherche);

    if (!beneficiaire) {
      return res.status(404).json({ error: 'Aucun bénéficiaire trouvé avec ce critère de recherche' });
    }

    res.status(200).json(beneficiaire);
  } catch (error) {
    res.status(500).json({ error: 'Une erreur est survenue lors de la recherche du bénéficiaire' });
  }
});
// Route pour supprimer un bénéficiaire (accessible à l'admin uniquement)
router.delete('/supprimer/:id', verifyToken, authorizeRoles(['admin']), async (req, res) => {
  try {
    const beneficiaireId = req.params.id;

    // Vérifier si le bénéficiaire existe
    const beneficiaireExists = await Beneficiaire.findById(beneficiaireId);
    if (!beneficiaireExists) {
      return res.status(404).json({ error: 'Bénéficiaire non trouvé' });
    }

    // Supprimer le bénéficiaire de la base de données
    await Beneficiaire.findByIdAndRemove(beneficiaireId);

    res.status(200).json({ message: 'Bénéficiaire supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Une erreur est survenue lors de la suppression du bénéficiaire' });
  }
});

module.exports = router;
