<template>
  <v-row style="margin: 1vh">
    <HistoryApp />
  </v-row>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import HistoryApp from '@/components/app/history/history';
import { getProfileCompletion } from '@/api';

export default {
  name: "HistoryView",
  created() {
    console.log("Je suis dans le composant @/views/history.vue");
  },
  layout: "app",
  components: { HistoryApp },
  setup() {
    const router = useRouter();
    // const route = useRoute();
    const store = useStore();
    const token = ref('');

    const fetchProfileCompletion = async () => {
      try {
        const data = await getProfileCompletion(token.value);
        if (data.completed === 1) {
          router.push("/history");
        } else if (data.completed === 0) {
          router.push("/completeProfile");
        }
      } catch (error) {
        console.error("Error in fetchProfileCompletion:", error);
      }
    };

    const init = () => {
      token.value = store.state.token;
      store.dispatch("SetToken", token.value);
      fetchProfileCompletion();
    };

    return { init };
  },
  mounted() {
    this.init();
  },
};
</script>