const env = require('dotenv').config();
const mysql = require("../dbConnect");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const fs = require('fs');

/**
 * Fonction qui permet d'enregistrer un utilisateur avec une adresse mail unique et un mdp hashé
 * @param {Object} req
 * @param {Object} res
 * @param {*} next
 */
exports.signup = (req, res, next) => {
    // -- Validation des données transmises
    let mailRegex = /^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([_\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$/;
    let passwordRegex = /^(?=.*[\d\W])(?=.*[a-z])(?=.*[A-Z]).{8,100}$/;
    let otherRegex = /^[a-zA-z-éè]{1,15}$/;
    let verification = [
        mailRegex.test(req.body.email),
        passwordRegex.test(req.body.password),
        otherRegex.test(req.body.firstname),
        otherRegex.test(req.body.lastname), 
    ];

    if(verification.every(Boolean)) {
        // -- Hashage du mot de passe utilisateur
        bcrypt.hash(req.body.password, 10)
            .then(hash => {
                //-- Création d'un nouvel utilisateur
                const user = new User({
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    password: hash,
                });

                // -- Sauvegarde de l'utilisateur en bdd
                let signupQuery = "INSERT INTO user (firstname, lastname, email, password, date) VALUES (?, ?, ?, ?, NOW())";
                mysql.query(signupQuery, [user.firstname, user.lastname, user.email, user.password], function (err, result) {
                    if (err) {
                        return res.status(500).json(err.message);
                    }else {
                        res.status(201).json({ message: "Utilisateur créé !" });
                    }
                });
            })
            .catch(err => {
                //console.log(err);
                res.status(500).json({ err });
            });
    }else {
        return res.status(500).json({ message: 'Données transmises non correctes' });
    }
}

/**
 * Fonction qui permet à un utilisateur de se connecter
 * @param {Object} req 
 * @param {Object} res 
 * @param {*} next 
 */
exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    // -- Validation des données transmises
    let mailRegex = /^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([_\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$/;
    let passwordRegex = /^(?=.*[\d\W])(?=.*[a-z])(?=.*[A-Z]).{8,100}$/;
    let verification = [
        mailRegex.test(email),
        passwordRegex.test(password),
    ];

    if(verification.every(Boolean)) {
        let loginQuery = "SELECT * FROM user WHERE email = ? LIMIT 1";
        // -- Recherche de l'utilisateur dans la base de données
        mysql.query(loginQuery, [email], function (err, result) {
            if (err) {
                return res.status(500).json(err.message);
            }
            if (result.length == 0) {
                return res.status(404).json({ error: "Utilisateur non trouvé !" });
            }
            // -- Si l'utilisateur existe, vérification du mot de passe
            bcrypt.compare(password, result[0].password)
                .then(valid => {
                    // -- Si le mot de passe est incorrect
                    if (!valid) {
                        return res.status(401).json({ error: "Mot de passe incorrect !" });
                    }
                    res.status(200).json({
                        userId: result[0].id,
                        role: result[0].role,
                        token: jwt.sign(
                            { userId: result[0].id },
                            process.env.JWT_RANDOM,
                            { expiresIn: "24h" }
                        )
                    });
                })
                .catch(err => {
                    //console.log(err);
                    res.status(500).json({ err });
                });
        });
    }else {
        return res.status(500).json({ message: 'Données transmises non correctes' });
    }
};

/**
 * Fonction qui récupère les informations de l'utilisateur ciblé
 * @param {Object} req 
 * @param {Object} res 
 * @param {*} next 
 */
exports.getUser = (req, res, next) => {
    let getInfosQuery = `SELECT id, firstname, lastname, email, avatarUrl, role, date FROM user WHERE id = ?`;
    //res.locals.userId
    mysql.query(getInfosQuery, [req.params.id], function(err, result) {
        if (err) {
            return res.status(404).json({err});
        }else {
            res.status(200).json({result, message: "Informations de l'utilisateur récuperées avec succès !"});
        }
    });
}

/**
 * Fonction qui récupère tous les posts de l'utilisateur
 * @param {Object} req 
 * @param {Object} res 
 * @param {*} next 
 */
exports.getUserPosts = (req, res, next) => {
    let getUserPostsQuery = `SELECT * FROM post WHERE userId = ?`;
    mysql.query(getUserPostsQuery, [req.params.id], function(err, result) {
        if (err) {
            return res.status(404).json({ err });
        }else {
            res.status(200).json({ result, message: "Posts de l'utilisateur récuperés avec succès !" });
        }
    });
}

/**
 * Fonction qui modifie le compte de l'utilisateur
 * @param {Object} req
 * @param {Object} res
 * @param {*} next
 */
exports.modifyUser = (req, res, next) => {
    const userId = req.params.id;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const password = req.body.password;
    let avatarUpdate;

    // -- Validation des données transmises
    let mailRegex = /^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([_\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$/;
    let otherRegex = /^[a-zA-z-éè]{1,15}$/;
    let verification = [
        mailRegex.test(email),
        otherRegex.test(firstname),
        otherRegex.test(lastname), 
    ];

    if(verification.every(Boolean)) {
        // -- Recherche de l'utilisateur dans la base de données
        let checkPasswordQuery = "SELECT id, password FROM user WHERE id = ? LIMIT 1";

        mysql.query(checkPasswordQuery, [userId], function (err, result) {
            bcrypt.compare(password, result[0].password)
                .then(valid => {
                    // -- Si le mot de passe est incorrect
                    if (!valid) {
                        return res.status(401).json({ error: "Mot de passe incorrect !" });
                    }

                    // -- Si le mot de passe est correct
                    if (req.file) {
                        avatarUpdate = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
                
                        let sqlFindUser = "SELECT avatarUrl FROM user WHERE id = ?"
                        mysql.query(sqlFindUser, [userId], function (err, result) {
                            if (err) {
                                return res.status(500).json(err.message);
                            }
                
                            // -- Récuperer le nom de l'image
                            const filename = result[0].avatarUrl.split("/images/")[1];
                
                            if (filename !== "userDefault.png") {
                                fs.unlink(`images/${filename}`, () => { // On supprime le fichier image en amont
                                    let modifyUserQuery = `UPDATE user SET firstname = ?, lastname = ?, email = ?, avatarUrl = ? WHERE id = ?`;
                                    // -- Execution de la requête
                                    mysql.query(modifyUserQuery, [firstname, lastname, email, avatarUpdate, userId], function (err, result) {
                                        if (err) {
                                            return res.status(500).json(err.message);
                                        }
                                        return res.status(200).json({ message: "Utilisateur modifé !" });
                                    });
                                });
                            } else {
                                let modifyUserQuery = `UPDATE user SET firstname = ?, lastname = ?, email = ?, avatarUrl = ? WHERE id = ?`;
                                mysql.query(modifyUserQuery, [firstname, lastname, email, avatarUpdate, userId], function (err, result) {
                                    if (err) {
                                        
                                        return res.status(500).json(err.message);
                                    }
                                    return res.status(200).json({ message: "Utilisateur modifé !" });
                                });
                            }
                        });
                    }else {
                        let modifyUserQuery = `UPDATE user SET firstname = ?, lastname = ?, email = ? WHERE id = ?`;
                        // -- Execution de la requête
                        mysql.query(modifyUserQuery, [firstname, lastname, email, userId], function (err, result) {
                            if (err) {
                                return res.status(400).json({ err }); 
                            }
                            res.status(200).json({ result, message: "Utilisateur modifé !" });
                        });
                    }
                })
                .catch(err => {
                    res.status(500).json({ err });
                });
        });
    }else {
        return res.status(500).json({ message: 'Données transmises non correctes' });
    }
}

/**
 * Fonction qui supprime le compte de l'utilisateur
 * @param {Object} req
 * @param {Object} res
 * @param {*} next
 */
exports.deleteUser = (req, res, next) => {
    const password = req.body.password;

    // -- Recherche de l'utilisateur dans la base de données
    let checkPasswordQuery = "SELECT id, avatarUrl, password FROM user WHERE id = ? LIMIT 1";

    mysql.query(checkPasswordQuery, [req.params.id], function (err, result) {
        bcrypt.compare(password, result[0].password)
            .then(valid => {
                // -- Si le mot de passe est incorrect
                if (!valid) {
                    return res.status(401).json({ error: "Mot de passe incorrect !" });
                }

                // -- On supprime le fichier avatar en amont si il est different de l'avatar par défaut
                const filename = result[0].avatarUrl.split("/images/")[1];
                if (filename !== "userDefault.png") {
                    fs.unlink(`images/${filename}`, () => {
                        console.log("Avatar supprimé !");
                    });
                }

                // -- Suppression de l'utilisateur
                let userId = result[0].id;
                let deleteUserQuery = `DELETE FROM user WHERE id = ? LIMIT 1`;
                // -- Execution de la requête
                mysql.query(deleteUserQuery, [userId], function (err, result) {
                    if (err) {
                        return res.status(404).json({ err }); 
                    }else {
                        res.status(200).json({ result, message: "Utilisateur supprimé !" });
                    }
                });
            })
            .catch(err => {
                res.status(500).json({ err });
            });
    });
}

/**
 * Fonction qui récupère tous utilisateurs
 * @param {Object} req 
 * @param {Object} res 
 * @param {*} next 
 */
exports.getAllUsers = (req, res, next) => {
    let getAllUsersQuery = `SELECT * FROM user`;
    // -- Execution de la requête
    mysql.query(getAllUsersQuery, function (err, result) {
        if (err) {
            return res.status(400).json({ err }); 
        }else {
            res.status(200).json({ result, message: "Tous les utilisateurs ont été récuperer avec succès !" });
        }
    });
}