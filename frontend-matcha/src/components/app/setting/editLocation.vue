<template>
  <v-dialog max-width="550px" v-model="dialog">
    <div class="text-center">
      <v-snackbar v-model="snackbar" :timeout="timeout">
        {{ text }}
        <v-btn color="primary" text @click="snackbar = false">Close</v-btn>
      </v-snackbar>
    </div>
    <template v-slot:activator>
      <v-btn outlined color="primary" activator style="float: right">
        <v-icon left>mdi-pencil</v-icon> Edit
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="pb-2">
        <v-toolbar-title>Edit Location</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon class="mx-2" color="primary" @click="resetProfile">
          <v-icon>mdi-lock-reset</v-icon>
        </v-btn>
        <v-btn icon depressed activator v-on:click="dialog = !dialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="pt-2">
        <v-form v-model="valid">
          <v-text-field v-model="lat" outlined label="Latitude" type="number" :rules="latRules" required></v-text-field>
          <v-text-field v-model="lng" outlined label="Longitude" type="number" :rules="lngRules" required></v-text-field>
          <v-btn @click="awaitLocation" width="100%" :disabled="!valid" color="primary">EDIT</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref, watch } from 'vue';
import { useStore } from 'vuex';
import { getProfileCompletion } from '@/api';
import { auth, updateDoc, doc } from '@/firebaseConfig';


export default {
  name: 'EditLocation',
  created() {
    console.log("Je suis dans le composant @/components/app/setting/editLocation.vue");
  },
  setup() {
    const store = useStore();
    const dialog = ref(false);
    const lat = ref('');
    const lng = ref('');
    const valid = ref(true);
    const snackbar = ref(false);
    const timeout = ref(8000);
    const text = ref('');

    const latRules = [v => !!v || 'Latitude is required'];
    const lngRules = [v => !!v || 'Longitude is required'];

    watch(store.state, async () => {
      if (store.state.token) {
        const data = await getProfileCompletion(store.state.token);
        lat.value = data.lat;
        lng.value = data.lng;
      }
    });

    const reset_Profile = async () => {
      try {
        const res = await getProfileCompletion('63f39e0edc15d5');
        const user = auth.currentUser;
        const userRef = doc(user.uid);

        const loc = String(res.loc).split(',');
        const newLocation = {
          lat: loc[0],
          lng: loc[1],
          address: `${res.city}, ${res.country}`,
        };

        updateDoc(userRef, newLocation);
        lat.value = loc[0];
        lng.value = loc[1];
      } catch (error) {
        console.log(error);
      }
    };

    const await_location = async () => {
      const respons = await location();
      snackbar.value = true;
      text.value = respons.res.data.msg;
    };

    const location = async () => {
      const user = auth.currentUser;
      const userRef = doc(user.uid);

      try {
        await updateDoc(userRef, {
          lat: lat.value,
          lng: lng.value,
        });

        return { res: { data: { msg: 'Location updated successfully' } } };
      } catch (error) {
        console.log(error);
        return { res: { data: { msg: 'Failed to update location' } } };
      }
    };

    return {
      dialog,
      lat,
      lng,
      valid,
      snackbar,
      timeout,
      text,
      latRules,
      lngRules,
      reset_Profile,
      await_location,
    };
  },
};
</script>