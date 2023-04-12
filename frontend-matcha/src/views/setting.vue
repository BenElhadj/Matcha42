<template>
  <v-row style="margin: 6vh 1vh 0 1vh">
    <v-col cols="12" xl="4" lg="4" md="4">
      <PicApp />
    </v-col>
    <v-col cols="12" xl="8" lg="8" md="8">
      <InfoApp />
    </v-col>
  </v-row>
</template>

<script>
import PicApp from "@/components/app/setting/picApp.vue";
import InfoApp from "@/components/app/setting/infoApp.vue";
import api from "@/api";
import { mapActions } from 'vuex';
export default {
  name: "SettingView",
  layout: "app",
  components: { PicApp, InfoApp },
  methods: {
    ...mapActions(['SetToken']),
  },
   created(){
    console.log("Je suis dans le composant @/views/setting.vue");
    this.SetToken(this.$cookies.get("token"))
  },
  async mounted() {
    const tmp = this.$cookies.get('token');
    const obj = {tmp: tmp};
    try {
      const res = await api.post('/profile/completed', obj);
      if (res.data.completed == 1)
        this.$router.push("/setting");
      else if (res.data.completed == 0)
        this.$router.push("/completeProfile");
    } catch (err) {
      console.log(err);
    }
  },
};
</script>
