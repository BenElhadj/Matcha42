import initializeFirebase from '../../database/firebase.js';
import express from 'express';
const router = express.Router();
const { db } = await initializeFirebase();

const checkTmp = async (req) => {
  const { tmp } = req.body;
  const snapshot = await db.collection("User").where("tmp", "==", tmp).get();
  return snapshot.size !== 0;
};

const reportUser = async (req) => {
  const { tmp, id, reason } = req.body;
  const snapshot = await db.collection("User").where("tmp", "==", tmp).get();
  const id_reporting = snapshot.docs[0].id;
  const result1 = await db
    .collection("Report")
    .where("reporting", "==", id_reporting)
    .where("reported", "==", id)
    .get();

  if (result1.empty) {
    await db.collection("Report").add({
      reporting: id_reporting,
      reported: id,
      Reason: reason,
    });
    return { msg: "User Reported Thank You" };
  } else {
    return { msg: "You Already Reported This User" };
  }
};

router.post("/report", async (req, res) => {
  const isUserValid = await checkTmp(req);

  if (isUserValid) {
    const msg = await reportUser(req);
    res.send(msg);
  } else {
    res.send("Logout");
  }
});

export default router;
