import db from "../../database/firebase.js";
import express from 'express';

const router = express.Router();

const checkTmp = async (req) => {
  const { tmp } = req.body;
  const userSnapshot = await db.collection("User").where("tmp", "==", tmp).get();
  return !userSnapshot.empty;
};

const getTab = async (req) => {
  const { tmp } = req.body;
  const userSnapshot = await db.collection("User").where("tmp", "==", tmp).get();
  const userDoc = userSnapshot.docs[0];
  const id = userDoc.id;

  const matchingSnapshot1 = await db.collection("Matching").where("id_user2", "==", id).get();
  const matchingSnapshot2 = await db.collection("Matching").where("id_user1", "==", id).get();

  let tab = [];
  matchingSnapshot1.forEach(matchingDoc => tab.push(matchingDoc.data().id_user1));
  matchingSnapshot2.forEach(matchingDoc => tab.push(matchingDoc.data().id_user2));

  return tab;
};

router.post('/friends', async (req, res) => {
  const isUserValid = await checkTmp(req);
  if (isUserValid) {
    const obj = [];
    const tab = await getTab(req);
    for (let i = 0; i < tab.length; i++) {
      let data = {};
      const userSnapshot = await db.collection('User').doc(tab[i]).get();
      const userData = userSnapshot.data();
      const myId = (await db.collection('User').where('tmp', '==', req.body.tmp).get()).docs[0].id;
      data.id = tab[i];
      data.username = userData.username;
      data.pic = userData.pic;
      data.conn = userData.isconnected;
      data.myid = myId;
      obj.push(data);
    }
    res.send(obj);
  } else {
    res.send('Logout');
  }
});

export default router;
