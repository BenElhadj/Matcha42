<template>
  <div>
    <Button label="LOG IN" icon="pi pi-user" class="p-button-outlined" @click="dialog = true" />
    <!-- <Dialog :visible.sync="dialog" :maximizable="false" :closable="false" :style="{width: '30vw'}"> -->
    <Dialog v-model:visible="dialog" :maximizable="false" :closable="false" :style="{width: '30vw'}">
      <template v-slot:header>
        <div class="p-d-flex p-ai-center p-jc-between">
          <h5>{{ registerTitle() }}</h5>
          <Button icon="pi pi-times" class="p-button-rounded p-button-text" @click="dialog = false" />
        </div>
      </template>
      <template v-if="status == 'login'">
        <div class="p-fluid">
          <div class="p-field">
            <label for="username">Username</label>
            <InputText id="username" v-model="login.username" />
          </div>
          <div class="p-field">
            <label for="password">Password</label>
            <Password id="password" v-model="login.password" />
          </div>
          <div class="p-field-checkbox">
            <Checkbox v-model="remember" inputId="remember" />
            <label for="remember">Remember Me</label>
          </div>
          <div class="p-pt-2">
            <Button label="LOGIN" @click="loginUser" />
          </div>
        </div>
        <div class="p-d-flex p-jc-end p-pt-3">
          <a href="#" @click.prevent="trouble">Trouble Logging In?</a>
        </div>
      </template>
      <template v-else-if="status == 'recover'">
        <div class="p-fluid">
          <div class="p-field">
            <label for="email">Email Address</label>
            <InputText id="email" v-model="forget.email" />
          </div>
          <div class="p-pt-2">
            <Button label="RECOVER ACCOUNT" @click="forgetUserPassword" />
          </div>
        </div>
      </template>
      <template v-else-if="status == 'register'">
        <div class="p-fluid">
          <div class="p-field">
            <label for="firstName">First Name</label>
            <InputText id="firstName" v-model="register.firstName" />
          </div>
          <div class="p-field">
            <label for="lastName">Last Name</label>
            <InputText id="lastName" v-model="register.lastName" />
          </div>
          <div class="p-field">
            <label for="regUsername">Username</label>
            <InputText id="regUsername" v-model="register.username" />
          </div>
          <div class="p-field">
            <label for="regEmail">Email Address</label>
            <InputText id="regEmail" v-model="register.email" />
          </div>
          <div class="p-field">
            <label for="regPassword">Password</label>
            <Password id="regPassword" v-model="register.password" />
          </div>
          <div class="p-pt-2">
            <Button label="REGISTER" @click="registerUser" />
          </div>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { Button, InputText, Password, Checkbox, Dialog } from 'primevue';

import {
  registerUser,
  loginUser,
  forgetUserPassword,
} from "@/api";

export default {
  name: "ModalLogin",
  created() {
    console.log("Je suis dans le composant @/components/website/ModalLogin.vue");
  },
  components: {
    Button,
    InputText,
    Password,
    Checkbox,
    Dialog
  },
  data() {
    return {
      register: {},
      login: {},
      forget: {},
      valid: true,
      dialog: false,
      remember: false,
      snackbar: false,
      timeout: 8000,
      status: "login",
      text: "",
      FirstNameRules: [
        (v) => !!v || "First Name is required",
        (v) => /^.{0,20}$/.test(v) || "First Name must be less than 20 characters",
      ],
      LastNameRules: [
        (v) => !!v || "Last Name is required",
        (v) => /^.{0,20}$/.test(v) || "Last Name must be less than 20 characters",
      ],
      usernameRules: [
        (v) => !!v || "Username is required",
        (v) => /^.{0,15}$/.test(v) || "Username must be less than 15 characters",
      ],
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /^.+@.+\..+$/.test(v) || "E-mail must be valid",
      ],
      passwordRules: [
        (v) => !!v || "Password is required",
        (v) => /^.{9,}$/.test(v) || "Password must be more than 8 characters",
        (v) => /[A-Z]/.test(v) || "Password must be valid",
        (v) => /[a-z]/.test(v) || "Password must be valid",
        (v) => /[0-9]/.test(v) || "Password must be valid",
      ],
    };
  },
  methods: {
    general: function () {
      this.status == "login"
        ? (this.status = "register")
        : (this.status = "login");
      this.$refs.register.reset();
    },
    loginUser: async function () {
      try {
        const response = await loginUser(this.login);
        this.snackbar = true;
        this.text = response.msg;
      } catch (error) {
        console.error("Error in loginUser:", error);
      }
    },
    registerUser: async function () {
      try {
        const response = await registerUser(this.register);
        this.snackbar = true;
        this.text = response.msg;
      } catch (error) {
        console.error("Error in registerUser:", error);
      }
    },
    forgetPassword: async function () {
      try {
        const response = await forgetUserPassword(this.forget);
        this.snackbar = true;
        this.text = response.msg;
      } catch (error) {
        console.error("Error in forgetPassword:", error);
      }
    },
    ...mapActions(["SetToken"]),
  },
};
</script>





<!-- <template>
  <v-dialog max-width="550px" v-model="dialog">
    <div class="text-center">
      <v-snackbar v-model="snackbar" :timeout="timeout">
        {{ text }}
        <Vbtn color="primary" text @click="snackbar = false">Close</Vbtn>
      </v-snackbar>
    </div>
    <template v-slot:activator="{ on }">
      <Vbtn depressed v-on="on" color="primary" outlined>
        <span>LOG IN</span>
        <v-icon right>mdi-login-variant</v-icon>
      </Vbtn>
    </template>
    <v-card color="accent">
      <v-card-title class="pb-2">
        <v-toolbar-title>{{ registerTitle() }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <template v-slot:activator="{ on }">
          <Vbtn icon depressed v-on="on" @click="dialog = !dialog">
            <v-icon>mdi-close</v-icon>
          </Vbtn>
        </template>
      </v-card-title>
      <v-card-text class="pt-2">
        <template v-if="status == 'login'">
          <v-form ref="loginFormRef" v-model="valid" registerForm method="post">
            <v-text-field v-model="login.username" outlined label="Username" type="text" :rules="usernameRules" required></v-text-field>
            <v-text-field v-model="login.password" outlined label="Password" type="password" :rules="passwordRules" required></v-text-field>
            <v-checkbox v-model="remember" label="Remember Me"></v-checkbox>
            <Vbtn width="100%" @click="loginUser" color="primary" :disabled="!valid">LOGIN</Vbtn>
          </v-form>
          <v-container fluid>
            <v-row justify="space-around" no-gutters>
              <v-col align="end" justify="center">
                <h2 class="body-2" style="text-decoration: underline; cursor: pointer" @click="Trouble" >Trouble Logging In?</h2>
              </v-col>
            </v-row>
          </v-container>
        </template>
        <v-form v-else-if="status == 'recover'" ref="recoverFormRef" v-model="valid" register>
          <v-text-field v-model="forget.email" outlined label="Email Address" :rules="emailRules" type="email"></v-text-field>
          <Vbtn @click="await_forget" width="100%" :disabled="!valid" color="primary">RECOVER ACCOUNT</Vbtn>
        </v-form>
        <v-form v-else-if="status == 'register'" ref="registerFormRef" v-model="valid" register>
          <v-text-field v-model="register.firstName" outlined label="First Name" type="text" :rules="FirstNameRules" required></v-text-field>
          <v-text-field v-model="register.lastName" outlined label="Last Name" type="text" :rules="LastNameRules" required></v-text-field>
          <v-text-field v-model="register.username" outlined label="Username" type="text" :rules="usernameRules" required></v-text-field>
          <v-text-field v-model="register.email" outlined label="Email Address" type="email" :rules="emailRules" required></v-text-field>
          <v-text-field v-model="register.password" outlined label="Password" type="password" :rules="passwordRules" required></v-text-field>
          <Vbtn @click="await_register" width="100%" :disabled="!valid" color="primary">SIGN UP</Vbtn>
        </v-form>
        <v-container grid-list-md fluid class="pt-4 mt-3">
          <v-row>
            <h2>{{ wanaSR() }}</h2>
            <v-spacer></v-spacer>
            <Vbtn color="primary" @click="general">{{ buttonSR() }}</Vbtn>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>

import { defineComponent, ref } from "vue";
import { VBtn } from 'vuetify/lib/components';
// import api from "@/api";
import {
  registerUser,
  loginUser,
  forgetUserPassword,
} from "@/api";

export default defineComponent({
  name: "ModalLogin",
  created() {
    console.log("Je suis dans le composant @/components/website/ModalLogin.vue");
  },

  setup() {
    const formRef = ref(null);
    const loginFormRef = ref(null);
    const recoverFormRef = ref(null);
    const registerFormRef = ref(null);
    return {
      VBtn,
      formRef,
      loginFormRef,
      recoverFormRef,
      registerFormRef,
      register: {},
      login: {},
      forget: {},
      valid: true,
      dialog: false,
      remember: false,
      snackbar: false,
      timeout: 8000,
      status: "login",
      text: '',
      FirstNameRules: [(v) => !!v || 'First Name is required',
        (v) => (v && v.length <= 20) || 'First Name must be less than 20 characters',],     
      LastNameRules: [(v) => !!v || 'Last Name is required',
        (v) => (v && v.length <= 20) || 'First Name must be less than 20 characters',],
      usernameRules: [(v) => !!v || 'Username is required',
        (v) => (v && v.length <= 15) || 'Username must be less than 15 characters',],
      emailRules: [(v) => !!v || 'E-mail is required',
        (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',],
      passwordRules: [(v) => !!v || 'Password is required',
        (v) => (v && v.length > 8) || 'Password must be more than 8 characters',
        (v) => /[A-Z]/.test(v) || 'Password must be valid',
        (v) => /[a-z]/.test(v) || 'Password must be valid',
        (v) => /[0-9]/.test(v) || 'Password must be valid',],
      registerTitle: function() {
        switch (this.status) {
          case "login":
            return "Login";
          case "recover":
            return "Recover Your Account";
          case "register":
            return "Sign up";
        }
      },
      SRwith: function() {
        return this.status == "login" ? "Login With" : "Sign Up With";
      },
      wanaSR: function() {
        return this.status == "login" ? "Don't have an account?" : "Already Have An Account?";
      },
      buttonSR: function() {
        return this.status == "login" ? "Sign Up" : "Login";
      },
    };
  },
  methods: {
    general: function() {
      if (this.status === 'login') {
        this.status = 'register';
        if (this.recoverFormRef) this.recoverFormRef.reset();
      } else {
        this.status = 'login';
        if (this.registerFormRef) this.registerFormRef.reset();
      }
    },
    handleLogin: async function() {
      const result = await this.loginUser();
      this.snackbar = true;
      if (result)
        this.text = result.response.data.msg;
    },
    await_register: async function() {
      const response = await this.registerWithEmail();
      this.snackbar = true;
      this.text = response.data.msg;
    },
    await_forget: async function() {
      const response = await this.forget_Password();
      this.snackbar = true;
      this.text = response.data.msg;
    },
    // async registerWithEmail() {
    //   try {
    //     await api.post("/auth/register", {
    //       firstName: this.register.firstName,
    //       lastName: this.register.lastName,
    //       username: this.register.username,
    //       email: this.register.email,
    //       password: this.register.password
    //     });
    //     return { data: { msg: "Registration successful" } };
    //   } catch (error) {
    //     console.error(error);
    //     return { data: { msg: error.response.data.message || error.message } };
    //   }
    // },
    async registerWithEmail() {
      try {
        const response = await registerUser(this.register);
        this.snackbar = true;
        this.text = response.msg;
      } catch (error) {
        this.snackbar = true;
        this.text = error.message;
      }
    },
    async registerWithFacebook() {
    try {
      console.log("registerWithFacebook");
      // const clientId = "your_facebook_client_id";
      // const redirectUri = "your_frontend_redirect_url";
      // const authUrl = `https://www.facebook.com/v12.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=email`;
      // window.location.href = authUrl;
    } catch (error) {
      console.error(error);
    }
  },
  async registerWithGoogle() {
    try {
      console.log("registerWithGoogle");
      // const clientId = "your_google_client_id";
      // const redirectUri = "your_frontend_redirect_url";
      // const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=profile%20email&response_type=code`;
      // window.location.href = authUrl;
    } catch (error) {
      console.error(error);
    }
  },
  async registerWithMicrosoft() {
    try {
      console.log("registerWithMicrosoft");
      // const clientId = "your_microsoft_client_id";
      // const redirectUri = "your_frontend_redirect_url";
      // const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=openid%20email%20profile&response_type=code`;
      // window.location.href = authUrl;
    } catch (error) {
      console.error(error);
    }
  },
    // async loginUser() {
    //   try {
    //     const response = await api.post("/auth/login", {
    //       email: this.login.email || this.login.username,
    //       password: this.login.password,
    //     });
    //     const { token, uid } = response.data;
    //     this.$cookies.set("token", token, {});
    //     this.SetToken(token);
    //     this.$store.commit("setUID", uid);
    //     this.$router.push("/profile");
    //   } catch (error) {
    //     console.error(error);
    //     return { response: { data: { msg: error.response.data.message || error.message } } };
    //   }
    // },
    // async forget_Password() {
    //   try {
    //     await api.post("/auth/forget", {
    //       email: this.forget.email
    //     });
    //     return { data: { msg: "Password reset email sent" } };
    //   } catch (error) {
    //     console.error(error);
    //     return { data: { msg: error.response.data.message || error.message } };
    //   }
    // },
    async loginUser() {
      try {
        const response = await loginUser(this.login);
        this.handleLoginResponse(response);
      } catch (error) {
        this.snackbar = true;
        this.text = error.message;
      }
    },
    async forget_Password() {
      try {
        const response = await forgetUserPassword(this.forget);
        this.snackbar = true;
        this.text = response.msg;
      } catch (error) {
        this.snackbar = true;
        this.text = error.message;
      }
    },
  },
});
</script>
 -->
