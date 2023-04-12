// import db from '../../database/firebase.js';
import initializeFirebase from '../../database/firebase.js';
const { db } = await initializeFirebase();
import express from 'express';
import bcrypt from 'bcrypt';
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

router.post("/info", async (req, res) => {
  const { FirstName, LastName, Username, Gender, SexualP, Bio, Password, Tags, tmp } = req.body;
  const checked = await checktmp(req);

  if (checked === "True") {
    const userSnap = await db.collection("User").where("tmp", "==", tmp).get();

    if (!userSnap.empty) {
      const user = userSnap.docs[0].data();
      const userId = userSnap.docs[0].id;
      const hash = user.password;

      bcrypt.compare(Password, hash).then(async (ress) => {
        if (ress === true) {
          await db.collection("User").doc(userId).update({
            firstName: FirstName,
            lastName: LastName,
            username: Username,
          });

          await db.collection("Info").doc(userId).update({
            gender: Gender,
            sexualPref: SexualP,
            bio: Bio,
          });

          const tagsRef = db.collection("Tags").where("user_id", "==", userId);
          const tagsSnap = await tagsRef.get();

          tagsSnap.forEach(async (doc) => {
            await db.collection("Tags").doc(doc.id).delete();
          });

          Tags.forEach(async (element) => {
            await db.collection("Tags").add({
              user_id: userId,
              tag: element,
            });
          });

          res.send({ msg: "Profile Updated" });
        } else if (ress === false) {
          res.send({ msg: "Invalid Password" });
        }
      });
    }
  } else {
    const obj = "Logout";
    res.send(obj);
  }
});

export default router;
