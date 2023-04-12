<template>
  <v-dialog max-width="550px" v-model="dialog">
    <!-- Snack Bar -->
    <div class="text-center">
      <v-snackbar v-model="snackbar" :timeout="timeout">
        {{ text }}
        <v-btn color="primary" text @click="snackbar = false">Close</v-btn>
      </v-snackbar>
    </div>
    <!-- Modal activator -->
    <template v-slot:activator="{ on }">
      <v-carousel cycle height="300" :show-arrows="false" :hide-delimiters="true">
        <v-carousel-item v-for="(image, i) in img" :key="i">
          <v-img :src="img[i]" height="100%"></v-img>
        </v-carousel-item>
      </v-carousel>
      <v-btn color="primary" v-on="on" width="100%">Change</v-btn>
    </template>
    <!-- Modal Content -->
    <v-card color="accent">
      <v-card-title class="pb-2">
        <v-toolbar-title>Change images</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon depressed activator v-on:click="dialog = !dialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="pt-2">
        <v-form v-model="valid">
          <div v-for="n in 4" :key="n">
            <v-img :src="images[n - 1].path"></v-img>
            <v-row
              class="mt-10 pb-3"
              cols="12"
              xs="6"
              sm="8"
              md="6"
              lg="6"
              xl="6"
            >
              <v-col>
                <v-file-input
                  :rules="rules"
                  v-model="image"
                  accept="image/png, image/jpeg, image/jpg"
                  placeholder="Pick an avatar"
                  prepend-icon="mdi-camera"
                  label="Avatar"
                ></v-file-input>
              </v-col>
              <v-col>
                <v-btn
                  style="float: right"
                  outlined
                  color="primary"
                  class="mt-4"
                  :disabled="!valid"
                  @click="() => await_pic(n)"
                >
                  <v-icon left>mdi-check-bold</v-icon>SAVE
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>

import { ref, onMounted } from 'vue';
import { getProfileCompletion } from '@/api';

export default {
  name: 'PicsView',
  created() {
    console.log("Je suis dans le composant @/components/app/profile/pics.vue");
  },
  setup() {
    const rules = [
      (value) => !!value || 'Avatar is required',
      (value) =>
        !value || value.size < 2000000 || 'Avatar size should be less than 2 MB!',
    ];
    const img = ref([
      'https://images.unsplash.com/photo-1513344756488-b273726a3da6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80',
      'https://images.unsplash.com/photo-1560790171-17a7cd9f55d2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80',
      'https://images.unsplash.com/photo-1515353719550-cf04906a258c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80',
      'https://images.unsplash.com/photo-1489189642444-0709966aec44?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80',
    ]);
    const images = ref([
      {
        path1:
          'https://images.unsplash.com/photo-1513344756488-b273726a3da6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80',
      },
      {
        path2:
          'https://images.unsplash.com/photo-1560790171-17a7cd9f55d2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80',
      },
      {
        path3:
          'https://images.unsplash.com/photo-1515353719550-cf04906a258c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80',
      },
      {
        path4:
          'https://images.unsplash.com/photo-1489189642444-0709966aec44?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80',
      },
    ]);
    const image_id = ref('');
    const image = ref([]);
    const valid = ref(true);
    const dialog = ref(false);
    const snackbar = ref(false);
    const timeout = ref(8000);
    const text = ref('');

    const await_pic = async (id) => {
      const response = await pic(id);
      snackbar.value = true;
      text.value = response.res.data.msg;
    };


    const pic = async (id) => {
        const formData = new FormData();
      formData.append('file', image.value);
      formData.append('id', id);

      try {
        const response = await getProfileCompletion(formData);
        return { success: true, res: response };
      } catch (error) {
        return { success: false, res: error };
      }
    };

    const onFileChange = (e) => {
      const files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      createImage(files[0]);
    };

    const createImage = (file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        image.value = e.target.result;
      };
      reader.readAsDataURL(file);
    };

    const removeImage = () => {
      image.value = '';
    };

    onMounted(() => {
      // Do any necessary actions after component is mounted
    });

    return {
      rules,
      img,
      images,
      image_id,
      image,
      valid,
      dialog,
      snackbar,
      timeout,
      text,
      await_pic,
      pic,
      onFileChange,
      createImage,
      removeImage,
    };
  },
};
</script>