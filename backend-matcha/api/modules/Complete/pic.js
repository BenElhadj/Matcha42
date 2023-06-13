import express from 'express';
import initializeFirebase from '../../database/firebase.js';
import multer from 'multer';
import Jimp from 'jimp';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const { db, storage } = await initializeFirebase();

const checktmp = async (req) => {
  const { tmp } = req.body;
  const snapshot = await db.collection("User").where("tmp", "==", tmp).get();
  return !snapshot.empty;
};

const checkFileType = (file, cb) => {
  const validTypes = ["image/jpeg", "image/png"];
  cb(null, validTypes.includes(file.mimetype));
};

const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./upload/");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

const upload = multer({
  storage: storageConfig,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: checkFileType,
});

router.post("/pic", upload.single("file"), async (req, res) => {
  const { tmp } = req.body;
  const checked = await checktmp(req);

  if (checked) {
    const pic = `http://localhost:3000/${req.file.filename}`;

    if (req.file) {
      Jimp.read(req.file.path)
        .then(async (image) => {
          const userSnapshot = await db.collection("User").where("tmp", "==", tmp).get();
          const userId = userSnapshot.docs[0].id;
          const destination = path.join("profile-pics", req.file.filename);
          await storage.bucket().upload(req.file.path, { destination });
          fs.unlinkSync(req.file.path);
          const imageURL = `https://firebasestorage.googleapis.com/v0/b/matcha-42-bhamdi-mbouzaie.appspot.com/o/${encodeURIComponent(destination)}?alt=media`;
          await db.collection("User").doc(userId).update({ pic: imageURL });
          res.send(imageURL);
        })
        .catch(err => {
          fs.unlinkSync(req.file.path);
          res.send({ msg: "Image not valid" });
        });
    }
  } else {
    res.send("Logout");
  }
});

export default router;
