import express from 'express';
import initializeFirebase from '../../database/firebase.js';

const router = express.Router();
const { db } = await initializeFirebase();

const checktmp = async (req) => {
  const { tmp } = req.body;
  const querySnapshot = await db.collection('User').where('tmp', '==', tmp).get();

  if (!querySnapshot.empty) {
    return "True";
  } else {
    return "False";
  }
};

const getTab = async (req) => {
  const { tmp, id } = req.body;
  const myidSnapshot = await db.collection('User').where('tmp', '==', tmp).get();
  const myid = myidSnapshot.docs[0].id;

  const data1Snapshot = await db.collection('Chat').where('id_send', '==', myid).where('id_res', '==', id).get();
  const data2Snapshot = await db.collection('Chat').where('id_send', '==', id).where('id_res', '==', myid).get();

  const data1 = data1Snapshot.docs.map(doc => doc.data());
  const data2 = data2Snapshot.docs.map(doc => doc.data());
  const data = [...data1, ...data2];

  return data;
};

router.post('/', async (req, res) => {
  const check = await checktmp(req);

  if (check === "True") {
    const tab = await getTab(req);
    const obj = [];

    for (let index = 0; index < tab.length; index++) {
      const userSnapshot = await db.collection('User').doc(tab[index].id_send).get();
      const userData = userSnapshot.data();

      let data = {
        img: userData.pic,
        id_send: tab[index].id_send,
        id: tab[index].id,
        msg: tab[index].msg
      };

      obj.push(data);
    }

    res.send(obj);
  } else {
    res.send("Logout");
  }
});

export default router;
