<template>
  <v-row>
    <v-col cols="12" xl="4" lg="4" md="4" v-if="!path">
      <v-form v-model="valid2" ref="form">
        <v-card color="accent">
          <v-row style="margin: 2vh 0 0 0; padding: 1vh">
            <v-file-input
              :rules="FileRules"
              v-model="image"
              accept="image/png, image/jpeg, image/jpg"
              placeholder="Pick an avatar"
              prepend-icon="mdi-camera"
              label="Avatar"
            ></v-file-input>
          </v-row>
          <v-btn
            color="primary"
            @click="awaitPic"
            width="90%"
            style="margin: 0 1vh 1vh 1vh;"
            v-if="v == ``"
            :disabled="!valid2"
          >Save</v-btn>
        </v-card>
      </v-form>
    </v-col>
    <v-col cols="12" xl="4" lg="4" md="4" v-if="path">
      <v-avatar size="250" class="pink darken-3 mt-6" justify="center">
        <img :src="path" />
      </v-avatar>
    </v-col>
    <v-col cols="12" xl="8" lg="8" md="8" v-if="v == `valid`">
      <v-form v-model="valid" ref="form">
        <v-card color="accent">
          <v-row style="margin: 4vh 0 0 0">
            <v-col>
            </v-col>
            <v-col style="margin: 4vh 0 0 0">
              <v-select
                v-model="complete.gender"
                :items="Gender"
                label="Gender"
                outlined
                style="margin: 0 1vh 0 1vh"
                :rules="GenderRules"
              ></v-select>
              <v-select
                v-model="complete.sexualPref"
                :items="Sexual"
                label="Sexual preferences"
                outlined
                style="margin: 0 1vh 0 1vh"
                :rules="SexualRules"
              ></v-select>
            </v-col>
          </v-row>
          <v-row style="margin: 2vh 0 0 0">
            <v-container fluid>
              <v-combobox
                v-model="model"
                :items="items"
                :search-input="search"
                hide-selected
                label="Add some tags"
                multiple
                persistent-hint
                small-chips
                :rules="TagsRules"
              ></v-combobox>
            </v-container>
          </v-row>
          <v-row style="margin: 2vh 0 0 0">
            <v-textarea
              v-model="complete.bio"
              label="Bio"
              outlined
              style="margin: 0 1vh 0 1vh"
              :rules="BioRules"
            ></v-textarea>
          </v-row>
          <v-row style="margin: 2vh 0 0 0" v-if="valid">
            <router-link to="/profile">
              <v-btn
                color="primary"
                @click="completed"
                width="100%"
                style="margin: 0 1vh 1vh 1vh"
                :disabled="!valid"
              >Save</v-btn>
            </router-link>
          </v-row>
        </v-card>
      </v-form>
    </v-col>
  </v-row>
</template>

<script>
import { ref } from "vue";
import { useCookies } from 'vue3-cookies'
import { required } from 'vuelidate/lib/validators';
import api from "@/api";

export default {
  name: "UserInfoApp",

  created() {
    console.log("Je suis dans le composant @/components/app/completeProfile/userInfoApp.vue");
  },

  setup(_, { root }) {
    const v = ref("");
    const form = ref();
    const path = ref("");
    const valid2 = ref(true);
    const valid = ref(false);
    const complete = ref({});
    const Gender = ["Female", "Male"];
    const Sexual = ["Female", "Male", "All"];
    const items = ["PHP", "JavaScript", "C", "Python"];
    const search = ref(null);
    const date = ref("1999-01-01");
    const model = ref([]);
    const location = ref(null);
    const gettingLocation = ref(false);
    const errorStr = ref("");
    // const file = ref(null);
    // const error = ref(false);
    const image = ref(null);
    const { cookies } = useCookies(['token']);

    const GenderRules = [required];
    const SexualRules = [required];
    const TagsRules = [v => v && v.length > 0 || "Tags is required"];
    
    const BioRules = [
      v => !!v || 'Bio is required',
      v => (v && v.length >= 15 && v.length <= 500) || 'Bio should be between 15 and 500 characters',
    ];
    
    const FileRules = [v => !!v || "File is required"];

    const completed = async function() {
      const isValid = await form.value.validate();
      if (isValid) {
        const userId = cookies.get("userId");
        complete.value.userId = userId;

        try {
          await api.registerUser(complete.value)();
          root.$router.push("/comp/complete");
        } catch (err) {
          console.error("Error in completed:", err);
        }
      }
    };


    const compete = async function() {
      const tmp = cookies.get("token");
      complete.value.tags = model.value;
      complete.value.date = date.value;
      complete.value.tmp = tmp;

      try {
        const res = await api.post("/comp/complete", complete.value);
        return { res };
      } catch (err) {
        console.error("Error in compete:", err);
      }
    };

    const awaitPic = async function() {
      await api.pics();
    };

    // const pics = async function() {
    //   const formData = new FormData();
    //   formData.append("file", image.value);
    //   console.log("========================image.value", image.value);
    //   const tmp = cookies.get("token");
    //   console.log("========================tmp", tmp);
    //   const userId = cookies.get("userId");
    //   console.log("========================userId", userId);
    //   formData.append("tmp", tmp);
    //   console.log("========================formData", formData);
    //   formData.append("userId", userId);
    //   console.log("========================formData", formData);

    //   try {
    //     const res = await api.post("/comp/pic", formData, {
    //       headers: {
    //         "Content-Type": "multipart/form-data",
    //       },
    //     });
    //     path.value = res.data.path;
    //     v.value = "valid";
    //     errorStr.value = "File has been uploaded";
    //     file.value = null;
    //     error.value = false;
    //     complete.value.avatar = res.data.path; 
    //     console.log("========================image.value", image.value);
    //   } catch (err) {
    //     errorStr.value = "Something went wrong";
    //     console.error(err);
    //     error.value = true;
    //   }
    // };


    return {
      v,
      form,
      path,
      valid2,
      valid,
      complete,
      Gender,
      Sexual,
      items,
      search,
      date,
      model,
      location,
      gettingLocation,
      errorStr,
      GenderRules,
      SexualRules,
      BioRules,
      TagsRules,
      FileRules,
      completed,
      compete,
      awaitPic,
      // pics,
      image
    };
  },
};
</script>
