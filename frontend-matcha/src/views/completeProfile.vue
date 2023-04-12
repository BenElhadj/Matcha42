<template>
  <v-row style="margin: 6vh 1vh 0 1vh">
    <UserInfoApp />
  </v-row>
</template>

<script>
import { onMounted, ref } from 'vue';
import UserInfoApp from '@/components/app/completeProfile/userInfoApp.vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { getProfileCompletion } from '@/api.js';

export default {
  name: 'completeProfile',
  created() {
    console.log("Je suis dans le composant @/views/completeProfile.vue");
  },
  components: {
    UserInfoApp,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const token = ref('');

    const setToken = async (tokenValue) => {
      store.dispatch('SetToken', tokenValue);
    };

    onMounted(async () => {
      token.value = store.state.token;

      try {
        const profileCompletionData = await getProfileCompletion(token.value);

        if (profileCompletionData.completed === 1) {
          router.push('/profile');
        } else if (profileCompletionData.completed === 0) {
          router.push('/completeProfile');
        }
      } catch (error) {
        console.log(error);
      }
    });

    return {
      setToken,
    };
  },
};
</script>