const env = require('dotenv').config();
const mysql = require("../dbConnect");
const Post = require('../models/Post');
const fs = require('fs');

/**
 * Fonction qui permet de creer un post
 * @param {Object} req 
 * @param {Object} res 
 * @param {*} next 
 */
exports.createPost = (req, res, next) => {
        //-- Création d'un nouveau post
        const post = new Post({
            userId: req.body.userId,
            title: req.body.title,
            message: req.body.message,
            imageUrl: req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : "",
        });

        // -- On verifie si l'utilisateur existe
        let checkUser = "SELECT id FROM user WHERE id = ? LIMIT 1";
        mysql.query(checkUser, [post.userId], function(err, result) {
            if (err) {
                // -- Utilisateur introuvable !
                return res.status(404).json({ err });
            }
            // -- Sauvegarde du post en bdd
            let createPostQuery = "INSERT INTO post (userId, title, message, imageUrl, date) VALUES (?, ?, ?, ?, NOW())";
            mysql.query(createPostQuery, [result[0].id, post.title, post.message, post.imageUrl], function (err, result) {
                if (err) {
                    // -- Errueur lors de la création du post...
                    return res.status(400).json({ err });
                }
                res.status(201).json({ message: "Post créé !" });
            });
        });
};

/**
 * Fonction qui récupère tous les posts pour les afficher dans le feed
 * @param {Object} req 
 * @param {Object} res 
 * @param {*} next 
 */
exports.getAllPosts = (req, res, next) => {
    let getAllPostsQuery = `SELECT post.id, post.userId, post.title, post.message, post.imageUrl, post.date, user.firstname, user.lastname, user.avatarUrl FROM post INNER JOIN user ON post.userId = user.id ORDER BY post.id DESC`;
    // -- Execution de la requête
    mysql.query(getAllPostsQuery, function (err, result) {
        if (err) {
            return res.status(400).json({ err });
        }
        res.status(200).json({ result, message: "Tous les posts ont été récuperés avec succès !" });
    });
}

/**
 * Fonction qui récupère les informations d'un post
 * @param {Object} req
 * @param {Object} res
 * @param {*} next
 */
 exports.getOnePost = (req, res, next) => {
    let getUserPostsQuery = `SELECT * FROM post WHERE id = ?`;
    // -- Execution de la requête
    mysql.query(getUserPostsQuery, [req.params.postId], function (err, result) {
        if (err) {
            return res.status(400).json({ err }); 
        }
        res.status(200).json({ result, message: "Tous les posts de l'utilisateur ont été récuperés avec succès !" });
    });
}

/**
 * Fonction qui récupère tous les posts d'un utilisateur
 * @param {Object} req
 * @param {Object} res
 * @param {*} next
 */
 exports.getUserPosts = (req, res, next) => {
    let getUserPostsQuery = `SELECT * FROM post WHERE userId = ?`;
    // -- Execution de la requête
    mysql.query(getUserPostsQuery, [req.params.userId], function (err, result) {
        if (err) {
            return res.status(400).json({ err }); 
        }
        res.status(200).json({ result, message: "Tous les posts de l'utilisateur ont été récuperés avec succès !" });
    });
}

/**
 * Fonction qui modifie un post
 * @param {Object} req
 * @param {Object} res
 * @param {*} next
 */
 exports.modifyPost = (req, res, next) => {
    const postId = req.params.postid;
    const title = req.body.title;
    const message = req.body.message;
    let imageUpdate;

    // -- Verification si le post existe
    let selectPostQuery = `SELECT * FROM post WHERE id = ? LIMIT 1`;
    mysql.query(selectPostQuery, [postId], function (err, result) {
        if (err) {
            return res.status(404).json({ err }); 
        }

        // -- Si la modification concerne l'image
        if (req.file) {
            imageUpdate = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;

            // -- On supprime le fichier image en amont
            const filename = result[0].imageUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`, () => {
                console.log("Image supprimé !");
            });
        }else {
            imageUpdate = result[0].imageUrl;
        }
        
        let userId = result[0].userId;
        // -- Vérification si l'utilisateur qui a posté existe
        let selectUserQuery = `SELECT id FROM user WHERE id = ? LIMIT 1`;
        mysql.query(selectUserQuery, [userId], function (err, result) {
            if (err) {
                return res.status(404).json({ err }); 
            }

            // -- Modification du post
            let modifyPostQuery = `UPDATE post SET title = ?, message = ?, imageUrl = ? WHERE id = ?`;
            mysql.query(modifyPostQuery, [title, message, imageUpdate, postId], function (err, result) {
                if (err) {
                    return res.status(500).json(err.message);
                }
                return res.status(200).json({ message: "Publication modifée !" });
            });
        });
    });
}

/**
 * Fonction qui supprime un post
 * @param {Object} req
 * @param {Object} res
 * @param {*} next
 */
 exports.deletePost = (req, res, next) => {
    // -- Verification si le post existe
    let selectPostQuery = `SELECT * FROM post WHERE id = ? LIMIT 1`;
    mysql.query(selectPostQuery, [req.params.postid], function (err, result) {
        if (err) {
            return res.status(404).json({ err }); 
        }

        // -- On supprime le fichier image en amont
        if(result[0].imageUrl.includes('images')){
            const filename = result[0].imageUrl.split("/images/")[1];

            fs.unlink(`images/${filename}`, () => {
                console.log("Image supprimé !");
            });
        }
        
        let postId = result[0].id
        let userId = result[0].userId;
        // -- Vérification si l'utilisateur qui a posté existe
        let selectUserQuery = `SELECT id FROM user WHERE id = ? LIMIT 1`;
        mysql.query(selectUserQuery, [userId], function (err, result) {
            if (err) {
                return res.status(404).json({ err }); 
            }

            // -- Suppression du post
            let deletePostQuery = `DELETE FROM post WHERE id = ? LIMIT 1`;
            mysql.query(deletePostQuery, [postId], function (err, result) {
                if (err) {
                    return res.status(400).json({ err }); 
                }
                res.status(200).json({ message: "La publication a été supprimée avec succès !" });
            });
        });
    });
}