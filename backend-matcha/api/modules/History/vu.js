// import db from '../../database/firebase.js';
import initializeFirebase from '../../database/firebase.js';
const { db } = await initializeFirebase();
import express from 'express';
const router = express.Router();

const checktmp = async (req) =>
  new Promise(async (resolve, reject) => {
    const { tmp } = req.body;
    const snapshot = await db.collection("User").where("tmp", "==", tmp).get();

    if (!snapshot.empty) {
      let result = "True";
      resolve(result);
    } else {
      let result = "False";
      resolve(result);
    }
  });

const getTab = (req) =>
  new Promise(async (resolve, reject) => {
    const { tmp, id2 } = req.body;
    const userSnapshot = await db
      .collection("User")
      .where("tmp", "==", tmp)
      .get();
    const userDoc = userSnapshot.docs[0];
    const id1 = userDoc.id;
    const username1 = userDoc.data().username;

    const user2Snapshot = await db.collection("User").doc(id2).get();
    const username2 = user2Snapshot.data().username;

    let act1 = `You have visited ${username2}'s profile`;
    let act2 = `${username1} have been visited your profile`;

    await db.collection("History").add({ user_id: id1, act: act1 });
    await db.collection("Notif").add({ user_id: id2, act: act2 });

    const numNotifSnapshot = await db
      .collection("NumNotif")
      .where("user_id", "==", id2)
      .get();
    const numNotifDoc = numNotifSnapshot.docs[0];
    const num = numNotifDoc.data().num + 1;

    await db.collection("NumNotif").doc(numNotifDoc.id).update({ num });

    resolve("Done");
  });

router.post("/vu", async (req, res) => {
  let checked = await checktmp(req);
  if (checked == "True") {
    const msg = await getTab(req);
    res.send(msg);
  } else {
    let obj = "Logout";
    res.send(obj);
  }
});

export default router;
