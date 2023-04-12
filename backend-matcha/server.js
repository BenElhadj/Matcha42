import express from "express";
import cors from 'cors';
import os from 'os';

const app = express();
app.use(cors());
app.use(express.json());

const interfaces = os.networkInterfaces();
let ipAddress = '';

Object.keys(interfaces).forEach(ifname => {
  interfaces[ifname].forEach(iface => {
    if (iface.family === 'IPv4' && !iface.internal) {
      ipAddress = iface.address;
    }
  });
});

const routes = [];

function registerRoute(method, path, description, handler) {
    routes.push({ method, path, description });
    return handler;
}

app.get('/', (req, res) => {
    res.send(`
        <h1>Bienvenue sur le serveur backend de Matcha !</h1>
        <h2>Routes disponibles :</h2>
        <ul>----- Check tmp -----<br></ul>
        <ul>
            ${routes
                .map(
                    (route) =>
                        `<li><strong>${route.method}:</strong> ${route.path} - ${route.description}</li>`
                )
                .join('')}
        </ul>
    `);
});

/* ----- Check tmp ----- */
import tmp from './api/modules/Check/tmp.js';
app.use('/check', registerRoute('GET', '/check', 'Vérifier le fichier temporaire<br><br>----- Login -----<br><br>', tmp));


/* ----- Login ----- */
import register from './api/modules/Login/register.js';
app.use('/auth', registerRoute('POST', '/auth/register', 'Inscription', register));
import login from './api/modules/Login/login.js';
app.use('/auth', registerRoute('POST', '/auth/login', 'Connexion', login));
import posts from './api/modules/Login/login.js';
app.use('/auth', registerRoute('POST', '/auth/posts', 'Poster', posts));
import token from './api/modules/Login/token.js';
app.use('/auth', registerRoute('POST', '/auth/token', 'Obtenir un token', token));
import forget from './api/modules/Login/forget.js';
app.use('/auth', registerRoute('POST', '/auth/forget', 'Mot de passe oublié', forget));
import newPassword from './api/modules/Login/newPassword.js';
app.use('/auth', registerRoute('POST', '/auth/newPassword', 'Réinitialisation du mot de passe', newPassword));
import loc from './api/modules/Login/loc.js';
app.use('/auth', registerRoute('POST', '/auth/loc', 'Localisation', loc));
import logout from './api/modules/Login/logout.js';
app.use('/auth', registerRoute('POST', '/auth/logout', 'Déconnexion<br><br>----- Profile -----<br><br>', logout));

/* ----- Profile ----- */
import data from './api/modules/Profile/data.js';
app.use('/profile', registerRoute('GET', '/profile/data', 'Récupérer les données du profil', data));
import imageData from './api/modules/Profile/imageData.js';
app.use('/profile', registerRoute('GET', '/profile/imageData', 'Récupérer les données d\'image', imageData));
import images from './api/modules/Profile/images.js';
app.use('/profile', registerRoute('GET', '/profile/images', 'Récupérer les images', images));
import completed from './api/modules/Profile/completed.js';
app.use('/profile', registerRoute('GET', '/profile/completed', 'Récupérer l\'état d\'achèvement<br><br>----- Complete -----<br><br>', completed));

/* ----- Complete ----- */
import complete from './api/modules/Complete/complete.js';
app.use('/comp', registerRoute('POST', '/comp/complete', 'Compléter', complete));
import pic from './api/modules/Complete/pic.js';
app.use('/comp', registerRoute('POST', '/comp/pic', 'Uploader une image<br><br>----- Setting -----<br><br>', pic));

/* ----- Setting ----- */
import info from './api/modules/Setting/info.js';
app.use('/set', registerRoute('POST', '/set/info', 'Mettre à jour les informations', info));
import email from './api/modules/Setting/email.js';
app.use('/set', registerRoute('POST', '/set/email', 'Mettre à jour l\'email', email));
import password from './api/modules/Setting/password.js';
app.use('/set', registerRoute('POST', '/set/password', 'Mettre à jour le mot de passe', password));
import location from './api/modules/Setting/location.js';
app.use('/set', registerRoute('POST', '/set/location', 'Mettre à jour la localisation<br><br>----- Match/Like -----<br><br>', location));

/* ----- Match/Like ----- */
import users from './api/modules/Match/users.js';
app.use('/match', registerRoute('GET', '/match/users', 'Récupérer les utilisateurs', users));
import matchWith from './api/modules/Match/matchWith.js';
app.use('/match', registerRoute('POST', '/match/matchWith', 'Matcher avec', matchWith));
import user from './api/modules/Match/user.js';
app.use('/match', registerRoute('GET', '/match/user', 'Récupérer un utilisateur', user));
import friends from './api/modules/Match/friends.js';
app.use('/match', registerRoute('GET', '/match/friends', 'Récupérer les amis', friends));
import block from './api/modules/Match/block.js';
app.use('/match', registerRoute('POST', '/match/block', 'Bloquer un utilisateur', block));
import blocked from './api/modules/Match/blocked.js';
app.use('/match', registerRoute('GET', '/match/blocked', 'Récupérer les utilisateurs bloqués', blocked));
import unblock from './api/modules/Match/unblock.js';
app.use('/match', registerRoute('POST', '/match/unblock', 'Débloquer un utilisateur', unblock));
import report from './api/modules/Match/report.js';
app.use('/match', registerRoute('POST', '/match/report', 'Signaler un utilisateur', report));
import like from './api/modules/Match/like.js';
app.use('/match', registerRoute('POST', '/match/like', 'Liker un utilisateur', like));
import unlike from './api/modules/Match/unlike.js';
app.use('/match', registerRoute('POST', '/match/unlike', 'Ne plus aimer un utilisateur<br><br>----- Notif -----<br><br>', unlike));

/* ----- Notif ----- */
import notif from './api/modules/Notif/notif.js';
app.use('/notif', registerRoute('GET', '/notif/notif', 'Récupérer les notifications', notif));
import num from './api/modules/Notif/num.js';
app.use('/notif', registerRoute('GET', '/notif/num', 'Récupérer le nombre de notifications', num));
import dataNotif from './api/modules/Notif/dataNotif.js';
app.use('/notif', registerRoute('GET', '/notif/dataNotif', 'Récupérer les données de notification<br><br>----- Chat -----<br><br>', dataNotif));

/* ----- Chat ----- */
import sendmsg from './api/modules/Chat/sendmsg.js';
app.use('/chat', registerRoute('POST', '/chat/sendmsg', 'Envoyer un message', sendmsg));
import datamsg from './api/modules/Chat/datamsg.js';
app.use('/chat', registerRoute('GET', '/chat/datamsg', 'Récupérer les messages', datamsg));
import getimage from './api/modules/Chat/getimage.js';
app.use('/chat', registerRoute('GET', '/chat/getimage', 'Obtenir une image<br><br>----- History -----<br><br>', getimage));

/* ----- History ----- */
import vu from './api/modules/History/vu.js';
app.use('/history', registerRoute('GET', '/history/vu', 'Voir l\'historique', vu));
import historyData from './api/modules/History/historyData.js';
app.use('/history', registerRoute('GET', '/history/historyData', 'Récupérer les données d\'historique', historyData));
import likeHistory from './api/modules/History/likeHistory.js';
app.use('/history', registerRoute('GET', '/history/likeHistory', 'Récupérer l\'historique des likes<br><br>-----------------------------------------------<br><br><br><br>', likeHistory));


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`\n\nServer Backend Matcha:`);
  console.log(`\n-----> Operating locally at the port ${PORT}\n-----> Networked at IP ${ipAddress} at the port ${PORT}\n`);
  console.log(`- Local:   \x1b[32mhttp://localhost:${PORT}\x1b[0m`);
});
app.listen(3001, ipAddress, () => {
  console.log(`- Network: \x1b[32mhttp://${ipAddress}:${3001}\x1b[0m\n\n`);
  });