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

router.post("/data", async (req, res) => {
  const { tmp } = req.body;
  const checked = await checktmp(req);

  if (checked === "True") {
    const userSnap = await db.collection("User").where("tmp", "==", tmp).get();
    const userData = userSnap.docs[0].data();
    const userId = userSnap.docs[0].id;

    const infoSnap = await db.collection("Info").where("user_id", "==", userId).get();
    const tagsSnap = await db.collection("Tags").where("user_id", "==", userId).get();
    const ratingSnap = await db.collection("Rating").where("user_id", "==", userId).get();

    const obj = {
      data: userData,
      info: infoSnap.docs.map((doc) => doc.data()),
      tags: tagsSnap.docs.map((doc) => doc.data()),
      rating: ratingSnap.docs.map((doc) => doc.data().fameRating),
    };

    res.send(obj);
  } else {
    const obj = "Logout";
    res.send(obj);
  }
});

export default router;
