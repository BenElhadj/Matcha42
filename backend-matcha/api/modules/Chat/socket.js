import app from 'express';
import http from 'http';
import socketIO from 'socket.io';
import initializeFirebase from '../../database/firebase.js';

const { db } = await initializeFirebase();
const server = http.createServer(app);
const io = socketIO(server);
const connections = {};

io.on('connection', async function (socket) {
  let user = socket.request._query['user'];
  const userSnap = await db.collection('User').where('tmp', '==', user).get();

  if (!userSnap.empty) {
    const userData = userSnap.docs[0].data();
    const userId = userSnap.docs[0].id;
    connections[userId] = socket;
  }

  socket.on('chat', async function (data) {
    const senderSnap = await db.collection('User').where('tmp', '==', data.id).get();
    const senderData = senderSnap.docs[0].data();
    const senderId = senderSnap.docs[0].id;
    const receiverId = data.other;

    const matchQuery1 = db.collection('Matching').where('id_user2', '==', senderId).where('id_user1', '==', receiverId);
    const matchQuery2 = db.collection('Matching').where('id_user1', '==', senderId).where('id_user2', '==', receiverId);
    const matchSnap1 = await matchQuery1.get();
    const matchSnap2 = await matchQuery2.get();

    if (connections[senderId] && (matchSnap1.size + matchSnap2.size != 0)) {
      connections[senderId].emit('newMessage', data);
    }

    if (connections[receiverId] && (matchSnap1.size + matchSnap2.size != 0)) {
      connections[receiverId].emit('newMessage', data);
    }
  });

  socket.on('notification', function (data) {
    const receiverId = data.id;

    if (connections[receiverId]) {
      connections[receiverId].emit('notification', data);
    }
  });
});

export default {
  app,
  server,
};
