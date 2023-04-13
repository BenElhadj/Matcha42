<template>
  <div class="full-container txt-white" id="app">
    <v-carousel cycle :height="carouselHeight" :show-arrows="false" :hide-delimiters="true">
      <v-carousel-item
        v-for="(image, i) in images"
        :key="i"
        :class="`bg-image-${i} ${image.loaded ? 'image-loaded' : ''}`"
        :style="image.style"
      >
        <!-- Ajoutez cette ligne à l'intérieur de chaque v-carousel-item -->
        <img :src="image.url" @load="image.loaded = true" style="opacity: 0; position: absolute; width: 100%; height: 100%;" />
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
import { VCarousel, VCarouselItem } from 'vuetify/lib/components';
import { getProfileCompletion } from "@/api";
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'App',
  components: {
    ModalLogin,
    FooterApp,
    VCarousel,
    VCarouselItem,
  },
  setup() {
    const store = useStore();
    const images = ref([]);
    const carouselHeight = ref('100%');

    const fetchImages = async () => {
      const isUid = store.state.uid;
      const profileCompletion = await getProfileCompletion(store.state.token);
      const backgroundImageStyle = (url) => ({ backgroundImage: `url(${url})`, url, loaded: false });


      if (isUid && profileCompletion.completed) {
          images.value = [
          { style: backgroundImageStyle(require("@/assets/backgroundOnLine/30595.jpg")) },
          { style: backgroundImageStyle(require("@/assets/backgroundOnLine/30609.jpg")) },
          { style: backgroundImageStyle(require("@/assets/backgroundOnLine/30620.jpg")) },
          { style: backgroundImageStyle(require("@/assets/backgroundOnLine/30606.jpg")) },
          { style: backgroundImageStyle(require("@/assets/backgroundOnLine/30651.jpg")) },
          { style: backgroundImageStyle(require("@/assets/backgroundOnLine/30733.jpg")) },
          { style: backgroundImageStyle(require("@/assets/backgroundOnLine/514501.jpg")) },
          { style: backgroundImageStyle(require("@/assets/backgroundOnLine/514528.jpg")) },
          { style: backgroundImageStyle(require("@/assets/backgroundOnLine/514530.jpg")) },
          { style: backgroundImageStyle(require("@/assets/backgroundOnLine/Colorful-heart.jpg")) },
          ];
      } else {
        images.value = [backgroundImageStyle(require("@/assets/backgroundOffLine/30638.jpg"))];
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

.v-carousel {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1; 
}

[class^="bg-image-"] {
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .image-loaded {
  opacity: 1;
  transition: opacity 1s ease-in;
}

</style>

