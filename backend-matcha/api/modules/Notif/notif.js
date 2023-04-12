// import db from '../../database/firebase.js';
import initializeFirebase from '../../database/firebase.js';
const { db } = await initializeFirebase();
import express from 'express';
const router = express.Router();


const checktmp = async (req) => new Promise(async (res, rej) => {
  const { tmp } = req.body;
  const userSnap = await db.collection("User").where("tmp", "==", tmp).get();

  if (!userSnap.empty) {
    res("True");
  } else {
    res("False");
  }
});

const getTab = async (req) => new Promise(async (res, rej) => {
  const { tmp } = req.body;
  const userSnap = await db.collection("User").where("tmp", "==", tmp).get();
  const userId = userSnap.docs[0].id;
  const notifSnap = await db.collection("Notif").where("user_id", "==", userId).get();
  const notifIds = notifSnap.docs.map((doc) => doc.id);

  res(notifIds);
});

router.post("/notif", async (req, res) => {
  const { tmp } = req.body;
  const checked = await checktmp(req);

  if (checked === "True") {
    const tab = await getTab(req);
    const obj = [];

    for (let index = 0; index < tab.length; index++) {
      const notifRef = db.collection("Notif").doc(tab[index]);
      const notifSnap = await notifRef.get();
      const notifData = notifSnap.data();

      const data = {
        act: notifData.act,
        id: index,
      };

      obj.push(data);
    }

    res.send(obj);
  } else {
    const obj = "Logout";
    res.send(obj);
  }
});

export default router;
