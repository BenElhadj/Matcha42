// import db from '../../database/firebase.js';
import initializeFirebase from '../../database/firebase.js';
const { db } = await initializeFirebase();
import express from 'express';
const router = express.Router();

const checktmp = async (req) =>
  new Promise(async (res, rej) => {
    const { tmp } = req.body;
    const snapshot = await db.collection("User").where("tmp", "==", tmp).get();

    if (!snapshot.empty) {
      res("True");
    } else {
      res("False");
    }
  });

/////////// Localisation ///////////////
router.post("/loc", async (req, res) => {
  const { lat, lng, addresse, tmp } = req.body;
  let checked = await checktmp(req);
  if (checked == "True") {
    const snapshot = await db.collection("User").where("tmp", "==", tmp).get();
    const userDoc = snapshot.docs[0];

    userDoc.ref.update({
      lat: lat,
      lng: lng,
      addresse: addresse,
    });
  } else {
    let obj = "Logout";
    res.send(obj);
  }
});

export default router;
