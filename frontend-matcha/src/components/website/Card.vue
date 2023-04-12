<template>
  <div class="text-center">
    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ text }}
      <v-btn color="blue" text @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getProfileCompletion } from '@/api';

export default {
  name: 'CardView',
  created() {
    console.log("Je suis dans le composant @/components/website/Card.vue");
  },
  setup() {
    const snackbar = ref(false);
    const text = ref('');
    const timeout = ref(8000);

    onMounted(async () => {
      try {
        const token = this.$route.query.token;
        const obj = { token: `${token}` };
        const res = await getProfileCompletion(obj);
        snackbar.value = true;
        text.value = res.data.token;
      } catch (err) {
        console.log(err);
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
