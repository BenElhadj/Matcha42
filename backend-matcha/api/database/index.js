import * as admin from './firebase';
import serviceAccount from './matcha-42-bhamdi-mbouzaie-firebase-adminsdk-1klu6-dbe995a9d1.json';

// Initialiser Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

export default class Database {
  constructor() {
    this.firestore = db;
  }

  async query(collection, conditions = []) {
    let query = this.firestore.collection(collection);

    conditions.forEach(condition => {
      const [field, operator, value] = condition;
      query = query.where(field, operator, value);
    });

    const snapshot = await query.get();
    const results = [];

    snapshot.forEach(doc => {
      results.push({ id: doc.id, data: doc.data() });
    });

    return results;
  }

  async add(collection, data) {
    const docRef = await this.firestore.collection(collection).add(data);
    return docRef.id;
  }

  async update(collection, docId, data) {
    await this.firestore.collection(collection).doc(docId).update(data);
    return docId;
  }

  async delete(collection, docId) {
    await this.firestore.collection(collection).doc(docId).delete();
    return docId;
  }
}
