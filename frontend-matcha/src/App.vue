<template>
  <div id="app">
    <v-carousel cycle :height="carouselHeight" :show-arrows="false" :hide-delimiters="true">
      <v-carousel-item v-for="(image, i) in images" :key="i">
        <v-img class="full-screen-image" :src="image" width="100%" height="100%"></v-img>
      </v-carousel-item>
    </v-carousel>
    <div id="content">
      <div id="main">
        <ModalLogin />
        <router-view />
      </div>
      <FooterApp />
    </div>
  </div>
</template>

<script>
import ModalLogin from './components/website/ModalLogin.vue';
import FooterApp from './components/website/FooterApp.vue';
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { getProfileCompletion } from "@/api";
import { VCarousel, VCarouselItem, VImg } from 'vuetify/lib/components';

export default {
  name: 'App',
  components: {
    ModalLogin,
    FooterApp,
    VCarousel,
    VCarouselItem,
    VImg,
  },
  setup() {
    // ... code from Background.vue
    const store = useStore();
    const images = ref([]);
    const carouselHeight = ref('100%');

    const fetchImages = async () => {
      const isUid = store.state.uid;
      const profileCompletion = await getProfileCompletion(store.state.token);
      if (isUid && profileCompletion.completed) {
          images.value = [
          require("@/assets/backgroundOnLine/30595.jpg"),
          require("@/assets/backgroundOnLine/30606.jpg"),
          require("@/assets/backgroundOnLine/30609.jpg"),
          require("@/assets/backgroundOnLine/30620.jpg"),
          require("@/assets/backgroundOnLine/30651.jpg"),
          require("@/assets/backgroundOnLine/30733.jpg"),
          require("@/assets/backgroundOnLine/514501.jpg"),
          require("@/assets/backgroundOnLine/514528.jpg"),
          require("@/assets/backgroundOnLine/514530.jpg"),
          require("@/assets/backgroundOnLine/Colorful-heart.jpg"),
          ];
      } else {
        images.value = [require("@/assets/backgroundOffLine/30638.jpg")];
      }
    };

    onMounted(() => {
      console.log("Je suis dans le composant @/App.vue");
      fetchImages();
    });

    return { images, carouselHeight };
  },
};
</script>

<style>
#content {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
}

#main {
  flex: 1;
  position: relative;
}

/* Styles from Background.vue */
.v-carousel {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1; 
}

.full-screen-image {
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>

