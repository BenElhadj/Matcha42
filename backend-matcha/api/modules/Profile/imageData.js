// import db from '../../database/firebase.js';
import initializeFirebase from '../../database/firebase.js';
const { db } = await initializeFirebase();
import express from 'express';
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

router.post("/imageData", async (req, res) => {
  const { tmp } = req.body;
  const checked = await checktmp(req);

  if (checked === "True") {
    const userSnap = await db.collection("User").where("tmp", "==", tmp).get();
    const userId = userSnap.docs[0].id;

    const imagesSnap = await db.collection("Images").where("user_id", "==", userId).get();
    const imagesData = imagesSnap.docs.map((doc) => doc.data());

    res.send(imagesData);
  } else {
    const obj = "Logout";
    res.send(obj);
  }
});

export default router;
