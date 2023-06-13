import express from 'express';
import initializeFirebase from '../../database/firebase.js';

const router = express.Router();
const { db } = await initializeFirebase();

const checktmp = async (req) => {
  const { tmp } = req.body;
  const snapshot = await db.collection("User").where("tmp", "==", tmp).get();

  if (!snapshot.empty) {
    let result = "True";
    return result;
  } else {
    let result = "False";
    return result;
  }
};

const getTab = async (req) => {
  const { tmp } = req.body;
  const userSnapshot = await db
    .collection("User")
    .where("tmp", "==", tmp)
    .get();
  const userId = userSnapshot.docs[0].id;
  const historySnapshot = await db
    .collection("History")
    .where("user_id", "==", userId)
    .get();
  const data = historySnapshot.docs.map((doc) => {
    return { id: doc.id, ...doc.data() };
  });
  return data;
};

router.post("/historyData", async (req, res) => {
  const { tmp } = req.body;
  let checked = await checktmp(req);

  if (checked == "True") {
    const tab = await getTab(req);
    let obj = [];

    for (let index = 0; index < tab.length; index++) {
      let data = {};
      let history = tab[index];
      data.act = history.act;
      data.id = index;
      obj.push(data);
    }

    res.send(obj);
  } else {
    let obj = "Logout";
    res.send(obj);
  }
});

export default router;
