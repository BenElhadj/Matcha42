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

router.post("/location", async (req, res) => {
  const { lat, lng, tmp } = req.body;
  const checked = await checktmp(req);
  if (checked === "True") {
    const userSnap = await db.collection("User").where("tmp", "==", tmp).get();

    if (!userSnap.empty) {
      const userId = userSnap.docs[0].id;
      await db.collection("User").doc(userId).update({
        lat: lat,
        lng: lng,
      });
      res.send({ msg: "Location Updated" });
    }
  } else {
    const obj = "Logout";
    res.send(obj);
  }
});

export default router;
