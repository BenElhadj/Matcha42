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
  const numNotifRef = db.collection("NumNotif").doc(userId);
  const numNotifSnap = await numNotifRef.get();
  const numNotif = numNotifSnap.data().num;

  return numNotif;
};

router.post("/dataNotif", async (req, res) => {
  const { tmp } = req.body;
  const checked = await checktmp(req);

  if (checked === "True") {
    const tab = await getTab(req);
    res.send({ num: tab });
  } else {
    const obj = "Logout";
    res.send(obj);
  }
});

export default router;
