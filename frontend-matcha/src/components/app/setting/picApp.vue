<template>
  <v-col>
    <v-row>
      <v-col>
        <v-row align="center" justify="center">
          <v-avatar size="250" class="pink darken-3 mt-6" align="center" justify="center">
            <img :src="path" />
          </v-avatar>
        </v-row>
        <v-card class="px-5" color="accent">
          <v-form v-model="valid">
            <v-row class="mt-10 pb-3" cols="12" xs="6" sm="8" md="6" lg="6" xl="6">
              <v-col>
                <v-file-input :rules="rules" v-model="image" accept="image/png, image/jpeg, image/jpg"
                    placeholder="Pick an avatar" prepend-icon="mdi-camera" label="Avatar">
                </v-file-input>
              </v-col>
              <v-col>
                <v-btn style="float: right" outlined color="primary" class="mt-4" :disabled="!valid" @click="addPic">
                  <v-icon left>check-bold</v-icon>SAVE
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
    <v-card class="px-5" color="accent">
      <v-row class="my-6">
          <v-col class="mt-1">
            <span class="font-weight-black">Email:</span>
          </v-col>
          <v-col class="mt-1">
            <span class="font-italic font-weight-black">{{ email.length > 15 ? email.substring(0, 15) + '...' : email }}</span>
          </v-col>
          <v-col class="mt-1">
            <editEmail />
          </v-col>
      </v-row>
    </v-card>
    <v-card class="px-5" color="accent">
      <v-row cols="12" xs="12" sm="7" md="3" lg="3" xl="1" class="my-6">
        <v-col class="mt-1">
          <span class="font-weight-black">Password:</span>
        </v-col>
        <v-col class="mt-1">
          <span class="font-weight-black">*******************</span>
        </v-col>
        <v-col class="mt-1">
          <editPassword />
        </v-col>
      </v-row>
    </v-card>
    <v-card class="px-5" color="accent">
      <v-row cols="12" xs="12" sm="7" md="3" lg="3" xl="1" class="my-6">
        <v-col class="mt-1">
          <span class="font-weight-black">Location</span>
        </v-col>
        <v-col class="mt-1">
          <editLocation />
        </v-col>
      </v-row>
    </v-card>
  </v-col>
</template>

<script>
import { ref, onMounted } from 'vue';
import editEmail from "./editEmail";
import editPassword from "./editPassword";
import editLocation from "./editLocation";
import { getProfileCompletion } from '@/api';
import { db, storage } from '@/firebaseConfig';
import { updateDoc, doc, getDoc } from 'firebase/firestore';
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage';

export default {
  name: "PicApp",
  created() {
    console.log("Je suis dans le composant @/components/app/setting/picApp.vue");
  },
  components: { editEmail, editPassword, editLocation },
  setup() {
    const valid = ref(true);
    const email = ref("");
    const path = ref("");
    const image = ref(null);
    const rules = [
      value => !!value || 'Avatar is required',
      value => !value || value.size < 2000000 || "Image size should be less than 2 MB!"
    ];
    const addPic = async () => {
      try {
        const profileCompletion = await getProfileCompletion(localStorage.getItem('token'));
        const uid = profileCompletion.uid;
        const storagePath = `avatars/${uid}/${image.value.name}`;
        const avatarRef = storageRef(storage, storagePath);
        await uploadBytes(avatarRef, image.value);
        const downloadURL = await getDownloadURL(avatarRef);
        path.value = downloadURL;
        const userDoc = doc(db, 'users', uid);
        await updateDoc(userDoc, { avatar: downloadURL });
      } catch (err) {
        console.log('Error:', err);
      }
    };
    onMounted(async () => {
      const profileCompletion = await getProfileCompletion(localStorage.getItem('token'));
      const uid = profileCompletion.uid;
      const userDoc = doc(db, 'users', uid);
      const userData = await getDoc(userDoc);
      path.value = userData.data().avatar;
      email.value = userData.data().email;
    });
    return { valid, email, path, image, rules, addPic }
  }
};
</script>
