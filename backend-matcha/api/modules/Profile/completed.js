import initializeFirebase from '../../database/firebase.js';
import express from 'express';
const router = express.Router();
const { db } = await initializeFirebase();

const checktmp = async (req) => {
  const { tmp } = req.body;
  const userSnap = await db.collection("User").where("tmp", "==", tmp).get();

  if (!userSnap.empty) {
    return "True";
  } else {
    return "False";
  }
};

const getTab = async (req) => {
  const { tmp } = req.body;
  const userSnap = await db.collection("User").where("tmp", "==", tmp).get();
  const completed = userSnap.docs[0].data().completed;
  return completed;
};

router.post("/completed", async (req, res) => {
  const checked = await checktmp(req);

  if (checked === "True") {
    const completed = await getTab(req);
    const obj = { completed };
    res.send(obj);
  } else {
    const obj = "Logout";
    res.send(obj);
  }
});

export default router;
