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

const getTab = async (req) => new Promise(async (res, rej) => {
  const { tmp } = req.body;
  const userSnap = await db.collection("User").where("tmp", "==", tmp).get();
  const userId = userSnap.docs[0].id;

  await db.collection("NumNotif").doc(userId).update({ num: 0 });
  res("done");
});

router.post("/num", async (req, res) => {
  const checked = await checktmp(req);

  if (checked === "True") {
    const tab = await getTab(req);
    res.send(tab);
  } else {
    const obj = "Logout";
    res.send(obj);
  }
});

export default router;
