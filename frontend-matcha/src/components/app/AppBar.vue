<template>
  <div>
    <v-app-bar app color="accent" flat hide-on-scroll class="hidden-sm-and-down">
        <router-link to="/">
            <v-hover v-slot:default="{ hover }">
                <v-toolbar-title class="logo secondary--text transition-fast-in-fast-out" :style="hover ? 'font-size: 30px;' : null">
                    <v-icon class="pr-2" color="secondary" large>mdi-atom-variant</v-icon>
                    <span class="font-weight-light">MAT</span>
                    <span>CHA</span>
                </v-toolbar-title>
            </v-hover>
        </router-link>
        <v-spacer></v-spacer>
        <router-link to="/notif">
          <v-btn icon style="margin: 0 1vh 0 0" @click="ft_notif">
            <v-badge>
              <template v-slot:badge>{{ notif }}</template>
              <v-icon color="secondary">mdi-bell</v-icon>
            </v-badge>
          </v-btn>
        </router-link>
        <v-hover v-slot:default="{ hover }" v-for="(btn, index) in btns" :key="index">
            <router-link :to="btn.route">
                <v-btn
                    nuxt
                    :color="hover ? 'primary' : 'secondary'"
                    class="uppercase white--text btn roboto-condensed"
                    text
                ><v-icon class="mr-1" color="secondary">{{ btn.iconn }}</v-icon><span color="secondary">{{btn.text}}</span></v-btn>
            </router-link>
        </v-hover>
        <v-hover v-slot:default="{ hover }">
            <v-btn @click="ft_logout"
                :color="hover ? 'secondary' : 'primary'"
                outlined
                tile
                class="uppercase white--text btn ml-4 roboto-condensed"
            >LOG OUT</v-btn>
        </v-hover>
    </v-app-bar>
    <v-app-bar app color="accent" flat hide-on-scroll class="hidden-md-and-up">
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn color="primary" v-on="on">
              <v-icon>mdi-menu</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item v-for="(item, index) in items" :key="index">
              <router-link :to="item.route">
                <v-list-item-title>{{ item.text }}</v-list-item-title>
              </router-link>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>
                <v-btn @click="ft_logout"
                >LOG OUT</v-btn>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
    </v-app-bar>
  </div>
</template>


<script>
import { getProfileCompletion } from "@/api";
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
  name: "AppBar",
  created() {
    console.log("Je suis dans le composant @/components/app/AppBar.vue");
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const notif = ref(0);
    const num = ref(0);

    onMounted(async () => {
      const token = store.state.token;
      if (token) {
        const profileCompletion = await getProfileCompletion(token);
        num.value = profileCompletion.num;
        notif.value = num.value;
      }
    });

    const ft_logout = () => {
      store.commit("setToken", null);
      store.commit("setUID", null);
      router.push("/");
    };

    const ft_notif = () => {
      num.value = 9;
      notif.value = num.value;
    };

    return {
      btns: [
        { text: 'Profile', route: '/profile', iconn: 'mdi-account' },
        { text: 'Chat', route: '/chat', iconn: 'mdi-forum' },
        { text: 'History', route: '/history', iconn: 'mdi-file-document-box-multiple' },
        { text: 'Setting', route: '/setting', iconn: 'mdi-settings' },
      ],
      items: [
        { text: 'Matcha', route: '/matcha' },
        { text: 'Notification', route: '/notif' },
        { text: 'Profile', route: '/profile' },
        { text: 'Chat', route: '/chat' },
        { text: 'History', route: '/history' },
        { text: 'Setting', route: '/setting' },
      ],
      notif,
      ft_logout,
      ft_notif,
    };
  },
};
</script>

<style scoped>
.logo {
  font-weight: bold;
  font-size: 25px;
  letter-spacing: 0.02em;
  cursor: pointer;
  text-decoration: none;
}
.btn {
  font-weight: bold;
  letter-spacing: 0.05em;
  font-size: 18px !important;
}
a {
  text-decoration: none;
}
</style>