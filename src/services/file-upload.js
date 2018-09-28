module.exports = ({
    init
}) => {
    const aws = require('aws-sdk')
    const multer = require('multer')
    const multerS3 = require('multer-s3')
    const path = require('path')

    aws.config.update({
        secretAccessKey: init.AWS_SECRET_ACCESS_KEY,
        accessKeyId: init.AWS_ACCESS_KEY,
        region: 'us-east-2'
    })

    const s3 = new aws.S3()

    const fileFilter = (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            // reject a file
            cb(null, false);
        }
    }

    const upload = multer({
        fileFilter: fileFilter,
        storage: multerS3({
            s3: s3,
            acl: 'public-read',
            bucket: 'seoul-image-server',
            metadata: function (req, file, cb) {
                cb(null, {
                    fieldName: Date.now().toString()
                })
            },
            key: function (req, file, cb) {
                cb(null, Date.now().toString() + path.extname(file.originalname))
            },
            // limits: {
            //     fileSize: 1024 * 1024 * 10  //10MB
            // }
        })
    })

    return upload;
}