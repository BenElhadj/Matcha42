<template>
  <div>
    <NavbarApp />
    <div class="text-center">
      <v-snackbar v-model:active="snackbar" :timeout="timeout">
        {{ text }}
        <v-btn color="blue" text @click="snackbar = false">
          Close
        </v-btn>
      </v-snackbar>
    </div>
    <!-- <Background /> -->
    <FooterApp />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import NavbarApp from '@/components/website/NavbarApp.vue';
import FooterApp from '@/components/website/FooterApp.vue';
// import Background from '@/components/website/Background.vue';
import api from '@/api.js';

export default {
  name: "TokenComponent",
  created() {
    console.log("Je suis dans le composant @/views/token.vue");
  },
  components: { NavbarApp, FooterApp/*, Background*/ },
  setup() {
    const router = useRouter();
    const snackbar = ref(false);
    const text = ref('');
    const timeout = ref(8000);

    onMounted(async () => {
      const token = router.currentRoute.value.query.token;
      if (token) {
        try {
          const obj = { token: `${token}` };
          const res = await api.post('/auth/token', obj);
          const firebaseToken = res.data.token;

          const auth = getAuth();
          await signInWithCustomToken(auth, firebaseToken);
          router.push('/completeProfile');
        } catch (error) {
          console.error(error);
          snackbar.value = true;
          text.value = 'Erreur lors de la connexion avec Firebase';
        }
      } else {
        router.push('/');
      }
    });

    return {
      snackbar,
      text,
      timeout,
    };
  },
};
</script>
