import express from 'express';
import initializeFirebase from '../../database/firebase.js';
import nodemailer from 'nodemailer';

const router = express.Router();
const { db } = await initializeFirebase();

router.post("/forget", async (req, res) => {
  const { email } = req.body;

  if (email !== undefined) {
    if (typeof email === "string") {
      const snapshot = await db.collection("User").where("email", "==", email).get();

      if (!snapshot.empty) {
        const userDoc = snapshot.docs[0];
        const valid = userDoc.data().valid;

        if (valid == 1) {
          const token = userDoc.data().token;

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
            subject: "Forget Password",
            text: `http://localhost:3000/forget?token=${token}`,
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) console.log(error);
          });

          res.send({ msg: "An email has been sent to you to reset your password" });
        } else {
          res.send({ msg: "Please verify your email address" });
        }
      } else {
        res.send({ msg: "Email not found" });
      }
    } else {
      return res.send("Invalid input");
    }
  } else {
    return res.send("No inputs");
  }
});

export default router;
