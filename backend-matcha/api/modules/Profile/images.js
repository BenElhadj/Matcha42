// import db from '../../database/firebase.js';
import initializeFirebase from '../../database/firebase.js';
const { db } = await initializeFirebase();
import express from 'express';
import multer from 'multer';
import Jimp from 'jimp';
import fs from 'file-system';
const router = express.Router();


const checktmp = async (req) => new Promise(async (res, rej) => {
  const { tmp } = req.body;
  const userSnap = await db.collection("User").where("tmp", "==", tmp).get();

  if (!userSnap.empty) {
    res("True");
  } else {
    res("False");
  }
});

const checkFileType = (file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png")
    cb(null, true);
  else cb(null, false);
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./upload/");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});

router.post("/images", upload.single("file"), async (req, res) => {
  const tmp = req.body.tmp;
  const checked = await checktmp(req);

  if (checked === "True") {
    const pic = `http://localhost:3000/${req.file.filename}`;
    const image_id = req.body.image_id;

    if (typeof req.file !== "undefined") {
      new Jimp(req.file.path, async (err, image) => {
        if (err) {
          if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
          res.send({ msg: "Image not valid" });
        } else {
          if (req.file.filename.size === 0) {
            res.send({ msg: "Image not valid" });
          } else {
            const userSnap = await db.collection("User").where("tmp", "==", tmp).get();
            const userId = userSnap.docs[0].id;

            await db.collection("Images").doc(image_id).update({
              image: pic,
              user_id: userId,
              image_id: image_id
            });

            res.send({ msg: "Image Uploaded" });
          }
        }
      });
    }
  } else {
    const obj = "Logout";
    res.send(obj);
  }
});

export default router;
