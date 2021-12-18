const env = require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_RANDOM);
        const userId = decodedToken.userId;
        req.userId = userId;
        
        if (!req.userId) {
            throw 'User ID non valable';
        }

        next();
    } catch (error) {
        res.status(401).json({ error: error | 'Requête non authentifiée' });
    }
};