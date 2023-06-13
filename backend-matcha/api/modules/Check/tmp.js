import express from 'express';
import initializeFirebase from '../../database/firebase.js';

const router = express.Router();
const { db } = await initializeFirebase();

const checktmp = async (req) => {
  const { tmp } = req.body;
  const snapshot = await db.collection("User").where("tmp", "==", tmp).get();

  if (!snapshot.empty) {
    let result = "True";
    return result;
  } else {
    let result = "False";
    return result;
  }
};

router.post('/tmp', async (req, res) => {
  const msg = await checktmp(req);
  res.send(msg);
});

export default router;
