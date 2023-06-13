import initializeFirebase from '../../database/firebase.js';
import express from 'express';
import multer from 'multer';
import Jimp from 'jimp';
import fs from 'fs';

const router = express.Router();
const { db } = await initializeFirebase();

const checktmp = async (req) => {
  const { tmp } = req.body;
  const userSnap = await db.collection("User").where("tmp", "==", tmp).get();
  return !userSnap.empty;
};

const checkFileType = (file, cb) => {
  const validTypes = ["image/jpeg", "image/png"];
  cb(null, validTypes.includes(file.mimetype));
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./upload/");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: checkFileType,
});

router.post("/images", upload.single("file"), async (req, res) => {
  const { tmp, image_id } = req.body;
  const checked = await checktmp(req);

  if (checked) {
    const pic = `http://localhost:3000/${req.file.filename}`;

    if (req.file) {
      Jimp.read(req.file.path)
        .then(async (image) => {
          const userSnap = await db.collection("User").where("tmp", "==", tmp).get();
          const userId = userSnap.docs[0].id;

          await db.collection("Images").doc(image_id).update({
            image: pic,
            user_id: userId,
            image_id: image_id,
          });

          res.send({ msg: "Image Uploaded" });
        })
        .catch((err) => {
          fs.unlinkSync(req.file.path);
          res.send({ msg: "Image not valid" });
        });
    }
  } else {
    res.send("Logout");
  }
});

export default router;
