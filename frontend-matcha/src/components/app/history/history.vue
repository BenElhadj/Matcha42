<template>
  <v-card color="accent" width="100%" height="100%">
    <v-col v-for="item in items" :key="item.id">
        <v-row>
            <v-card style="margin: 1vh" width="100%">
                <v-card-text align="center">
                    <span class="headline">{{ item.act }}</span>
                </v-card-text>
            </v-card>
        </v-row> 
    </v-col>
  </v-card>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getHistoryData } from '@/api';

export default {
  name: "HistoryApp",
  created() {
    console.log("Je suis dans le composant @/components/app/history/history.vue");
  },
  setup() {
    const items = ref([]);

    onMounted(async () => {
      const tmp = this.$cookies.get("token");
      try {
        const data = await getHistoryData(tmp);
        if (data === "Logout") {
          this.$cookies.removeAll();
          this.$router.push("/");
        } else {
          let tmp = [];
          let index = data.length;
          index--;
          for (index; index >= 0; index--) {
            const element = data[index];
            tmp.push({
              act: element.act,
              id: element.id,
            });
          }
          items.value = tmp;
        }
      } catch (err) {
        console.error(err);
      }
    });

    return { items };
  },
};
</script>