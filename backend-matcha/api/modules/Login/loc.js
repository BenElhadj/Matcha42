import express from 'express';
import initializeFirebase from '../../database/firebase.js';

const router = express.Router();
const { db } = await initializeFirebase();

const checktmp = async (req) => {
  const { tmp } = req.body;
  const snapshot = await db.collection("User").where("tmp", "==", tmp).get();

  if (!snapshot.empty) {
    return "True";
  } else {
    return "False";
  }
};

router.post("/loc", async (req, res) => {
  const { lat, lng, adresse, tmp } = req.body;
  let checked = await checktmp(req);

  if (checked == "True") {
    const snapshot = await db.collection("User").where("tmp", "==", tmp).get();
    const userDoc = snapshot.docs[0];

    userDoc.ref.update({
      lat: lat,
      lng: lng,
      adresse: adresse,
    });
  } else {
    let obj = "Logout";
    res.send(obj);
  }
});

export default router;
