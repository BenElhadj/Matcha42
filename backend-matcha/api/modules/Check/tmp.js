// import db from '../../database/firebase.js';
import initializeFirebase from '../../database/firebase.js';
const { db } = await initializeFirebase();
import express from 'express';
const router = express.Router();

const checktmp = async (req) => new Promise(async (resolve, reject) => {
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

router.post('/tmp', async (req, res) => {
  const msg = await checktmp(req);
  res.send(msg);
});

export default router;
