import initializeFirebase from '../../database/firebase.js';
import express from 'express';
const router = express.Router();
const { db } = await initializeFirebase();

const checkTmp = async (req) => {
  const { tmp } = req.body;
  const snapshot = await db.collection("User").where("tmp", "==", tmp).get();
  return snapshot.size !== 0;
};

const unlikeUser = async (req) => {
  const { tmp, id2 } = req.body;
  const userSnapshot = await db.collection("User").where("tmp", "==", tmp).get();
  const id = userSnapshot.docs[0].id;

  const matchingSnapshot1 = await db
    .collection("Matching")
    .where("id_user1", "==", id)
    .where("id_user2", "==", id2)
    .get();
  const matchingSnapshot2 = await db
    .collection("Matching")
    .where("id_user1", "==", id2)
    .where("id_user2", "==", id)
    .get();

  if (!matchingSnapshot1.empty) {
    const matchingDoc = matchingSnapshot1.docs[0];
    await db.collection("Matching").doc(matchingDoc.id).delete();
  }

  if (!matchingSnapshot2.empty) {
    const matchingDoc = matchingSnapshot2.docs[0];
    await db.collection("Matching").doc(matchingDoc.id).delete();
  }

  const username = (await db.collection("User").doc(id).get()).data().username;
  const msg = `${username} Have Unliked You`;

  await db.collection("Notif").add({
    user_id: id2,
    act: msg,
  });

  const numSnapshot = await db.collection("NumNotif").where("user_id", "==", id2).get();
  if (!numSnapshot.empty) {
    const numDoc = numSnapshot.docs[0];
    const num = numDoc.data().num + 1;
    await db.collection("NumNotif").doc(numDoc.id).update({
      num: num,
    });
  }

  return true;
};

router.post('/unlike', async (req, res) => {
  const isUserValid = await checkTmp(req);

  if (isUserValid) {
    await unlikeUser(req);
    res.send({ msg: 'User Unliked Successfully' });
  } else {
    res.send("Logout");
  }
});

export default router;
