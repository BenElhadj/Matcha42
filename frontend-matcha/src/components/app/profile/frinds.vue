<template>
  <v-dialog max-width="550px" v-model="dialog1">
    <div class="text-center">
      <v-snackbar v-model="snackbar" :timeout="timeout">
        {{ text }}
        <v-btn color="primary" text @click="snackbar = false">Close</v-btn>
      </v-snackbar>
    </div>
    <template v-slot:activator="{ on }">
      <v-btn width="400" color="primary" v-on="on">Friends</v-btn>
    </template>
    <v-card>
      <v-card-title class="pb-2">
        <v-toolbar-title>Friends</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon depressed v-on:click="dialog1 = !dialog1">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-row v-for="item in itemss" :key="item.id" class="mx-3">
        <v-col>
          <v-avatar size="75">
            <v-img :src="item.pic"></v-img>
          </v-avatar>
        </v-col>
        <v-col>
          <v-card-text class="mt-3">
            <span>{{ item.username }}</span>
          </v-card-text>
        </v-col>
        <v-col>
          <v-card-text class="mt-2">
            <v-chip>
              <span>{{ item.conn }}</span>
            </v-chip>
          </v-card-text>
        </v-col>
        <v-col>
          <v-btn
            @click="() => ft_unlike(item.id)"
            color="primary"
            width="90%"
            style="margin: 1vh 0"
            class="mt-5"
          >
            Unlike
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from 'vue-router';
import { unlikeUser, getFriends } from '@/api';

export default {
  name: "FriendsView",
  
  created() {
    console.log("Je suis dans le composant @/components/app/profile/frinds.vue");
  },

  setup() {
    const router = useRouter();
    const itemss = ref([]);
    const dialog1 = ref(false);
    const snackbar = ref(false);
    const timeout = ref(8000);
    const text = ref("");

    const ft_unlike = async (id) => {
      snackbar.value = true;
      text.value = "User Unliked Successfully";
      await unlike(id);
    };

    const unlike = async (id) => {
      try {
        const token = router.currentRoute.value.query.token;
        await unlikeUser(token, id);
      } catch (error) {
        console.error('Error in unlike:', error);
      }
    };

    const fetchFriends = async () => {
      try {
        const token = router.currentRoute.value.query.token;
        const friendsData = await getFriends(token);
        itemss.value = friendsData; // Affectez les données récupérées à itemss
      } catch (error) {
        console.error('Error in fetchFriends:', error);
      }
    };

    // Utilisation de onMounted pour appeler fetchFriends
    onMounted(async () => {
      await fetchFriends();
    });

    return {
      itemss,
      dialog1,
      snackbar,
      timeout,
      text,
      ft_unlike,
    };
  },
};
</script>
