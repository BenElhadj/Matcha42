<template>
  <nav class="navbar">
      <router-link to="/">
          <div class="logo secondary--text" :class="{ 'logo-hover': hover }">
              <i class="mdi mdi-atom-variant pr-2 secondary--text"></i>
              <span class="font-weight-light">MAT</span>
              <span>CHA</span>
          </div>
      </router-link>
      <div class="spacer"></div>
      <div class="py-3">
          <ModalLogin />
      </div>
  </nav>
</template>

<script>
import { ref } from 'vue';
import ModalLogin from './ModalLogin.vue';

export default {
  name: "NavbarApp",
  created() {
    console.log("Je suis dans le composant @/components/website/NavbarApp.vue");
  },
  components: { ModalLogin },
  setup() {
      const hover = ref(false);

      return { hover };
  },
}
</script>

<style scoped>
.logo
{
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 25px;
  letter-spacing: 0.02em;
  cursor: pointer;
  text-decoration: none;
}

.logo-hover {
  font-size: 30px;
  transition: font-size 0.3s ease-in-out;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--v-accent-base);
  padding: 8px 16px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.spacer {
  flex-grow: 1;
}
</style>