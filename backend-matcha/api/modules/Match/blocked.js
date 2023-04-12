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

const getBlockedUsers = async (req) => {
  const { tmp } = req.body;
  const userSnapshot = await db.collection("User").where("tmp", "==", tmp).get();
  const userDoc = userSnapshot.docs[0];
  const id = userDoc.id;

  const blockSnapshot = await db
    .collection("Block")
    .where("blocking", "==", id)
    .get();

  let blockedUsers = [];
  for (const blockDoc of blockSnapshot.docs) {
    const blockedUserId = blockDoc.data().blocked;
    const blockedUserSnapshot = await db.collection("User").doc(blockedUserId).get();
    const blockedUserData = blockedUserSnapshot.data();

    blockedUsers.push({
      id: blockedUserId,
      username: blockedUserData.username,
      pic: blockedUserData.pic,
    });
  }

  return blockedUsers;
};

router.post("/blocked", async (req, res) => {
  const isUserValid = await checkTmp(req);
  if (isUserValid) {
    const blockedUsers = await getBlockedUsers(req);
    res.send(blockedUsers);
  } else {
    res.send({ msg: "Logout" });
  }
});

export default router;
