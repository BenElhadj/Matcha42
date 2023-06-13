import initializeFirebase from '../../database/firebase.js';
import express from 'express';
const router = express.Router();
const { db } = await initializeFirebase();

const checkTmp = async (req) => {
  const { tmp } = req.body;
  const snapshot = await db.collection("User").where("tmp", "==", tmp).get();
  return snapshot.size !== 0;
};

const getUserData = async (req) => {
  const { id, tmp } = req.body;

  const userSnapshot = await db.collection("User").where("tmp", "==", tmp).get();
  const myId = userSnapshot.docs[0].id;

  const userDoc = await db.collection("User").doc(id).get();
  const userInfo = userDoc.data();
  const infoDoc = await db.collection("Info").doc(id).get();
  const infoData = infoDoc.data();

  const imagesSnapshot = await db.collection("Images").where("user_id", "==", id).get();
  const images = imagesSnapshot.docs.map((doc) => doc.data().image);

  const ratingDoc = await db.collection("Rating").doc(id).get();
  const ratingData = ratingDoc.data();

  const matchingSnapshot = await db
    .collection("MatchReq")
    .where("matching", "==", myId)
    .where("matched", "==", id)
    .get();
  const matchedSnapshot = await db
    .collection("MatchReq")
    .where("matched", "==", myId)
    .where("matching", "==", id)
    .get();

  return {
    UserFirstName: userInfo.firstName,
    UserLastName: userInfo.lastName,
    UserUsername: userInfo.username,
    UserPic: userInfo.pic,
    UserAdresse: userInfo.addresse,
    conn: userInfo.isconnected,
    UserGender: infoData.gender,
    UserSexualP: infoData.sexualPref,
    UserBirthday: infoData.date,
    UserBio: infoData.bio,
    image0: images[0],
    image1: images[1],
    image2: images[2],
    image3: images[3],
    rating: ratingData.fameRating,
    liked:
      !matchingSnapshot.empty
        ? "You already liked this user"
        : !matchedSnapshot.empty
        ? "This user has already liked you"
        : "",
  };
};

router.post("/user", async (req, res) => {
  const isUserValid = await checkTmp(req);

  if (isUserValid) {
    const userData = await getUserData(req);
    res.send(userData);
  } else {
    res.send("Logout");
  }
});

export default router;
