// import { db, storage } from '../../database/firebase.js';
import initializeFirebase from '../../database/firebase.js';
const { db, storage } = await initializeFirebase();
import express from 'express';
import multer from 'multer';
import Jimp from 'jimp';
import fs from 'fs';
import path from 'path';
const router = express.Router();

const checktmp = async (req) =>
  new Promise(async (resolve, reject) => {
    const { tmp } = req.body;
    const snapshot = await db.collection("User").where("tmp", "==", tmp).get();

    if (!snapshot.empty) {
      let result = "True";
      resolve(result);
    } else {
      let result = "False";
      resolve(result);
    }
  });

const checkFileType = (file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png")
    cb(null, true);
  else cb(null, false);
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
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

router.post("/pic", upload.single("file"), async (req, res) => {
  const tmp = req.body.tmp;
  let checked = await checktmp(req);

  if ((checked = "True")) {
    const pic = `http://localhost:3000/${req.file.filename}`;

    if (typeof req.file !== "undefined") {
      new Jimp(req.file.path, async (err, image) => {
        if (err) {
          if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
          res.send({ msg: "Image not valid" });
        } else {
          if (req.file.filename.size === 0)
            res.send({ msg: "Image not valid" });
          else {
            const userSnapshot = await db
              .collection("User")
              .where("tmp", "==", tmp)
              .get();

            const userId = userSnapshot.docs[0].id;

            // Upload image to Firebase Storage
            const destination = path.join("profile-pics", req.file.filename);
            await storage.bucket().upload(req.file.path, {
              destination,
            });

            // Delete the local file after uploading to Firebase Storage
            if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

            const imageURL = `https://firebasestorage.googleapis.com/v0/b/matcha-42-bhamdi-mbouzaie.appspot.com/o/${encodeURIComponent(
              destination
            )}?alt=media`;

            await db.collection("User").doc(userId).update({ pic: imageURL });
            res.send(imageURL);
          }
        }
      });
    }
  } else {
    let obj = "Logout";
    res.send(obj);
  }
});

export default router;
