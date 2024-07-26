const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const multer = require('multer')
const multerS3 = require('multer-s3');
const { health, aiResponse, imageRec  } = require('../controllers/LLM');

AWS.config.update({
    accessKeyId: process.env.YOUR_ACCESS_KEY,
    secretAccessKey: process.env.YOUR_SECRET_KEY,
    region: process.env.YOUR_REGION
  });
  
  const s3 = new AWS.S3();

const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: process.env.YOUR_BUCKET_NAME,
      acl: 'public-read',
      key: function (req, file, cb) {
        cb(null, Date.now().toString() + '-' + file.originalname);
      }
    })
  });

router.get('/health', health);
router.post('/aiResponse', aiResponse);
router.post('/employeDetails', upload.array('images', 4) ,imageRec);

module.exports = router;