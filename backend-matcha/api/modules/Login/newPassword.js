import express from 'express';
import initializeFirebase from '../../database/firebase.js';
import bcrypt from 'bcrypt';

const router = express.Router();
const { db } = await initializeFirebase();

router.post("/newPassword", async (req, res) => {
  const { password, token } = req.body;
  const snapshot = await db.collection("User").where("token", "==", token).get();

  if (!snapshot.empty) {
    const docId = snapshot.docs[0].id;
    const hash = await bcrypt.hash(password, 10);
    await db.collection("User").doc(docId).update({ password: hash });
    res.send({ msg: "Your password has been updated successfully" });
  } else {
    res.send({ msg: "Invalid token" });
  }
});

export default router;
