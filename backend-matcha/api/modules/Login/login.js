// import db from '../../database/firebase.js';
import initializeFirebase from '../../database/firebase.js';
const { db } = await initializeFirebase();
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const router = express.Router();

// Verify Token
function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403); // Forbidden
  }
}

async function checkUser(username, password, res) {
  const snapshot = await db.collection("User").where("username", "==", username).get();

  if (!snapshot.empty) {
    const userData = snapshot.docs[0].data();
    const docId = snapshot.docs[0].id;
    const {
      firstName,
      lastName,
      user,
      email,
      pic,
      completed,
      password: hash,
      valid,
    } = userData;

    const isPasswordCorrect = await bcrypt.compare(password, hash);

    if (isPasswordCorrect) {
      if (valid === 1) {
        jwt.sign({ username: username }, "asalah", async (err, token) => {
          const tmp = token;
          await db.collection("User").doc(docId).update({ tmp });

          res.json({
            token,
            id: docId,
            FirstName: firstName,
            LastName: lastName,
            Username: user,
            Email: email,
            Pic: pic,
            Completed: completed,
          });
        });
      } else {
        res.send({ msg: "Please verify your email address" });
      }
    } else {
      res.send({ msg: "Invalid Password" });
    }
  } else {
    res.send({ msg: "Invalid username" });
  }
}

router.post("/posts", verifyToken, (req, res) => {
  jwt.verify(req.token, "asalah", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({ message: "Post created...", authData });
    }
  });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username !== undefined && password !== undefined) {
    if (typeof username === "string" && typeof password === "string") {
      checkUser(username, password, res);
    } else {
      return res.send("Invalid input");
    }
  } else {
    return res.send("No inputs");
  }
});

export default router;
