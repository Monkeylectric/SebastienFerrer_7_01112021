const mysql = require("../dbConnect");
const Comment = require('../models/Comment');

/**
 * Fonction qui crée un commentaire sur un post (A FINIR !!!!!!)
 * @param {Object} req 
 * @param {Object} res 
 * @param {*} next 
 */
 exports.createComment = (req, res, next) => {
    //-- Création d'un nouveau commentaire
    const comment = new Comment({
        postId: req.body.postId,
        userId: req.body.userId,
        message: req.body.message,
    });

    // -- On verifie si l'utilisateur existe
    let checkUser = "SELECT id FROM user WHERE id = ? LIMIT 1";
    mysql.query(checkUser, [comment.userId], function(err, result) {
        if (err) {
            // -- Utilisateur introuvable !
            return res.status(404).json({ err });
        }
        // -- Sauvegarde du commentaire en bdd
        let createCommentQuery = "INSERT INTO comment (postId, userId, message, date) VALUES (?, ?, ?, NOW())";
        mysql.query(createCommentQuery, [comment.postId, comment.userId, comment.message], function(err, result) {
            if (err) {
                console.log(err);
                return res.status(500).json(err.message);
            }
            res.status(201).json({ message: "Utilisateur créé !" });
        });
    });
};

/**
 * Fonction qui récupere tout les commentaire d'un post
 * @param {Object} req 
 * @param {Object} res 
 * @param {*} next 
 */
exports.getComments = (req, res, next) => {
    //let getCommentsQuery = `SELECT * FROM comment WHERE postId = ?`;
    let getCommentsQuery = `SELECT comment.id, comment.postId, comment.userId, comment.message, comment.date, user.firstname, user.lastname FROM comment INNER JOIN post ON comment.postId = post.id INNER JOIN user ON comment.userId = user.id WHERE comment.postId = ?`;
    // -- Execution de la requête
    mysql.query(getCommentsQuery, [req.params.id], function (err, result) {
        if (err) {
            return res.status(400).json({ err }); 
        }
        res.status(200).json({ result, message: "Tous les commentaires ont été récuperer avec succès !" });
    });
};

/**
 * Fonction qui supprime un commentaire d'un post existant
 * @param {Object} req 
 * @param {Object} res 
 * @param {*} next 
 */
exports.deleteComment = (req, res, next) => {
    let deleteCommentQuery = `DELETE FROM comment WHERE id = ? LIMIT 1`;
    // -- Execution de la requête
    mysql.query(deleteCommentQuery, [req.params.id], function (err, result) {
        if (err) {
            return res.status(400).json({ err }); 
        }
        res.status(200).json({ result, message: "Votre commentaire a bien été supprimé !" });
    });
};