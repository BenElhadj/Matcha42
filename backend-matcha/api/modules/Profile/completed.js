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
  const completed = userSnap.docs[0].data().completed;
  res(completed);
});

router.post("/completed", async (req, res) => {
  const checked = await checktmp(req);

  if (checked === "True") {
    const completed = await getTab(req);
    const obj = {};
    obj.completed = completed;
    res.send(obj);
  } else {
    const obj = "Logout";
    res.send(obj);
  }
});

export default router;
