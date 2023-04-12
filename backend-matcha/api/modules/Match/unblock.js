// import db from '../../database/firebase.js';
import initializeFirebase from '../../database/firebase.js';
const { db } = await initializeFirebase();
import express from 'express';
const router = express.Router();

const checkTmp = async (req) => {
  const { tmp } = req.body;
  const snapshot = await db.collection("User").where("tmp", "==", tmp).get();
  return snapshot.size !== 0;
};

const unblockUser = async (req) => {
  const { tmp, id2 } = req.body;
  const userSnapshot = await db.collection("User").where("tmp", "==", tmp).get();
  const id = userSnapshot.docs[0].id;

  const blockSnapshot = await db
    .collection("Block")
    .where("blocking", "==", id)
    .where("blocked", "==", id2)
    .get();

  if (!blockSnapshot.empty) {
    const blockDoc = blockSnapshot.docs[0];
    await db.collection("Block").doc(blockDoc.id).delete();
  }
};

router.post("/unblock", async (req, res) => {
  const isUserValid = await checkTmp(req);

  if (isUserValid) {
    await unblockUser(req);
    res.send({ msg: "User Unblocked Successfully" });
  } else {
    res.send("Logout");
  }
});

export default router;
