<template>
  <div class="NotifView">
    <div v-for="item in items" :key="item.id">
      <div class="notif-item">
        <span>{{ item.act }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getNotifications } from '@/api';

export default {
  name: 'NotifApp',
  created() {
    console.log("Je suis dans le composant @/components/app/notif/notifApp.vue");
  },
  setup() {
    const items = ref([]);

    onMounted(async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        this.$router.push('/');
        return;
      }

      try {
        const notifications = await getNotifications(token);
        items.value = notifications;
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    });

    return {
      items,
    };
  },
};
</script>

<style scoped>
.notif {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.notif-item {
  margin: 1vh 0;
  padding: 1em;
  background-color: #f0f0f0;
  border-radius: 5px;
  text-align: center;
}
</style>