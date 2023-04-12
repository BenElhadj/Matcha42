// import db from '../../database/firebase.js';
import initializeFirebase from '../../database/firebase.js';
const { db } = await initializeFirebase();
import express from 'express';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
const router = express.Router();

router.post("/register", async (req, res) => {
  const { firstName, lastName, username, email, password } = req.body;

  if (
    username !== undefined &&
    password !== undefined &&
    firstName !== undefined &&
    lastName !== undefined &&
    email !== undefined
  ) {
    if (
      typeof username === "string" &&
      typeof password === "string" &&
      typeof firstName === "string" &&
      typeof lastName === "string" &&
      typeof email === "string"
    ) {
      const userSnapshot = await db.collection("User").where("username", "==", username).get();

      if (userSnapshot.empty) {
        const emailSnapshot = await db.collection("User").where("email", "==", email).get();

        if (emailSnapshot.empty) {
          const hash = await bcrypt.hash(password, 10);
          const token = await bcrypt.hash(email, 10);
          const pic = "http://localhost:3000/pic.png";

          await db.collection("User").add({
            firstName,
            lastName,
            username,
            email,
            password: hash,
            token,
            pic,
          });

          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
          });

          const mailOptions = {
            from: "Matcha42@gmail.com",
            to: email,
            subject: "Email Verfication",
            text: `<a href='http://localhost:3000/token?token=${token}'>Confirm</a>`,
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) console.log(error);
          });

          res.send({ msg: "A verification email has been sent to you" });
        } else {
          res.send({ msg: "This Email address is already taken. please try another" });
        }
      } else {
        res.send({ msg: "This Username is already taken. please try another" });
      }
    } else {
      return res.send("Invalid input");
    }
  } else {
    return res.send("No inputs");
  }
});

export default router;
