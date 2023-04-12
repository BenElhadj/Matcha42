<template>
  <v-card>
    <div class="text-center">
      <v-snackbar v-model="snackbar" :timeout="timeout">
        {{ text }}
        <v-btn color="primary" text @click="snackbar = false">Close</v-btn>
      </v-snackbar>
    </div>
    <v-row>
      <v-col>
        <v-row align="center" justify="center">
          <v-avatar size="250" class="pink darken-3 mt-6" align="center" justify="center">
            <img :src="UserPic" />
          </v-avatar>
        </v-row>
        <v-row class="mt-1" cols="12" xs="4" sm="4" md="4" lg="4" xl="4">
          <v-col align="center" justify="center">
            <v-chip color="info">
              <v-icon color="primary">mdi-account-child</v-icon>
              <span>{{ UserFirstName }}</span>
            </v-chip>
          </v-col>
          <v-col align="center" justify="center">
            <v-chip color="info">
              <v-icon color="primary">mdi-account-child-circle</v-icon>
              <span>{{ UserLastName }}</span>
            </v-chip>
          </v-col>
          <v-col align="center" justify="center">
            <v-chip color="info">
              <v-icon color="primary">mdi-account-convert</v-icon>
              <span>{{ UserUsername }}</span>
            </v-chip>
          </v-col>
        </v-row>
        <v-row align="center" justify="center" class="mb-2">
          <v-chip>
            <span>{{ UserBio }}</span>
          </v-chip>
        </v-row>
        <v-row align="center" justify="center">
          <v-chip color="info">
            <span>{{ Conn }}</span>
          </v-chip>
        </v-row>
        <v-row class="mt-10 mb-3" align="center" justify="center">
          <div class="text-center">
            <v-rating readonly background-color="black" color="primary" v-model="UserRating"></v-rating>
          </div>
        </v-row>
        <v-row class="mt-1" cols="12" xs="6" sm="6" md="6" lg="6" xl="6">
          <v-col align="center" justify="center">
            <v-btn width="50%" @click="ft_block">Block</v-btn>
          </v-col>
          <v-col align="center" justify="center">
            <v-btn width="50%" @click.stop="dialog_report = true">Report</v-btn>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row class="mt-1 mx-2">
          <v-col align="center" justify="center" cols="12" xs="4" sm="4" md="4" lg="4" xl="4">
            <v-card>
              <v-card-title>
                <span>Gender</span>
              </v-card-title>
              <v-card-title>{{ UserGender }}</v-card-title>
            </v-card>
          </v-col>
          <v-col align="center" justify="center" cols="12" xs="4" sm="4" md="4" lg="4" xl="4">
            <v-card>
              <v-card-title>
                <span>Birthday</span>
              </v-card-title>
              <v-card-title>{{ UserBirthday }}</v-card-title>
            </v-card>
          </v-col>
          <v-col align="center" justify="center" cols="12" xs="4" sm="4" md="4" lg="4" xl="4">
            <v-card>
              <v-card-title>
                <span>Address</span>
              </v-card-title>
              <v-card-title>{{ UserAdresse }}</v-card-title>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-carousel cycle height="300" :show-arrows="false" :hide-delimiters="true">
            <v-carousel-item v-for="(image, i) in UserImg" :key="i">
              <v-img :src="UserImg[i]" height="100%"></v-img>
            </v-carousel-item>
          </v-carousel>
        </v-row>

        <v-row>
          <v-card width="100%">
            <v-card-text align="center">
              <span class="headline">{{ liked }}</span>
            </v-card-text>
          </v-card>
        </v-row>
      </v-col>
    </v-row>
    <v-dialog max-width="750px" v-model="dialog_report">
      <div class="text-center">
        <v-snackbar v-model="snackbar" :timeout="timeout">
          {{ text }}
          <v-btn color="primary" text @click="snackbar = false">Close</v-btn>
        </v-snackbar>
      </div>
      <v-card>
        <v-card-title class="pb-2">
          <v-toolbar-title>Why you wanna report this person?</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon depressed activator v-on:click="dialog_report = !dialog_report">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pt-2">
          <v-form v-model="reas">
            <v-textarea v-model="Reason" label="Reason" :rules="ReasonRules" outlined></v-textarea>
            <v-btn @click="ft_report" width="100%" color="primary" :disabled="!reas">Report</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { ref, watch } from 'vue';
import { getProfileCompletion, reportUser, blockUser } from '@/api';

export default {
  name: 'UserProfile',
  created() {
    console.log("Je suis dans le composant @/components/app/match/user.vue");
  },
  props: {
    contextId: Number,
  },
  setup(props) {
    const liked = ref("");
    const id = ref(0);
    const snackbar = ref(false);
    const timeout = ref(8000);
    const status = ref("login");
    const text = ref("");
    const dialog_user = ref(false);
    const UserRating = ref(3);
    const UserFirstName = ref("");
    const UserLastName = ref("");
    const UserUsername = ref("");
    const UserBirthday = ref("");
    const UserGender = ref("");
    const UserSexualP = ref("");
    const UserPic = ref("");
    const UserBio = ref("");
    const UserAdresse = ref("");
    const UserDistance = ref("");
    const Conn = ref("");
    const UserImg = ref([
        "https://images.unsplash.com/photo-1513344756488-b273726a3da6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80",
        "https://images.unsplash.com/photo-1560790171-17a7cd9f55d2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80",
        "https://images.unsplash.com/photo-1515353719550-cf04906a258c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80",
        "https://images.unsplash.com/photo-1489189642444-0709966aec44?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80"
    ]);
    const dialog_report = ref(false);
    const Reason = ref("");
    const ReasonRules = [
      (v) => !!v || "Reason is required",
      (v) => (v && v.length >= 5) || "Bio must be more than 5 characters",
      (v) => (v && v.length <= 50) || "Bio must be less than 50 characters",
    ];
    const reas = ref(true);

    watch(
      () => props.contextId,
      async (newId) => {
        if (newId == id.value) return;
        id.value = newId;
        await ft_user(newId);
      }
    );

    async function ft_user(id) {
      await getProfileCompletion(id);
      // Update data with the response
    }

    async function ft_block() {
      const respons = await blockUser(/* Parameters needed for blockUser */);
      snackbar.value = true;
      text.value = respons.msg;
    }

    async function ft_report() {
      const respons = await reportUser(/* Parameters needed for reportUser */);
      snackbar.value = true;
      text.value = respons.msg;
    }

    return {
      liked,
      id,
      snackbar,
      timeout,
      status,
      text,
      dialog_user,
      UserRating,
      UserFirstName,
      UserLastName,
      UserUsername,
      UserBirthday,
      UserGender,
      UserSexualP,
      UserPic,
      UserBio,
      UserAdresse,
      UserDistance,
      Conn,
      UserImg,
      dialog_report,
      Reason,
      ReasonRules,
      reas,
      ft_user,
      ft_block,
      ft_report,
    };
  },
};
</script>
