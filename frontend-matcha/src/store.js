import { createStore } from 'vuex';
import api from '@/api';

export default createStore({
  state: {
    uid: null,
    token: null,
  },
  mutations: {
    setUID(state, uid) {
      state.uid = uid;
    },
    setToken(state, token) {
      state.token = token;
    },
  },
  actions: {
    async SetToken({ commit }, token) {
      commit('setToken', token);
      try {
        const response = await api.post('/auth/token', { token });
        commit('setUID', response.data.uid);
      } catch (error) {
        console.error('Error in SetToken action:', error);
      }
    },
  },
  modules: {},
});