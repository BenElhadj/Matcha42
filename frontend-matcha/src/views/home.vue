<template>
  <div>
    <!-- <BackgroundView /> -->
    <h1>Welcome to Matcha</h1>
  </div>
</template>

<script>
// import BackgroundView from '@/components/website/Background.vue';

export default {
  name: 'HomePage',
  components: {
    // BackgroundView,
  },
  created() {
    console.log("Je suis dans le composant @/views/home.vue");
  },
};
</script>

<style scoped>
/* Remove the styles for .HomePage */
h1 {
  font-weight: normal;
  color: #ffffff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}
</style>