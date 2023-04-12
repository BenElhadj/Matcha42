<template>
  <v-dialog max-width="550px" v-model="dialog">
    <div class="text-center">
      <v-snackbar v-model="snackbar" :timeout="timeout">
        {{ text }}
        <v-btn color="primary" text @click="snackbar = false">Close</v-btn>
      </v-snackbar>
    </div>
    <template v-slot:activator="{ on }">
      <v-btn outlined color="primary" activator v-on="on" style="float: right">
          <v-icon left>mdi-pencil</v-icon> Edit
        </v-btn>
    </template>
    <v-card>
      <v-card-title class="pb-2">
        <v-toolbar-title>Edit Email</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon depressed activator v-on:click="dialog = !dialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="pt-2">
        <v-form v-model="valid">
            <v-text-field v-model="register.email" outlined label="New Email" type="email" :rules="emailRules" required></v-text-field>
            <v-text-field v-model="register.password" outlined label="Password" type="password" :rules="passwordRules" required></v-text-field>
            <v-btn @click="await_email" width="100%" :disabled="!valid" color="primary">EDIT</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
import { getProfileCompletion } from "@/api";
import { useRouter } from "vue-router";

export default {
  name: 'EditEmail',
  created() {
    console.log("Je suis dans le composant @/components/app/setting/editEmail.vue");
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const register = ref({});
    const valid = ref(true);
    const dialog = ref(false);
    const snackbar = ref(false);
    const timeout = ref(8000);
    const text = ref('');

    const emailRules = [
      v => !!v || 'E-mail is required',
      v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
    ];

    const passwordRules = [
      v => !!v || 'Password is required',
      v => (v && v.length > 8) || 'Password must be more than 8 characters',
      v => /[A-Z]/.test(v) || 'Password must be valid',
      v => /[a-z]/.test(v) || 'Password must be valid',
      v => /[0-9]/.test(v) || 'Password must be valid',
    ];

    async function await_email() {
      const respons = await registerEmail();
      snackbar.value = true;
      text.value = respons.msg;
    }

    async function registerEmail() {
      const token = store.state.token;
      register.value.token = token;
      try {
        const res = await getProfileCompletion(token);
        if (res.data === "Logout") {
          store.commit("setUID", null);
          store.commit("setToken", null);
          router.push("/");
        }
        return { msg: res.msg };
      } catch (err) {
        console.log(err);
      }
    }

    return {
      register,
      valid,
      dialog,
      snackbar,
      timeout,
      text,
      emailRules,
      passwordRules,
      await_email,
      registerEmail,
    };
  },
};
</script>
