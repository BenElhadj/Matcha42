<template>
    <v-row>
        <v-col cols="12" xl="4" lg="4" md="4" v-if="!path">
            <v-form v-model="valid2">
                <v-card color="accent">
                    <v-row style="margin: 2vh 0 0 0; padding: 1vh">
                    <v-file-input :rules="rules" v-model="image" accept="image/png, image/jpeg, image/jpg" 
                    placeholder="Pick an avatar" prepend-icon="mdi-camera" label="Avatar"></v-file-input> 
                    </v-row>
                    <v-btn color="primary" @click="awaitPic" width="90%" style="margin: 0 1vh 1vh 1vh;" v-if="v == ``" :disabled="!valid2">Save</v-btn>                    
                </v-card>
            </v-form>
        </v-col>
        <v-col cols="12" xl="4" lg="4" md="4" v-if="path">
            <center>
                <v-avatar size="250" class="pink darken-3 mt-6" align="center" justify="center">
                    <img :src="path" />
                </v-avatar>                
            </center>
        </v-col>
        <v-col cols="12" xl="8" lg="8" md="8" v-if="v == `valid`">
            <v-form v-model="valid">
                <v-card color="accent">
                    <v-row style="margin: 4vh 0 0 0">
                        <v-col>
                            <v-date-picker min="1925" max="2004" color="primary" v-model="date" width="290" class="ml-6 my-12"></v-date-picker>
                        </v-col>
                        <v-col style="margin: 4vh 0 0 0">
                            <v-select v-model="complete.gender" :items="Gender" label="Gender" outlined style="margin: 0 1vh 0 1vh" :rules="GenderRules"></v-select>
                            <v-select v-model="complete.sexualPref" :items="Sexual" label="Sexual preferences" outlined style="margin: 0 1vh 0 1vh" :rules="SexualRules"></v-select>
                        </v-col>            
                    </v-row>
                    <v-row  style="margin: 2vh 0 0 0">
                        <v-container fluid>
                            <v-combobox v-model="model" :items="items" :search-input="search" hide-selected label="Add some tags" multiple persistent-hint small-chips :rules="TagsRules"></v-combobox>
                        </v-container>
                    </v-row>
                    <v-row  style="margin: 2vh 0 0 0">
                        <v-textarea v-model="complete.bio" label="Bio" outlined style="margin: 0 1vh 0 1vh" :rules="BioRules"></v-textarea>
                    </v-row>
                    <v-row  style="margin: 2vh 0 0 0" v-if="valid">
                        <n-link to="/profile"><v-btn color="primary" @click="completed" width="100%" style="margin: 0 1vh 1vh 1vh" :disabled="!valid">Save</v-btn></n-link>
                    </v-row>                    
                </v-card>

            </v-form>
        </v-col>
    </v-row>
</template>

<script>
import { ref } from "vue";
import api from "@/api";

export default {
  name: "UserInfoApp",

  created() {
    console.log("Je suis dans le composant @/components/app/completeProfile/userInfoApp.vue");
  },

  setup() {
    const v = ref("");
    const path = ref("");
    const valid2 = ref(true);
    const valid = ref(true);
    const complete = ref({});
    const Gender = ["Female", "Male"];
    const Sexual = ["Female", "Male", "All"];
    const items = ["PHP", "JavaScript", "C", "Python"];
    const search = ref(null);
    const date = ref("1999-01-01");
    const model = ref([]);
    const location = ref(null);
    const gettingLocation = ref(false);
    const errorStr = ref(null);

    const GenderRules = [v => !!v.value || "Gender is required"];
    const SexualRules = [v => !!v.value || "Sexual preferences is required"];
    const BioRules = [
      v => !!v.value || "Bio is required",
      v => (v.value && v.value.length >= 5) || "Bio must be more than 5 characters",
      v => (v.value && v.value.length <= 50) || "Bio must be less than 50 characters",
    ];
    const TagsRules = [v => (v.value && v.value.length != 0) || "Tags is required"];

    const completed = async function() {
      await compete();
      this.$router.push("/profile");
    };

    const compete = async function() {
      const tmp = this.$cookies.get("token");
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
      await pic();
    };

    const pic = async function() {
      const formData = new FormData();
      formData.append("file", this.image);
      const tmp = this.$cookies.get("token");
      formData.append("tmp", tmp);

      try {
        const res = await api.post("/comp/pic", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        this.path = res.data.path;
        this.v = "valid";
        this.message = "File has been uploaded";
        this.file = "";
        this.error = false;
      } catch (err) {
        this.message = "Something went wrong";
        console.error(err);
        this.error = true;
      }
    };


    return {
      v,
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
      completed,
      compete,
      awaitPic,
      pic,
    };
  },
};
</script>

