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
          <a target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/42Matcha" class="small-txt decoration-none" >Facebook</a>
          <a target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/42matcha/" class="small-txt decoration-none" >Instagram</a>
          <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/42Matcha" class="small-txt decoration-none">Twitter</a>
          <a target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/@42Matcha" class="small-txt decoration-none">Youtube</a>
        </div>
      </div>
      <div class="divider" />
      <div class="bottom-container">
        <v-list-item Align=Center class="middle-side medium-txt decoration-none">
          <p>Bhamdi & Mbouzae<br/>Vous présentent</p>
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

/* .small-txt {
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

.is-not-highlighted {
  font-family: 'Raleway';
}

.lang {
  cursor: pointer;
} */

.back-to-top {
  cursor: pointer;
  right: 0px;
  position: absolute;
  bottom: 27px;
}

</style>
