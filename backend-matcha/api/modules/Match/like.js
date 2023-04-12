import db from "../../database/firebase.js";
import express from 'express';

const router = express.Router();

const checkTmp = async (req) => {
  const { tmp } = req.body;
  const userSnapshot = await db.collection("User").where("tmp", "==", tmp).get();
  return !userSnapshot.empty;
};

const getTab = async (req) => {
  const { tmp, id } = req.body;
  const idMatching = (await db.collection("User").where("tmp", "==", tmp).get()).docs[0].id;
  const matchingSnapshot = await db.collection("MatchReq").where("matching", "==", idMatching).where("matched", "==", id).get();
  const score = (await db.collection("Rating").doc(id).get()).data().score;
  
  if (!matchingSnapshot.empty) {
    const matchingDoc = matchingSnapshot.docs[0];
    const idMatchingDoc = matchingDoc.id;
    await db.collection("Matching").add({
      id_user1: id,
      id_user2: idMatching
    });
    await db.collection("MatchReq").doc(idMatchingDoc).delete();
    const newScore = score + 1;
    const fameRating = newScore < 5 ? 2 : newScore < 15 ? 3 : newScore < 50 ? 4 : 5;
    await db.collection("Rating").doc(id).update({ score: newScore, fameRating: fameRating });
    return { msg: 'User Matched Successfully, You Can Now Chat!' };
  } else {
    const blockedSnapshot = await db.collection("Block").where("blocked", "==", idMatching).where("blocking", "==", id).get();
    if (!blockedSnapshot.empty) {
      return { msg: 'You cannot like this user because you are blocked by them.' };
    } else {
      const existingMatchSnapshot1 = await db.collection("Matching").where("id_user1", "==", idMatching).where("id_user2", "==", id).get();
      const existingMatchSnapshot2 = await db.collection("Matching").where("id_user1", "==", id).where("id_user2", "==", idMatching).get();
      if (!existingMatchSnapshot1.empty || !existingMatchSnapshot2.empty) {
        return { msg: 'You already matched this user.' };
      } else {
        await db.collection("MatchReq").add({
          matching: idMatching,
          matched: id
        });
        const newScore = score + 1;
        const fameRating = newScore < 5 ? 2 : newScore < 15 ? 3 : newScore < 50 ? 4 : 5;
        await db.collection("Rating").doc(id).update({ score: newScore, fameRating: fameRating });
        return { msg: 'User Liked Successfully' };
      }
    }
  }
};

router.post('/like', async (req, res) => {
  const isUserValid = await checkTmp(req);
  if (isUserValid) {
    const msg = await getTab(req);
    res.send(msg);
  } else {
    res.send({ msg: 'Logout' });
  }
});

export default router;
