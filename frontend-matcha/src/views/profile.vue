<template>
  <v-row>
    <profile />
  </v-row>
</template>

<script>
import profile from "@/components/app/profile/profile";
import { getProfileCompletion } from "@/api";
import { useStore } from "vuex";
import { onBeforeMount, onMounted, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";

export default {
  name: 'ProfileView',
  created() {
    console.log("Je suis dans le composant @/views/profile.vue");
  },
  layout: "app",
  components: { profile },
  setup() {
    const store = useStore();
    const router = useRouter();
    const instance = getCurrentInstance();

    const setToken = (token) => {
      store.dispatch("SetToken", token);
    };

    onBeforeMount(() => {
      setToken(instance.proxy.$cookies.get("token"));
    });

    onMounted(async () => {
      const token = instance.proxy.$cookies.get("token");

      try {
        const profileCompletion = await getProfileCompletion(token);

        if (profileCompletion.completed) {
          router.push("/profile");
        } else {
          router.push("/completeProfile");
        }
      } catch (error) {
        console.error("Error in getProfileCompletion:", error);
        instance.proxy.$cookies.removeAll();
        router.push("/");
      }
    });
  },
};
</script>