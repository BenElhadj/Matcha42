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

router.post("/password", async (req, res) => {
  const { NewPassword, password, tmp } = req.body;
  const checked = await checktmp(req);
  if (checked === "True") {
    const userSnap = await db.collection("User").where("tmp", "==", tmp).get();

    if (!userSnap.empty) {
      const userData = userSnap.docs[0].data();
      const hash = userData.password;
      const isPasswordMatch = await bcrypt.compare(password, hash);

      if (isPasswordMatch) {
        const NPassword = await bcrypt.hash(NewPassword, 10);
        await db
          .collection("User")
          .doc(userSnap.docs[0].id)
          .update({ password: NPassword });
        res.send({ msg: "Password Updated" });
      } else {
        res.send({ msg: "Invalid Password" });
      }
    }
  } else {
    const obj = "Logout";
    res.send(obj);
  }
});

export default router;
