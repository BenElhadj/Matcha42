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
        <v-toolbar-title>Edit Password</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon depressed activator v-on:click="dialog = !dialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="pt-2">
        <v-form v-model="valid" ref="register">
          <v-text-field v-model="register.NewPassword" outlined label="New Password" type="password" :rules="passwordRules" required></v-text-field>
          <v-text-field v-model="register.password" outlined label="Password" type="password" :rules="passwordRules" required></v-text-field>
          <v-btn @click="await_register" width="100%" :disabled="!valid" color="primary">EDIT</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
import { getProfileCompletion } from "@/api";

export default {
  name: 'EditPasswordApp',
  created() {
    console.log("Je suis dans le composant @/components/app/setting/editPassword.vue");
  },
  setup() {
    const store = useStore();
    const dialog = ref(false);
    const snackbar = ref(false);
    const valid = ref(true);
    const register = ref({});
    const timeout = ref(8000);
    const text = ref("");
    const passwordRules = [
      (v) => !!v || "Password is required",
      (v) => (v && v.length > 8) || "Password must be more than 8 characters",
      (v) => /[A-Z]/.test(v) || "Password must be valid",
      (v) => /[a-z]/.test(v) || "Password must be valid",
      (v) => /[0-9]/.test(v) || "Password must be valid",
    ];

    const await_register = async function () {
      const respons = await inscribe();
      snackbar.value = true;
      text.value = respons.msg;
    };

    const inscribe = async function () {
      const token = store.state.token;
      register.value.tmp = token;
      try {
        const response = await getProfileCompletion(token);
        if (response === "Logout") {
          store.commit("setToken", null);
          store.commit("setUID", null);
          this.$router.push("/");
        }
        return response;
      } catch (err) {
        console.error(err);
      }
    };

    return {
      dialog,
      snackbar,
      valid,
      register,
      timeout,
      text,
      passwordRules,
      await_register,
    };
  },
};
</script>
