import initializeFirebase from '../../database/firebase.js';
import express from 'express';

const router = express.Router();
const { db } = await initializeFirebase();

const checkTmp = async (req) => {
  const { tmp } = req.body;
  const userSnapshot = await db.collection("User").where("tmp", "==", tmp).get();
  return !userSnapshot.empty;
};

const getUsersToMatch = async (req) => {
  const { tmp } = req.body;
  const userSnapshot = await db.collection("User").where("tmp", "==", tmp).get();
  const userDoc = userSnapshot.docs[0];
  const id = userDoc.id;

  const infoSnapshot = await db.collection("Info").doc(id).get();
  const infoData = infoSnapshot.data();

  const sexualPref = infoData.sexualPref;
  const usersToMatch = [];

  const usersSnapshot = sexualPref === "All" ? await db.collection("Info").get() : await db.collection("Info").where("gender", "==", sexualPref).get();

  for (const userDoc of usersSnapshot.docs) {
    const userId = userDoc.id;
    if (userId !== id) {
      const blockedSnapshot1 = await db
        .collection("Block")
        .where("blocked", "==", id)
        .where("blocking", "==", userId)
        .get();
      const blockedSnapshot2 = await db
        .collection("Block")
        .where("blocked", "==", userId)
        .where("blocking", "==", id)
        .get();

      if (blockedSnapshot1.empty && blockedSnapshot2.empty) {
        const matchSnapshot1 = await db
          .collection("Matching")
          .where("id_user1", "==", userId)
          .where("id_user2", "==", id)
          .get();
        const matchSnapshot2 = await db
          .collection("Matching")
          .where("id_user1", "==", id)
          .where("id_user2", "==", userId)
          .get();

        if (matchSnapshot1.empty && matchSnapshot2.empty) {
          usersToMatch.push(userId);
        }
      }
    }
  }

  return usersToMatch;
};

const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
};

const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

router.post("/matchWith", async (req, res) => {
  const { tmp, rangeAge, rangeLoc, tag, rangeFame } = req.body;
  const rangeAgeValue = rangeAge || [0, 100];
  const rangeFameValue = rangeFame || [1, 5];
  const rangeLocValue = rangeLoc || [0, 5000];

  const isUserValid = await checkTmp(req);
  if (isUserValid) {
    const usersToMatch = await getUsersToMatch(req);
    const userSnapshot = await db.collection("User").where("tmp", "==", tmp).get();
    const userDoc = userSnapshot.docs[0];
    const myId = userDoc.id;

    let filteredUsers = [];
    for (const userId of usersToMatch) {
      const userDoc = await db.collection("User").doc(userId).get();
      const userData = userDoc.data();

      if (userData.age >= rangeAgeValue[0] && userData.age <= rangeAgeValue[1]) {
        const ratingSnapshot = await db.collection("Rating").doc(userId).get();
        const ratingData = ratingSnapshot.data();
        if (ratingData.fameRating >= rangeFameValue[0] && ratingData.fameRating <= rangeFameValue[1]) {
            let shouldIncludeUser = true;
  
            if (tag) {
              const myTagsSnapshot = await db.collection("Tags").where("user_id", "==", myId).get();
              const myTags = myTagsSnapshot.docs.map((doc) => doc.data().tag);
  
              const userTagsSnapshot = await db.collection("Tags").where("user_id", "==", userId).get();
              const userTags = userTagsSnapshot.docs.map((doc) => doc.data().tag);
  
              const commonTags = myTags.filter((tag) => userTags.includes(tag));
              shouldIncludeUser = commonTags.length > 0;
            }
  
            if (shouldIncludeUser) {
              const distance = getDistanceFromLatLonInKm(
                userDoc.data().lat,
                userDoc.data().lng,
                userData.lat,
                userData.lng
              );
  
              if (distance >= rangeLocValue[0] && distance <= rangeLocValue[1]) {
                filteredUsers.push({
                  id: userId,
                  username: userData.username,
                  pic: userData.pic,
                  age: userData.age,
                  rating: ratingData.fameRating,
                  distance,
                });
              }
            }
          }
        }
      }
  
      res.send(filteredUsers);
    } else {
      res.send("Logout");
    }
  });
  
  export default router;
