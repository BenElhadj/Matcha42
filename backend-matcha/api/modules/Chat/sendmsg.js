// import db from '../../database/firebase.js';
import initializeFirebase from '../../database/firebase.js';
const { db } = await initializeFirebase();
import express from 'express';
const router = express.Router();

const checktmp = async (req) => new Promise(async (res, rej) => {
    const { tmp } = req.body;
    const snapshot = await db.collection("User").where("tmp", "==", tmp).get();
    if (!snapshot.empty) {
      res("True");
    } else {
      res("False");
    }
  });
  
  const send = async (req) => new Promise(async (res, rej) => {
    const { tmp, id, msg } = req.body;
    const snapshot = await db.collection("User").where("tmp", "==", tmp).get();
    const user = snapshot.docs[0];
    const id_send = user.id;
    const username = user.data().username;
    
    await db.collection("Chat").add({
      id_send: id_send,
      id_res: id,
      msg: msg
    });
  
    const snapshot1 = await db.collection("Matching").where("id_user2", "==", id_send).where("id_user1", "==", id).get();
    const snapshot2 = await db.collection("Matching").where("id_user1", "==", id_send).where("id_user2", "==", id).get();
    
    if (!snapshot1.empty || !snapshot2.empty) {
        const act = `${username} Sended You A Msg`;
        
        await db.collection("Notif").add({
          user_id: id,
          act: act
        });
    
        const numSnapshot = await db.collection("NumNotif").where("user_id", "==", id).get();
        const numNotif = numSnapshot.docs[0];
        const num = numNotif.data().num + 1;
    
        await db.collection("NumNotif").doc(numNotif.id).update({
          num: num
        });
      }
      
      res("done");
    });
    
    router.post('/sendmsg', async (req, res) => {
      let checked = await checktmp(req);  
      if (checked == "True") {
        const msg = await send(req);
        res.send(msg);
      } else {
        let obj = "Logout";
        res.send(obj);
      }
    });
    
    export default router;
    