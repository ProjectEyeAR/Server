module.exports = (init, db) => {
    //image packages
    const multer = require('multer');
    const GridFsStorage = require('multer-gridfs-storage');
    const Grid = require('gridfs-stream');
    const crypto = require('crypto');
    const path = require('path');
    const mongoose = require('mongoose');

    // Init stream
    const gfs = Grid(db, mongoose.mongo);
    gfs.collection('uploads');

    // Create storage engine
    const storage = new GridFsStorage({
        url: init.mongoUrl,
        file: (req, file) => {
            return new Promise((resolve, reject) => {
                crypto.randomBytes(16, (err, buf) => {
                    if (err) {
                        return reject(err);
                    }
                    //랜덤생성된 이름 + 확장자
                    const filename = buf.toString('hex') + path.extname(file.originalname);
                    const fileInfo = {
                        filename: filename,
                        bucketName: 'uploads'
                    };
                    resolve(fileInfo);
                });
            });
        }
    });
    const upload = multer({
        storage
    });

    return { upload, gfs };
}