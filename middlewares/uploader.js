const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        console.log(file.originalname);
        cb(null, file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype)

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        const error = new Error('Only .png and .jpeg format allowed!');
        error.name = 'FileTypeError';
        cb(error);
    }
};

const limits = {
    fileSize: 2 * 1024 * 1024 // 2MB
};

const upload = multer({
    storage: storage,
    fileFilter,
    limits
});

module.exports = upload;
