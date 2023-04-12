// import db from '../../database/firebase.js';
import initializeFirebase from '../../database/firebase.js';
const { db } = await initializeFirebase();
import express from 'express';
const router = express.Router();

router.post("/token", async (req, res) => {
  const { token } = req.body;
  const userSnapshot = await db.collection("User").where("token", "==", token).get();

  if (!userSnapshot.empty) {
    userSnapshot.forEach(async (doc) => {
      await db.collection("User").doc(doc.id).update({ valid: 1 });
    });
    res.send({ token: "Your account has been verified." });
  } else {
    res.send({ token: "The token is not valid" });
  }
});

export default router;
