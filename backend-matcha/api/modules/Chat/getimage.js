// import db from '../../database/firebase.js';
import initializeFirebase from '../../database/firebase.js';
const { db } = await initializeFirebase();
import express from 'express';
const router = express.Router();

const checktmp = async (req) => new Promise(async (res, rej) => {
  const { tmp } = req.body;
  const snapshot = await db.collection("User").where("tmp", "==", tmp).get();
  if (!snapshot.empty) {
    res("True");
  } else {
    res("False");
  }
});

const getTab = async (req) => new Promise(async (res, rej) => {
  const { tmp, id } = req.body;
  const snapshot = await db.collection("User").where("tmp", "==", tmp).get();
  const user = snapshot.docs[0].data();
  res(user.pic);
});

router.post('/getimage', async (req, res) => {
  let checked = await checktmp(req);
  if (checked == "True") {
    const tab = await getTab(req);
    res.send(tab);
  } else {
    let obj = "Logout";
    res.send(obj);
  }
});

export default router;
