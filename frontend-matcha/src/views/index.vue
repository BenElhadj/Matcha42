<template>
  <v-app>
    <NavbarApp />
    <!-- <Background /> -->
    <FooterApp />
  </v-app>
</template>

<script>
import { onMounted } from "vue";
import NavbarApp from "@/components/website/NavbarApp";
import FooterApp from "@/components/website/FooterApp";
// import Background from "@/components/website/Background";
import { getProfileCompletion } from "@/api";
import { useStore } from "vuex";

export default {
  name: "IndexView",
  created() {
    console.log("Je suis dans le composant @/views/index.vue");
  },
  components: { NavbarApp, FooterApp/*, Background*/ },
  setup() {
    const store = useStore();

    onMounted(async () => {
      const token = store.state.token;

      if (token) {
        try {
          const response = await getProfileCompletion(token);

          if (response.completed) {
            this.$router.push("/profile");
          } else {
            this.$router.push("/");
          }
        } catch (error) {
          console.error("Error in getProfileCompletion:", error);
        }
      } else {
        this.$router.push("/");
      }
    });

    return {};
  },
};
</script>
