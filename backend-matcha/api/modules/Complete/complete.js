import db from '../../database/firebase.js';
import express from 'express';
const router = express.Router();

function getAge(dateString) {
  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

const checktmp = async (req) => new Promise(async (resolve, reject) => {
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

router.post("/complete", async (req, res) => {
  const { gender, sexualPref, bio, tags, date, tmp } = req.body;
  let checked = await checktmp(req);

  if (checked == "True") {
    const userSnapshot = await db.collection("User").where("tmp", "==", tmp).get();
    const userId = userSnapshot.docs[0].id;

    const infoSnapshot = await db.collection("Info").where("user_id", "==", userId).get();

    if (infoSnapshot.empty) {
      await db.collection("Info").add({
        user_id: userId,
        gender,
        sexualPref,
        bio,
        date,
      });

      tags.forEach(async (element) => {
        await db.collection("Tags").add({
          user_id: userId,
          tag: element,
        });
      });

      await db.collection("User").doc(userId).update({ completed: 1 });

      let images = [
        "http://localhost:3000/2020-02-08T13:53:45.985ZMatcha1.jpeg",
        "http://localhost:3000/2020-02-08T13:56:44.007ZMatcha2.jpg",
        "http://localhost:3000/2020-02-08T13:53:45.985ZMatcha3.jpeg",
        "http://localhost:3000/2020-02-08T13:53:45.985ZMatcha4.jpeg",
      ];

      images.forEach(async (image, index) => {
        await db.collection("Images").add({
          user_id: userId,
          image_id: index + 1,
          image,
        });
      });

      await db.collection("Rating").add({
        user_id: userId,
        score: 1,
        fameRating: 1,
      });

      const age = getAge(date);
      await db.collection("User").doc(userId).update({ age });

      await db.collection("NumNotif").add({
        user_id: userId,
        num: 0,
      });
    }
  } else {
    let obj = "Logout";
    res.send(obj);
  }
});

export default router;
