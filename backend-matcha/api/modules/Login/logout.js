// import db from '../../database/firebase.js';
import initializeFirebase from '../../database/firebase.js';
const { db } = await initializeFirebase();
import express from 'express';
const router = express.Router();

const checkTmp = async (req) => {
  const { tmp } = req.body;
  const snapshot = await db.collection("User").where("tmp", "==", tmp).get();

  if (!snapshot.empty) {
    return "True";
  } else {
    return "False";
  }
};

const getTab = async (req) => {
  const { tmp } = req.body;
  const snapshot = await db.collection("User").where("tmp", "==", tmp).get();
  const docId = snapshot.docs[0].id;

  const today = new Date();
  const date =
    today.getFullYear() +
    "-" +
    (today.getMonth() + 1) +
    "-" +
    today.getDate();
  const time =
    today.getHours() +
    ":" +
    today.getMinutes() +
    ":" +
    today.getSeconds();
  const dateTime = date + " " + time;

  await db.collection("User").doc(docId).update({ isconnected: dateTime });

  return "done";
};

router.post("/logout", async (req, res) => {
  const checked = await checkTmp(req);
  if (checked == "True") {
    await getTab(req);
    res.send("done");
  } else {
    let obj = "Logout";
    res.send(obj);
  }
});

export default router;
