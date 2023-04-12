<template>
  <v-row style="margin: 6vh 1vh 0 1vh">
    <v-col>
      <MatchApp />
    </v-col>
  </v-row>
</template>

<script>
import MatchApp from "@/components/app/match/matchApp.vue";
import { mapActions } from "vuex";
import { getProfileCompletion } from "@/api";

export default {
  name: "MatchView",
  layout: "app",
  components: { MatchApp },
  methods: {
    ...mapActions(["SetToken"]),
  },
  async created() {
    console.log("Je suis dans le composant @/views/match.vue");
    this.SetToken(this.$cookies.get("token"));
    try {
      const token = this.$cookies.get("token");
      const data = await getProfileCompletion(token);
      if (data.completed === 1) this.$router.push("/matcha");
      else if (data.completed === 0) this.$router.push("/completeProfile");
    } catch (err) {
      console.log(err);
    }
  },
};
</script>
