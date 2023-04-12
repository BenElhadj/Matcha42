// import db from '../../database/firebase.js';
import initializeFirebase from '../../database/firebase.js';
const { db } = await initializeFirebase();
import express from 'express';
const router = express.Router();

const checkTmp = async (req) => {
  const { tmp } = req.body;
  const userSnapshot = await db.collection("User").where("tmp", "==", tmp).get();
  return !userSnapshot.empty;
};

const blockUser = async (req) => {
  const { tmp, id } = req.body;
  const userSnapshot = await db.collection("User").where("tmp", "==", tmp).get();
  const userDoc = userSnapshot.docs[0];
  const id1 = userDoc.id;

  const blockingSnapshot = await db
    .collection("Block")
    .where("blocking", "==", id1)
    .where("blocked", "==", id)
    .get();

  const blockedSnapshot = await db
    .collection("Block")
    .where("blocking", "==", id)
    .where("blocked", "==", id1)
    .get();

  if (blockingSnapshot.empty && blockedSnapshot.empty) {
    await db.collection("Block").add({ blocking: id1, blocked: id });
    return { msg: "User has been blocked" };
  } else {
    return { msg: "You can't block this user" };
  }
};

router.post("/block", async (req, res) => {
  const isUserValid = await checkTmp(req);
  if (isUserValid) {
    const msg = await blockUser(req);
    res.send(msg);
  } else {
    res.send({ msg: "Logout" });
  }
});

export default router;
