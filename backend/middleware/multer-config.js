const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        // -- On passe le dossier images qu'on a crée
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split('.')[0].split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];

        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({ storage: storage }).single('image');