const express = require('express');
const router = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');
const Medecin = require('../models/medecin');
const { authorizeRoles } = require('../Middelwares/authorizeRoles');
const { verifyToken } = require('../Middelwares/verifytoken');

// Configuration du stockage du fichier avec Multer
const storage = multer.memoryStorage(); // Stockage en mémoire
const upload = multer({ storage });

// Route pour créer un nouveau médecin (seulement accessible par l'administrateur)
router.post('/nouveau', upload.single('fichierExcel'), verifyToken, authorizeRoles(['admin']), async (req, res) => {
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

    // Créez les médecins avec les données extraites
    const medecins = data.map(item => ({
      nom: item.Nom,
      specialite: item.Specialite,
      adresse: item.adresse
    }));

    // Insérez les médecins dans la base de données
    await Medecin.create(medecins);

    res.status(201).json({ message: 'Médecins créés avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Une erreur est survenue lors de la création des médecins' });
  }
});

// Route pour consulter la liste des médecins (accessible à l'admin et à l'utilisateur)
router.get('/liste', verifyToken, async (req, res) => {
  try {
    const medecins = await Medecin.find();
    res.status(200).json(medecins);
  } catch (error) {
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération de la liste des médecins' });
  }
});

// Route pour consulter un médecin par son critère (accessible à l'admin et à l'utilisateur)
router.get('/rechercher', verifyToken, async (req, res) => {
  try {
    // Définissez les attributs sur lesquels vous souhaitez effectuer la recherche
    const critereRecherche = req.query.critere;

    // Créez un objet de recherche avec le critère spécifié
    const recherche = {
      $or: [
        { nom: critereRecherche },
        { specialite: critereRecherche },
        { adresse: critereRecherche }
      ]
    };

    // Recherchez le médecin dans la base de données en utilisant l'objet de recherche
    const medecinTrouve = await Medecin.findOne(recherche);

    if (!medecinTrouve) {
      return res.status(404).json({ error: 'Médecin non trouvé' });
    }

    res.status(200).json(medecinTrouve);
  } catch (error) {
    res.status(500).json({ error: 'Une erreur est survenue lors de la recherche du médecin' });
  }
});

module.exports = router;


