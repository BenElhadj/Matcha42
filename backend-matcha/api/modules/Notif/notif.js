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
  const notifSnap = await db.collection("Notif").where("user_id", "==", userId).get();
  const notifIds = notifSnap.docs.map((doc) => doc.id);

  return notifIds;
};

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
