const express = require('express');
const router = express.Router();
const xlsx = require('xlsx');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const Medicament = require('../models/médicaments');
const { verifyToken } = require('../Middelwares/verifytoken');
const { authorizeRoles } = require('../Middelwares/authorizeRoles');

// Route pour créer un nouveau médicament (seulement accessible par l'administrateur)
router.post('/medicaments', verifyToken, authorizeRoles(['admin']), upload.single('file'), async (req, res) => {
  try {
    // Assurez-vous qu'un fichier a été téléchargé
    if (!req.file) {
      return res.status(400).json({ error: "Aucun fichier n'a été téléchargé" });
    }

    // Lisez le fichier Excel depuis req.file.buffer
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    // Convertissez les données du fichier Excel en un tableau JavaScript
    const data = xlsx.utils.sheet_to_json(sheet);

    // Créez les médicaments avec les données extraites
    const medicaments = data.map(item => ({
      nomMédicament: item.Nom,
      dosage: item.Dosage,
      forme: item.Forme,
      presentation: item.Présentation,
      dci: item.DCI,
      classe: item.Classe,
      sousClasse: item['Sous Classe'],
      laboratoire: item.Laboratoire,
      amm: item.AMM,
      dateAmm: item['Date AMM'],
      conditionnementPrimaire: item['Conditionnement primaire'],
      specificationConditionnementPrimaire: item.Spécification,
      tableau: item.Tableau,
      dureeConservation: item['Durée de conservation'],
      indications: item.Indications,
      gpb: item['G/P/B'],
      veic: item.VEIC,
      prix: item.prix,
      remboursement: item.Remboursement === 'oui' ? true : false
    }));

    // Insérez les médicaments dans la base de données
    await Medicament.create(medicaments);

    res.status(201).json({ message: 'Médicaments créés avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Une erreur est survenue lors de la création des médicaments' });
  }
});

// Route pour consulter la liste des médicaments (accessible à l'admin et à l'utilisateur)
router.get('/medicaments', verifyToken, async (req, res) => {
    try {
      // Récupérez la liste complète des médicaments depuis la base de données
      const medicaments = await Medicament.find();
  
      res.status(200).json(medicaments);
    } catch (error) {
      res.status(500).json({ error: 'Une erreur est survenue lors de la récupération de la liste des médicaments' });
    }
  });

// Route pour consulter un médicament par son critère (accessible à l'admin et à l'utilisateur)
router.get('/medicaments/:critere/:valeur', verifyToken, async (req, res) => {
    try {
      const critereRecherche = req.params.critere;
      const valeurRecherche = req.params.valeur;
  
      const attributsRecherchables = ['nom', 'dosage', 'forme', 'presentation', 'dci', 'classe', 'sousClasse', 'laboratoire', 'amm', 'dateAmm', 'conditionnementPrimaire', 'specificationConditionnementPrimaire', 'tableau', 'dureeConservation', 'indications', 'gpb', 'veic', 'prix', 'remboursement'];
  
      if (!attributsRecherchables.includes(critereRecherche)) {
        return res.status(400).json({ error: 'Critère de recherche non valide' });
      }
  
      const recherche = { [critereRecherche]: valeurRecherche };
  
      const medicament = await Medicament.findOne(recherche);
  
      if (!medicament) {
        return res.status(404).json({ error: 'Aucun médicament trouvé avec ce critère de recherche' });
      }
  
      res.status(200).json(medicament);
    } catch (error) {
      res.status(500).json({ error: 'Une erreur est survenue lors de la recherche du médicament' });
    }
  });
  
  module.exports = router;  

