import express from 'express';
import initializeFirebase from '../../database/firebase.js';

const router = express.Router();
const { db } = await initializeFirebase();

const checktmp = async (req) => {
  const { tmp } = req.body;
  const snapshot = await db.collection("User").where("tmp", "==", tmp).get();

  if (!snapshot.empty) {
    return "True";
  } else {
    return "False";
  }
};

const getTab = async (req) => {
  const { tmp, id } = req.body;
  const snapshot = await db.collection("User").where("tmp", "==", tmp).get();
  const user = snapshot.docs[0].data();

  return user.pic;
};

router.post('/getimage', async (req, res) => {
  let checked = await checktmp(req);

  if (checked == "True") {
    const tab = await getTab(req);
    res.send(tab);
  } else {
    let obj = "Logout";
    res.send(obj);
  }
});

export default router;
