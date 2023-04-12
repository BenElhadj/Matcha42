<template>
  <v-app>
    <NavbarApp />
      <v-dialog max-width="550px" v-model="dialog">
        <!-- Snack Bar -->
        <div class="text-center">
          <v-snackbar v-model="snackbar" :timeout="8000">
            {{ text }}
            <v-btn color="blue" text @click="snackbar = false">Close</v-btn>
          </v-snackbar>
        </div>
        <v-card dark color="rgb(0, 0, 0, 0.5)">
          <v-card-title class="pb-2">
            <v-toolbar-title>Change Password</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon depressed activator v-on:click="dialog = !dialog">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="pt-2">
            <template>
              <v-form v-model="valid">
                <v-text-field v-model="newPassword.password" outlined label="New Password" type="password" :rules="passwordRules" required></v-text-field>
                <v-btn @click="await_new" width="100%" color="rgb(0, 0, 0, 0.3)" :disabled="!valid">New Password</v-btn>
              </v-form>
            </template>
          </v-card-text>
        </v-card>
      </v-dialog>
    <Background />
    <FooterApp />
  </v-app>
</template>

<script>
import { ref, reactive, watch } from "vue";
import NavbarApp from "@/components/website/NavbarApp";
import FooterApp from "@/components/website/FooterApp";
import Background from "@/components/website/Background";
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { getProfileCompletion } from "@/api";
import { doc, updateDoc } from "@/firebaseConfig";

export default {
  name: "ForgetView",
  created() {
    console.log("Je suis dans le composant @/views/forget.vue");
  },
  components: { NavbarApp, FooterApp, Background/*, EditPasswordApp*/ },
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    let valid = ref(false);
    const text = ref("");
    const newPassword = reactive({});
    const snackbar = ref(false);
    const dialog = ref(true);
    const passwordRules = [
      v => !!v || 'New Password is required',
      v => (v && v.length > 8) || 'Password must be more than 8 characters',
      v => /[A-Z]/.test(v) || 'Password must be valid',
      v => /[a-z]/.test(v) || 'Password must be valid',
      v => /[0-9]/.test(v) || 'Password must be valid',
    ];

    watch(
      () => store.state.token,
      async (token) => {
        if (token) {
          const completion = await getProfileCompletion(token);
          if (completion.completed) {
            await router.push("/completeProfile");
          }
        }
      },
      { immediate: true }
    );

    const await_new = async function() {
      const respons = await new_Password();
      snackbar.value = true;
      text.value = respons.res.data.msg;
    };

    const new_Password = async function () {
      valid.value = false;
      const token = route.query.token;
      newPassword.token = token;
      try {
        const docRef = doc(token);
        await updateDoc(docRef, { password: newPassword.password });
        return { res: { data: { msg: "Password updated successfully." } } };
      } catch (err) {
        console.log(err);
      }
    };


    return {
      valid,
      text,
      newPassword,
      snackbar,
      dialog,
      passwordRules,
      await_new,
    };
  },
};
</script>
