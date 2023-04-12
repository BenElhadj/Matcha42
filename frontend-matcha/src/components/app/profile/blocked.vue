<template>
  <v-dialog max-width="550px" v-model="dialog">
    <div class="text-center">
      <v-snackbar v-model="snackbar" :timeout="timeout">
        {{ text }}
        <v-btn color="primary" text @click="snackbar = false">Close</v-btn>
      </v-snackbar>
    </div>
    <template v-slot:activator>
      <v-btn width="400" color="primary" activator v-on="on">Blocked</v-btn>
    </template>
    <v-card>
      <v-card-title class="pb-2">
        <v-toolbar-title>Blocked</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon depressed activator v-on:click="dialog = !dialog">
          <v-icon>close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-row v-for="item in items2" :key="item.id" class="mx-3">
        <v-col>
          <v-avatar size="75">
            <v-img :src="item.pic"></v-img>
          </v-avatar>
        </v-col>
        <v-col>
          <v-card-text class="mt-4">
            <span>{{ item.username }}</span>
          </v-card-text>
        </v-col>
        <v-col>
          <v-btn
            @click="() => ft_unblock(item.id)"
            color="primary"
            width="90%"
            style="margin: 1vh 0"
            activator
            class="mt-5"
          >Unblock</v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>


<script>
  import { ref, onMounted } from 'vue';
  import { unblockUser, getBlockedUsers } from '@/api';
  
  export default {
    name: 'BlockedView',
    created() {
    console.log("Je suis dans le composant @/components/app/profile/blocked.vue");
    },
    setup() {
      const items2 = ref([]);
      const dialog = ref(false);
      const snackbar = ref(false);
      const timeout = ref(8000);
      const text = ref('');
      
      const ft_unblock = async function (id) {
        snackbar.value = true;
        text.value = 'User Unblocked Successfully';
        await unblock(id);
      };
      
      const unblock = async function (id) {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            throw new Error('User not authenticated');
          }
          await unblockUser(token, id);
          await loadBlockedUsers();
        } catch (error) {
          console.log(error);
        }
      };
      
      const loadBlockedUsers = async function () {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            throw new Error('User not authenticated');
          }
          const blockedUsers = await getBlockedUsers(token);
          items2.value = blockedUsers;
        } catch (error) {
          console.log(error);
        }
      };
      
      onMounted(async () => {
        await loadBlockedUsers();
      });
      
      return {
        items2,
        dialog,
        snackbar,
        timeout,
        text,
        ft_unblock,
      };
    },
  };
</script>
