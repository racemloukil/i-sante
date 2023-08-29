const express = require('express');
const router = express.Router();
const User = require("../models/user");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// Créer un nouvel utilisateur
router.post('/register', async (req, res) => {
    try {
        // Extraire les données du corps de la requête
        const { email, password, firstname, lastname } = req.body;

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        // Créer une nouvelle instance de l'utilisateur
        const newUser = new User({ email, password, firstname, lastname });

        // Enregistrer le nouvel utilisateur dans la base de données
        const createdUser = await newUser.save();

        // Répondre avec les détails de l'utilisateur créé
        return res.status(201).json({
            success: true,
            message: "Account created successfully",
            user: createdUser
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "An error occurred while processing the request"
        });
    }
});

// afficher la liste des utilisateurs.
router.get('/', async (req, res,) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json(users);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }

});

/**
* as an admin i can disable or enable an account
*/
router.get('/status/edit/', async (req, res) => {
    try {
        let email = req.query.email
        let user = await User.findOne({ email })
        user.isActive = !user.isActive
        user.save()
        res.status(200).send({ success: true, user })
    } catch (err) {
        return res.status(404).send({ success: false, message: err })
    }
})

// se connecter
router.post('/login', async (req, res) => {
    try {
        let { email, password } = req.body
        if (!email || !password) {
            return res.status(404).send({ success: false, message: "All fields are required" })
        }
        let user = await User.findOne({
            email
        }).select('+password').select('+isActive')
        if (!user) {
            return res.status(404).send({ success: false, message: "Account doesn't exists" })
        } else {
            let isCorrectPassword = await bcrypt.compare(password, user.password)
            if (isCorrectPassword) {
                delete user._doc.password
                if (!user.isActive) return res.status(200).send({
                    success:
                        false, message: 'Your account is inactive, Please contact your administrator'
                })
                const token = generateAccessToken(user);
                const refreshToken = generateRefreshToken(user);
                return res.status(200).send({ success: true, user, token, refreshToken })
            } else {
                return res.status(404).send({
                    success: false, message:
                        "Please verify your credentials"
                })
            }
        }
    } catch (err) {
        return res.status(404).send({
            success: false, message: err.message
        })
    }
});

//Access Token
const generateAccessToken = (user) => {
    return jwt.sign({ iduser: user._id, role: user.role }, process.env.SECRET, {
        expiresIn: '1600s'
    })
}
// Refresh
const generateRefreshToken = (user) => {
    return jwt.sign({ iduser: user._id, role: user.role },
        process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1y' })
}
//Refresh Route
router.post('/refreshToken', async (req, res,) => {
    console.log(req.body.refreshToken)
    const refreshtoken = req.body.refreshToken;
    if (!refreshtoken) {
        return res.status(404).send({ success: false, message: 'Token Not Found' });
    }
    else {
        jwt.verify(refreshtoken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) {
                console.log(err)
                return res.status(406).send({ success: false, message: 'Unauthorized' });
            }
            else {
                const token = generateAccessToken(user);
                const refreshToken = generateRefreshToken(user);
                console.log("token-------", token);
                res.status(200).send({
                    success: true,
                    token,
                    refreshToken
                })
            }
        });
    }
});






module.exports = router;
