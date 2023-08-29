const express = require('express');
const router = express.Router();
const Ordonnance = require('../models/ordonnance');
const Medcien = require('../models/medecin');
const Beneficiaire = require('../models/Beneficiaire'); 
const Medicament = require('../models/médicaments');
const DemandeAjoutMedicament = require('../models/demandeAjoutMedicament');
const { authorizeRoles } = require('../Middelwares/authorizeRoles');

// Route pour créer une nouvelle ordonnance
router.post('/nouvelle', authorizeRoles(['user', 'admin']), async (req, res) => {
  try {
    const { medecinID, beneficiaireID, listeMedicaments } = req.body;

    // Vérifier si le médecin et le bénéficiaire existent
    const medecinExists = await Medecin.findById(medecinID);
    const beneficiaireExists = await Beneficiaire.findById(beneficiaireID);

    if (!medecinExists || !beneficiaireExists) {
      return res.status(404).json({ error: 'Médecin ou bénéficiaire introuvable' });
    }

    // Vérification et gestion des médicaments dans la liste
    const medicamentsWithDetails = await Promise.all(listeMedicaments.map(async (medicament) => {
      const medicamentExists = await Medicament.findOne({ nom: medicament.nomMedicament });

      if (medicamentExists) {
        return {
          ...medicament,
          remboursable: medicamentExists.remboursable,
          prix: medicamentExists.prix
        };
      } else {
        // Le médicament n'existe pas dans la base de données
        // Enregistrez une demande d'ajout au modèle DemandeAjoutMedicament
        const nouvelleDemande = new DemandeAjoutMedicament({
          nomMedicament: medicament.nomMedicament,
          remboursable: 'en attente'
        });
        await nouvelleDemande.save();

        return {
          ...medicament,
          remboursable: 'attente',
          prix: 0
        };
      }
    }));

    const nouvelleOrdonnance = new Ordonnance({
      matricule: matricule,
      medecin: medecinID,
      beneficiaire: beneficiaireID,
      listeMedicaments: medicamentsWithDetails
    });

    await nouvelleOrdonnance.save();

    res.status(201).json({ message: 'Ordonnance créée avec succès', ordonnance: nouvelleOrdonnance });
  } catch (error) {
    res.status(500).json({ error: 'Une erreur est survenue lors de la création de l\'ordonnance' });
  }
});

// Route pour récupérer une ordonnance par matricule
router.get('/matricule/:matricule', async (req, res) => {
  try {
    const matricule = req.params.matricule;
    const ordonnance = await Ordonnance.findOne({ matricule: matricule })
      .populate('medecin beneficiaire')
      .exec();

    if (!ordonnance) {
      return res.status(404).json({ error: 'Ordonnance introuvable' });
    }

    res.status(200).json(ordonnance);
  } catch (error) {
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération de l\'ordonnance' });
  }
});

// Route pour récupérer des ordonnances par bénéficiaire et médecin
router.get('/beneficiaire/:beneficiaireID/medecin/:medecinID', async (req, res) => {
  try {
    const beneficiaireID = req.params.beneficiaireID;
    const medecinID = req.params.medecinID;

    const ordonnances = await Ordonnance.find({ beneficiaire: beneficiaireID, medecin: medecinID })
      .populate('medecin beneficiaire')
      .exec();

    res.status(200).json(ordonnances);
  } catch (error) {
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des ordonnances' });
  }
});

// Route pour récupérer des ordonnances par date
router.get('/date/:date', async (req, res) => {
  try {
    const date = new Date(req.params.date);

    const ordonnances = await Ordonnance.find({ date: date })
      .populate('medecin beneficiaire')
      .exec();

    res.status(200).json(ordonnances);
  } catch (error) {
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des ordonnances' });
  }
});

// Route pour supprimer une ordonnance par ID (accessible uniquement à l'admin)
router.delete('/:id', authorizeRoles(['admin']), async (req, res) => {
  try {
    const ordonnanceID = req.params.id;
    const deletedOrdonnance = await Ordonnance.findByIdAndDelete(ordonnanceID);

    if (!deletedOrdonnance) {
      return res.status(404).json({ error: 'Ordonnance introuvable' });
    }

    res.status(200).json({ message: 'Ordonnance supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Une erreur est survenue lors de la suppression de l\'ordonnance' });
  }
});

module.exports = router;
