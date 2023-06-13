import axios from 'axios';
// import { db } from './firebaseConfig';
// import { collection, query, where, getDocs } from 'firebase/firestore';

const api = axios.create({
  baseURL: '',
});

async function startApp() {
  try {
    api.defaults.baseURL = 'http://localhost:3000';
    console.log(`\n\n---------------------> api.defaults.baseURL: ${api.defaults.baseURL}\n\n`);
  } catch (error) {
      const response = await axios.get('https://api.ipify.org?format=json');
      const ipAddress = response.data.ip;
      api.defaults.baseURL = `http://${ipAddress}:3001`;
      console.log(`\n\n---------------------> api.defaults.baseURL: ${api.defaults.baseURL}\n\n`);
  }
}

startApp();

// Check tmp
export async function checkTmp() {
  try {
    const response = await api.get('/check');
    console.log('*******API.JS******* checkTmp response.data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in checkTmp:', error);
    throw error;
  }
}

// Login
export async function registerUser(userData) {
  try {
    const response = await api.post("/auth/register", userData);
    console.log("*******API.JS******* registerUser response.data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in registerUser:", error);
    throw error;
  }
}

export async function loginUser(userData) {
  try {
    const response = await api.post("/auth/login", userData);
    console.log("*******API.JS******* loginUser response.data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in loginUser:", error);
    throw error;
  }
}

export async function createPost(token, postData) {
  try {
    const response = await api.post("/auth/posts", postData, { headers: { Authorization: `Bearer ${token}` } });
    console.log("*******API.JS******* createPost response.data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in createPost:", error);
    throw error;
  }
}

export async function getToken() {
  try {
    const response = await api.post("/auth/token");
    console.log("*******API.JS******* getToken response.data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in getToken:", error);
    throw error;
  }
}

export async function forgetUserPassword(userData) {
  try {
    const response = await api.post("/auth/forget", userData);
    console.log("*******API.JS******* forgetUserPassword response.data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in forgetUserPassword:", error);
    throw error;
  }
}

export async function resetPassword(userData) {
  try {
    const response = await api.post("/auth/newPassword", userData);
    console.log("*******API.JS******* resetPassword response.data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in resetPassword:", error);
    throw error;
  }
}

export async function createLocation(userData) {
  try {
    const response = await api.post("/auth/loc", userData);
    console.log("*******API.JS******* create location response.data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in create location:", error);
    throw error;
  }
}

export async function logoutUser(userData) {
  try {
    const response = await api.post("/auth/logout", userData);
    console.log("*******API.JS******* logoutUser response.data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in logoutUser:", error);
    throw error;
  }
}

// Profile
export async function getProfileData(token) {
  try {
    const response = await api.get("/profile/data", { headers: { Authorization: `Bearer ${token}` } });
    console.log("*******API.JS******* getProfileData response.data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in getProfileData:", error);
    throw error;
  }
}

export async function getImageData(token) {
  try {
    const response = await api.get("/profile/imageData", { headers: { Authorization: `Bearer ${token}` } });
    console.log("*******API.JS******* getImageData response.data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in getImageData:", error);
    throw error;
  }
}

export async function getImages(token) {
  try {
    const response = await api.get("/profile/images", { headers: { Authorization: `Bearer ${token}` } });
    console.log("*******API.JS******* getImages response.data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in getImages:", error);
    throw error;
  }
}

export async function getProfileCompletion(token) {
  try {
    const response = await api.get("/profile/completed", { headers: { Authorization: `Bearer ${token}` } });
    console.log("*******API.JS******* getProfileCompletion response.data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in getProfileCompletion:", error);
    throw error;
  }
}

// Complete
export async function completeProfile(token, profileData) {
  try {
    const response = await api.post('/comp/complete', { token, profileData });
    console.log('*******API.JS******* completeProfile response.data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in completeProfile:', error);
    throw error;
  }
}

export async function uploadProfilePicture(token, imageFile) {
  try {
    const formData = new FormData();
    formData.append('token', token);
    formData.append('image', imageFile);
    const response = await api.post('/comp/pic', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('*******API.JS******* uploadProfilePicture response.data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in uploadProfilePicture:', error);
    throw error;
  }
}

// Setting
export async function updateProfileInfo(token, profileInfo) {
  try {
    const response = await api.post('/set/info', { token, profileInfo });
    console.log('*******API.JS******* updateProfileInfo response.data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in updateProfileInfo:', error);
    throw error;
  }
}

export async function updateEmail(token, emailData) {
  try {
    const response = await api.post('/set/email', { token, emailData });
    console.log('*******API.JS******* updateEmail response.data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in updateEmail:', error);
    throw error;
  }
}

export async function updatePassword(token, passwordData) {
  try {
    const response = await api.post('/set/password', { token, passwordData });
    console.log('*******API.JS******* updatePassword response.data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in updatePassword:', error);
    throw error;
  }
}

export async function updateLocation(token, locationData) {
  try {
    const response = await api.post('/set/location', { token, locationData });
    console.log('*******API.JS******* updateLocation response.data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in updateLocation:', error);
    throw error;
  }
}

// Match/Like
export async function getUsersForMatching(token) {
  try {
    const response = await api.get('/match/users', { headers: { Authorization: `Bearer ${token}` } });
    console.log('*******API.JS******* getUsersForMatching response.data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in getUsersForMatching:', error);
    throw error;
  }
}

export async function matchWith(token, filters) {
  try {
    const response = await api.post("/match/matchWith", { token, filters });
    console.log("*******API.JS******* matchWith response.data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in matchWith:", error);
    throw error;
  }
}

export async function getUserDetails(token, userId) {
  try {
    const response = await api.get(`/match/user/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
    console.log('*******API.JS******* getUserDetails response.data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in getUserDetails:', error);
    throw error;
  }
}

export async function getFriends(token) {
  try {
    const response = await api.get('/match/friends', { headers: { Authorization: `Bearer ${token}` } });
    console.log('*******API.JS******* getFriends response.data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in getFriends:', error);
    throw error;
  }
}

export async function blockUser(token, userId) {
  try {
    const response = await api.post('/match/block', { token, userId });
    console.log('*******API.JS******* blockUser response.data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in blockUser:', error);
    throw error;
  }
}

export async function getBlockedUsers(token) {
  try {
    const response = await api.get('/match/blocked', { headers: { Authorization: `Bearer ${token}` } });
    console.log('*******API.JS******* getBlockedUsers response.data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in getBlockedUsers:', error);
    throw error;
  }
}

export async function unblockUser(token, userId) {
  try {
    const response = await api.post('/match/unblock', { token, userId });
    console.log('*******API.JS******* unblockUser response.data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in unblockUser:', error);
    throw error;
  }
}

export async function reportUser(token, userId, reason) {
  try {
    const response = await api.post('/match/report', { token, userId, reason });
    console.log('*******API.JS******* reportUser response.data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in reportUser:', error);
    throw error;
  }
}

export async function likeUser(token, userId) {
  try {
    const response = await api.post('/match/like', { token, userId });
    console.log('*******API.JS******* likeUser response.data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in likeUser:', error);
    throw error;
  }
}

export async function unlikeUser(token, userId) {
  try {
    const response = await api.post('/match/unlike', { token, userId });
    console.log('*******API.JS******* unlikeUser response.data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in unlikeUser:', error);
    throw error;
  }
}

// Notif
export async function getNotifications(token) {
  try {
    const response = await api.get('/notif/notif', { headers: { Authorization: `Bearer ${token}` } });
    console.log('*******API.JS******* getNotifications response.data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in getNotifications:', error);
    throw error;
  }
}

export async function getNumNotifications(token) {
  try {
    const response = await api.get('/notif/num', { headers: { Authorization: `Bearer ${token}` } });
    console.log('*******API.JS******* getNumNotifications response.data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in getNumNotifications:', error);
    throw error;
  }
}

export async function getNotificationData(token, notificationId) {
  try {
    const response = await api.get(`/notif/dataNotif/${notificationId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('*******API.JS******* getNotificationData response.data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in getNotificationData:', error);
    throw error;
  }
}

// Chat
export async function sendMessage(token, messageData) {
  try {
    const response = await api.post('/chat/sendmsg', { token, messageData });
    console.log('*******API.JS******* sendMessage response.data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in sendMessage:', error);
    throw error;
  }
}

export async function getMessages(token) {
  try {
    const response = await api.get('/chat/datamsg', { headers: { Authorization: `Bearer ${token}` } });
    console.log('*******API.JS******* getMessages response.data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in getMessages:', error);
    throw error;
  }
}

export async function getImage(token, imageName) {
  try {
    const response = await api.get(`/chat/getimage/${imageName}`, { headers: { Authorization: `Bearer ${token}` } });
    console.log('*******API.JS******* getImage response.data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in getImage:', error);
    throw error;
  }
}

// History
export async function getViewHistory(token) {
  try {
    const response = await api.get('/history/vu', { headers: { Authorization: `Bearer ${token}` } });
    console.log('*******API.JS******* getViewHistory response.data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in getViewHistory:', error);
    throw error;
  }
}

export async function getHistoryData(token) {
  try {
    const response = await api.get('/history/historyData', {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('*******API.JS******* getHistoryData response.data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in getHistoryData:', error);
    throw error;
  }
}

export async function getLikeHistory(token) {
  try {
    const response = await api.get('/history/likeHistory', { headers: { Authorization: `Bearer ${token}` } });
    console.log('*******API.JS******* getLikeHistory response.data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in getLikeHistory:', error);
    throw error;
  }
}

export default api;
