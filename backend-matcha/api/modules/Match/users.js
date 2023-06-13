import initializeFirebase from '../../database/firebase.js';
import express from 'express';
const router = express.Router();
const { db } = await initializeFirebase();

const checkTmp = async (req) => {
  const { tmp } = req.body;
  const snapshot = await db.collection("User").where("tmp", "==", tmp).get();
  return snapshot.size !== 0;
};

const getUsers = async (req) => {
  const { tmp } = req.body;
  const userSnapshot = await db.collection("User").where("tmp", "==", tmp).get();
  const myId = userSnapshot.docs[0].id;
  const infoDoc = await db.collection("Info").doc(myId).get();
  const sexualPref = infoDoc.data().sexualPref;

  const query = sexualPref !== "All"
    ? db.collection("Info").where("gender", "==", sexualPref)
    : db.collection("Info");

  const usersSnapshot = await query.get();

  let users = [];
  for (const userDoc of usersSnapshot.docs) {
    const userId = userDoc.id;
    if (userId === myId) continue;

    const user = await db.collection("User").doc(userId).get();
    const userData = user.data();

    if (userData.completed !== 1) continue;

    const blockSnapshot1 = await db
      .collection("Block")
      .where("blocked", "==", myId)
      .where("blocking", "==", userId)
      .get();
    const blockSnapshot2 = await db
      .collection("Block")
      .where("blocked", "==", userId)
      .where("blocking", "==", myId)
      .get();

    if (!blockSnapshot1.empty || !blockSnapshot2.empty) continue;

    const matchSnapshot1 = await db
      .collection("Matching")
      .where("id_user1", "==", myId)
      .where("id_user2", "==", userId)
      .get();
    const matchSnapshot2 = await db
      .collection("Matching")
      .where("id_user1", "==", userId)
      .where("id_user2", "==", myId)
      .get();

    if (!matchSnapshot1.empty || !matchSnapshot2.empty) continue;

    users.push(userId);
  }

  return users;
};

router.post("/users", async (req, res) => {
  const isUserValid = await checkTmp(req);

  if (isUserValid) {
    const users = await getUsers(req);
    const userSnapshot = await db.collection("User").where("tmp", "==", req.body.tmp).get();
    const myUserData = userSnapshot.docs[0].data();

    const result = await Promise.all(
      users.map(async (userId) => {
        const userDoc = await db.collection("User").doc(userId).get();
        const userData = userDoc.data();
        const ratingDoc = await db.collection("Rating").doc(userId).get();
        const ratingData = ratingDoc.data();

        const distance = Math.round(
          getDistanceFromLatLonInKm(
            myUserData.lat, myUserData.lng,
            userData.lat, userData.lng
          )
        );

        return {
          id: userId,
          username: userData.username,
          pic: userData.pic,
          age: userData.age,
          rating: ratingData.fameRating,
          distance
        };
      })
    );

    res.send(result);
  } else {
    res.send("Logout");
  }
});

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

export default router;
