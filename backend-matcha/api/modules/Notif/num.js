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
  const userId = userSnap.docs[0].id;

  await db.collection("NumNotif").doc(userId).update({ num: 0 });
  return "done";
};

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
