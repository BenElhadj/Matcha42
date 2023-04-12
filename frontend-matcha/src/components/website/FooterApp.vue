<template>
  <div class="footer">
    <div class="full-container txt-white">
      <div class="top-container bold">
        <div class="categorie-container">
          <h2 class="big-txt">Contact us</h2>
          <a target="_blank" rel="noopener noreferrer" href="" class="small-txt decoration-none">Press</a>
          <a target="_blank" rel="noopener noreferrer" href="" class="small-txt decoration-none">Business</a>
          <a target="_blank" rel="noopener noreferrer" href="" class="small-txt decoration-none">Jobs</a>
        </div>
        <div class="categorie-container">
          <h2 class="big-txt">Follow us</h2>
          <a target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/KeakrApp" class="small-txt decoration-none" >Facebook</a>
          <a target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/keakrapp" class="small-txt decoration-none" >Instagram</a>
          <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/keakrofficial" class="small-txt decoration-none">Twitter</a>
          <a target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/channel/UCzO1dSfNiUKgm11cCHibppg" class="small-txt decoration-none">Youtube</a>
        </div>
      </div>
      <div class="divider" />
      <div class="bottom-container">
        <v-list-item class="middle-side medium-txt decoration-none">
          <p>Legal notice</p>
          <p>{{ 'MATCHA ©' + ' ' + new Date().getFullYear() }}</p>
        </v-list-item>
      </div>
      <img
        @click="moveUp()"
        class="back-to-top"
        :src="require('@/assets/back-to-top.png')"/>
      <!-- <v-icon @click="moveUp()" class="back-to-top">mdi-chevron-up</v-icon> -->
    </div>
  </div>
</template>

<script>
import { VListItem } from 'vuetify/lib/components';

export default {
  name: 'FooterApp',
  components: {
    VListItem,
  },
  created() {
    console.log("Je suis dans le composant @/components/website/FooterApp.vue");
  },
  methods: {
    moveUp() {
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })
    },
  },
};
</script>

<style scoped>

.small-txt {
  font-size: 12px;
  padding-bottom: 10px;
}

.medium-txt {
  font-size: 16px;
}

.big-txt {
  font-size: 18px;
}

.bottom-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 50px;
}

.full-container {
  position: relative;
  font-family: 'RalewayExtraBold';
  max-width: 1200px;
  margin: 0 auto;
  padding: 107px 0 50px 0;
  width: 85%;
}

.top-container {
  display: flex;
  flex-flow: row wrap;
  gap: 11%;
}

.divider {
  width: 100%;
  height: 1px;
  background: rgba(128, 128, 128, 0.467);
  margin-top: 90px;
  margin-bottom: 28px;
}

.left-container {
  max-width: 260px;
}

.categorie-container {
  display: flex;
  flex-direction: column;
}

.left-side {
  display: flex;
  max-width: 213px;
  max-height: 37px;
  gap: 20px;
  align-items: center;
}

.middle-side {
  font-family: 'Raleway';
  gap: 25px;
  display: flex;
}

.right-side {
  display: flex;
  gap: 10px;
}

.underlined {
  text-decoration: underline;
  text-underline-offset: 4px;
}

.back-to-top {
  cursor: pointer;
  /* right: -141px; */
  position: absolute;
  width: 120px;
  bottom: 32px;
}

.is-not-highlighted {
  font-family: 'Raleway';
}

.lang {
  cursor: pointer;
}

@media screen and (max-width: 1372px) {
  .left-container {
    margin-bottom: 20px;
  }
}

@media screen and (max-width: 1492px) {
  .back-to-top {
    right: -95px;
    bottom: 121px;
  }
}

@media screen and (max-width: 1372px) {
  .back-to-top {
    right: -33px;
    bottom: 207px;
  }
}

@media screen and (max-width: 597px) {
  .back-to-top {
    bottom: 115px;
  }
}

.back-to-top {
  cursor: pointer;
  right: -141px;
  position: absolute;
  font-size: 2rem; /* Ajoutez la taille de l'icône */
  color: #ffffff; /* Définissez la couleur de l'icône */
  bottom: 32px;
}

</style>
