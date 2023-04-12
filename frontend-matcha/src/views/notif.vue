<template>
  <v-row style="margin: 1vh">
    <NotifApp />
  </v-row>
</template>

<script>
import NotifApp from "@/components/app/notif/notifApp.vue";
import { getProfileCompletion } from "@/api";
import { useStore } from "vuex";
import { onMounted } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "NotifView",
  created() {
    console.log("Je suis dans le composant @/views/notif.vue");
  },
  layout: "app",
  components: { NotifApp },
  setup() {
    const store = useStore();
    const router = useRouter();

    onMounted(async () => {
      const token = store.state.token;
      try {
        const response = await getProfileCompletion(token);
        if (response.completed == 1) {
          router.push("/notif");
        } else if (response.completed == 0) {
          router.push("/completeProfile");
        }
      } catch (error) {
        console.error("Error in mounted lifecycle hook:", error);
      }
    });

    return {};
  },
};
</script>
