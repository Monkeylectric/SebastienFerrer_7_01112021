const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const env = require('dotenv').config();
const db = require('./dbConnect'); 

const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const commentRoutes = require('./routes/comment');

// -- Connexion à mysql
db.connect(function(err){
    if(!err) {
        console.log("La base de données groupomania est connectée !");
    } else {
        console.log("Erreur de connection avec la base de donnée groupomania...");
        console.log(err);
    }
})

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// -- Convertit la requête en JSON
app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);

module.exports = app;