import initializeFirebase from '../../database/firebase.js';
import express from 'express';
import bcrypt from 'bcrypt';
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

router.post("/email", async (req, res) => {
  const { email, password, tmp } = req.body;
  const checked = await checktmp(req);

  if (checked === "True") {
    const userSnap = await db.collection("User").where("tmp", "==", tmp).get();

    if (!userSnap.empty) {
      const user = userSnap.docs[0].data();
      const hash = user.password;

      bcrypt.compare(password, hash).then(async (ress) => {
        if (ress === true) {
          const emailSnap = await db.collection("User").where("email", "==", email).get();

          if (emailSnap.empty) {
            const token = await bcrypt.hash(email, 10);
            await db.collection("User").doc(userSnap.docs[0].id).update({
              email: email,
              token: token,
            });
            res.send({ msg: "Email Updated" });
          } else {
            res.send({ msg: "This Email address is already taken. Please try another" });
          }
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
