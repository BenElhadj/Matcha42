<template>
  <v-row style="margin: 6vh 1vh 0 1vh">
    <v-col>
      <ChatApp />
    </v-col>
  </v-row>
</template>

<script>
import { ref, onMounted } from 'vue';
import ChatApp from '@/components/app/chat/chatApp.vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { getProfileCompletion } from '@/api';

export default {
  name: "ChatView",
  created() {
    console.log("Je suis dans le composant @/views/chat.vue");
  },
  layout: "app",
  components: { ChatApp },
  setup() {
    const store = useStore();
    const router = useRouter();
    const token = ref('');

    const setToken = async (token) => {
      store.dispatch('SetToken', token);
    };

    onMounted(async () => {
      token.value = store.state.token || '';
      if (!token.value) {
        token.value = this.$cookies.get("token");
        setToken(token.value);
      }
      
      try {
        const res = await getProfileCompletion(token.value);
        if (res.completed === 1) {
          router.push("/chat");
        } else if (res.completed === 0) {
          router.push("/completeProfile");
        }
      } catch (err) {
        console.log(err);
      }
    });

    return {};
  },
}
</script>
