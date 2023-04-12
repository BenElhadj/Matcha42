<template>
<v-col>
  <v-row>
    <v-col>
        <v-row align="center" justify="center">
          <v-avatar size="250" class="pink darken-3 mt-6" align="center" justify="center">
            <img :src="Pic" />
          </v-avatar>
        </v-row>
        <v-row class="mt-10 mb-3" align="center" justify="center">
            <div class="text-center">
                <v-rating readonly background-color="black" color="primary" v-model="rating"></v-rating>
            </div>
        </v-row>
        <v-row align="center" justify="center">
            <span> {{ Bio }} </span>
        </v-row>
    </v-col>
  </v-row>
  <v-row>
        <v-col class="mt-1" cols="12" xs="12" sm="12" md="4" lg="4" xl="4">
            <v-card class="mx-10 my-5" color="accent">
                <v-card-title>
                    <v-icon color="primary" class="mr-5">account-child</v-icon>
                    First Name: {{FirstName}}
                </v-card-title>
            </v-card>
        </v-col>
        <v-col class="mt-1" cols="12" xs="12" sm="12" md="4" lg="4" xl="4">
            <v-card class="mx-10 my-5" color="accent">
                <v-card-title>
                    <v-icon color="primary" class="mr-5">account-child-circle</v-icon>
                    Last Name: {{LastName}}
                </v-card-title>
            </v-card>
        </v-col>
        <v-col class="mt-1" cols="12" xs="12" sm="12" md="4" lg="4" xl="4">
            <v-card class="mx-10 my-5" color="accent">
                
                <v-card-title>
                    <v-icon color="primary" class="mr-5">account-convert</v-icon>
                    Username: {{Username}}
                </v-card-title>
            </v-card>
        </v-col>
  </v-row>
  <v-row>
        <v-col class="mt-1" cols="12" xs="12" sm="12" md="4" lg="4" xl="4">
            <v-card class="mx-10 my-5" color="accent">
                <v-card-title>
                    <v-icon color="primary" class="mr-5">cake-variant</v-icon>
                    Birthday: {{Birthday}}
                </v-card-title>
            </v-card>
        </v-col>
        <v-col class="mt-1" cols="12" xs="12" sm="12" md="4" lg="4" xl="4">
            <v-card class="mx-10 my-5" color="accent">
                <v-card-title>
                    <v-icon color="primary" class="mr-5">gender-male-female</v-icon>
                    Gender: {{Gender}}
                </v-card-title>
            </v-card>
        </v-col>
        <v-col class="mt-1" cols="12" xs="12" sm="12" md="4" lg="4" xl="4">
            <v-card class="mx-10 my-5" color="accent">
                <v-card-title>
                    <v-icon color="primary" class="mr-5">gender-transgender</v-icon>
                    Sexual Preferences: {{SexualP}}
                </v-card-title>
            </v-card>
        </v-col>
  </v-row>
  <v-row align="center" justify="center">
      <v-col align="center" justify="center" class="mt-1" cols="12" xs="12" sm="12" md="6" lg="6" xl="6">
        <v-card width="400" class="my-5" color="accent">
            <v-card-title>
                Tags
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text v-for="(tag, i) in Tags" :key="i">
                {{ tag }}
            </v-card-text>
        </v-card>
      </v-col>
        <v-col align="center" justify="center" class="mt-1" cols="12" xs="12" sm="12" md="6" lg="6" xl="6">
            <v-row align="center" justify="center">
                <v-card width="400" class="my-5">
                    <Pics />
                </v-card>              
            </v-row>
            <v-row class="my-5" align="center" justify="center">
                <frinds />
            </v-row>
            <v-row class="my-5" align="center" justify="center">
                <blocked />
            </v-row>
        </v-col>
  </v-row>
</v-col>
</template>

<script>
import { getProfileCompletion } from "@/api";
import { ref, onMounted } from "vue";
import Pics from "./pics";
import frinds from "./frinds";
import blocked from "./blocked";

function getToken() {
  // Récupérer le token depuis les cookies
  const cookieToken = document.cookie.split('; ').find(row => row.startsWith('token='));
  if (cookieToken) {
    return cookieToken.split('=')[1];
  }
  // Récupérer le token depuis le store (ex: localStorage)
  const storeToken = localStorage.getItem('token');
  if (storeToken) {
    return storeToken;
  }
  // Si aucun token trouvé, retourner null
  return null;
}

function deleteCookiesAndRedirect() {
  // Supprimer tous les cookies
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
  }
  // Supprimer le token du store (ex: localStorage)
  localStorage.removeItem('token');
  // Rediriger vers la page d'accueil
  window.location.href = '/';
}

export default {
  name: "ProfileView",
  created() {
    console.log("Je suis dans le composant @/components/app/profile/profile.vue");
  },
  components: { Pics, frinds, blocked },
  setup() {
    const rating = ref(1);
    const FirstName = ref("");
    const LastName = ref("");
    const Username = ref("");
    const Birthday = ref("");
    const Gender = ref("");
    const SexualP = ref("");
    const Pic = ref("");
    const Bio = ref("");
    const Tags = ref([]);

    onMounted(async () => {
      const token = getToken();
      try {
        const res = await getProfileCompletion(token);
        if (res === "Logout") {
            deleteCookiesAndRedirect();
        }
        FirstName.value = res.data[0].firstName;
        LastName.value = res.data[0].lastName;
        Username.value = res.data[0].username;
        Pic.value = res.data[0].pic;
        Birthday.value = res.info[0].date;
        Gender.value = res.info[0].gender;
        SexualP.value = res.info[0].sexualPref;
        Bio.value = res.info[0].bio;
        rating.value = res.rating[0].fameRating;
        Tags.value = res.tags.map((t) => t.tag);
      } catch (err) {
        console.log(err);
      }
    });
    return {
      rating,
      FirstName,
      LastName,
      Username,
      Birthday,
      Gender,
      SexualP,
      Pic,
      Bio,
      Tags,
    };
  },
};
</script>