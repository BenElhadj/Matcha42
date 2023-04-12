import axios from 'axios';
import { db } from './firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

const api = axios.create({
  baseURL: '',
});

async function startApp() {
  try {
    const response = await axios.get('https://api.ipify.org?format=json');
    const ipAddress = response.data.ip;
    api.defaults.baseURL = `http://${ipAddress}:3001`;
    console.log(`\n\n---------------------> api.defaults.baseURL: ${api.defaults.baseURL}\n\n`);
  } catch (error) {
    api.defaults.baseURL = 'http://localhost:3000';
    console.log(`\n\n---------------------> api.defaults.baseURL: ${api.defaults.baseURL}\n\n`);
  }
}

startApp();

export async function registerUser(userData) {
  try {
    const response = await api.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    console.error("Error in registerUser:", error);
    throw error;
  }
}

export async function loginUser(userData) {
  try {
    const response = await api.post("/auth/login", userData);
    return response.data;
  } catch (error) {
    console.error("Error in loginUser:", error);
    throw error;
  }
}

export async function forgetUserPassword(userData) {
  try {
    const response = await api.post("/auth/forget", userData);
    return response.data;
  } catch (error) {
    console.error("Error in forgetUserPassword:", error);
    throw error;
  }
}

export async function getProfileCompletion(token) {
  try {
    const profileCompletionRef = collection(db, 'profileCompletion');
    const q = query(profileCompletionRef, where('token', '==', token));
    const querySnapshot = await getDocs(q);
    let data = {};
    querySnapshot.forEach((doc) => {
      data = { ...doc.data() };
    });
    return data;
  } catch (error) {
    console.error('Error in getProfileCompletion:', error);
    throw error;
  }
}

export async function getFriends(token) {
  try {
    const response = await api.get('/match/friends', { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
  } catch (error) {
    console.error('Error in getFriends:', error);
    throw error;
  }
}

export async function unblockUser(token, userId) {
  try {
    const response = await api.post('/match/unblock', { token, userId });
    return response.data;
  } catch (error) {
    console.error('Error in unblockUser:', error);
    throw error;
  }
}

export async function getBlockedUsers(token) {
  try {
    const response = await api.get('/match/blocked', { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
  } catch (error) {
    console.error('Error in getBlockedUsers:', error);
    throw error;
  }
}

export async function getNotifications(token) {
  try {
    const response = await api.get('/notif/notif', { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
  } catch (error) {
    console.error('Error in getNotifications:', error);
    throw error;
  }
}

export async function reportUser(token, userId, reason) {
  try {
    const response = await api.post('/match/report', { token, userId, reason });
    return response.data;
  } catch (error) {
    console.error('Error in reportUser:', error);
    throw error;
  }
}

export async function matchWith(token, filters) {
  try {
    const response = await api.post('/match/matchWith', { token, filters });
    return response.data;
  } catch (error) {
    console.error('Error in matchWith:', error);
    throw error;
  }
}

export async function likeUser(token, userId) {
  try {
    const response = await api.post('/match/like', { token, userId });
    return response.data;
  } catch (error) {
    console.error('Error in likeUser:', error);
    throw error;
  }
}

export async function unlikeUser(token, userId) {
  try {
    const response = await api.post('/match/unlike', { token, userId });
    return response.data;
  } catch (error) {
    console.error('Error in unlikeUser:', error);
    throw error;
  }
}

export async function blockUser(token, userId) {
  try {
    const response = await api.post('/match/block', { token, userId });
    return response.data;
  } catch (error) {
    console.error('Error in blockUser:', error);
    throw error;
  }
}

export async function viewUser(token, userId) {
  try {
    const response = await api.get(`/match/user/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
  } catch (error) {
    console.error('Error in viewUser:', error);
    throw error;
  }
}

export async function getHistoryData(token) {
  try {
    const response = await api.get('/history/historyData', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error in getHistoryData:', error);
    throw error;
  }
}

export default api;