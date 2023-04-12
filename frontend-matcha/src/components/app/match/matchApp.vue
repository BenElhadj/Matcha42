<template>
<v-row>
  <v-col cols="12" xl="4" lg="4" md="4">
    <v-card color="accent">
      <v-card-title>Match With:</v-card-title>
      <v-divider></v-divider>
      <v-list subheader two-line flat color="accent">
        <v-list-item-group v-model="settings" multiple>
          <v-form method="post">
            <!-- Age -->
            <v-list-item>
              <template>
                <v-list-item-action>
                  <v-checkbox color="primary" v-model="active" value="Age"></v-checkbox>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>Age</v-list-item-title>
                  <v-row>
                    <v-col class="px-4">
                      <v-range-slider id="1" color="primary" v-model="rangeAge" :max="maxAge" :min="minAge" hide-details class="align-center">
                        <template v-slot:prepend>
                          <v-text-field v-model="rangeAge[0]" class="mt-0 pt-0" hide-details single-line type="number" style="width: 60px"></v-text-field>
                        </template>
                        <template v-slot:append>
                          <v-text-field v-model="rangeAge[1]" class="mt-0 pt-0" hide-details single-line type="number" style="width: 60px"></v-text-field>
                        </template>
                      </v-range-slider>
                    </v-col>
                  </v-row>
                </v-list-item-content>
              </template>
            </v-list-item>
            <!-- Fame Rating -->
            <v-list-item>
              <template>
                <v-list-item-action>
                  <v-checkbox color="primary" v-model="active" value="Fame"></v-checkbox>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>Fame Rating</v-list-item-title>
                  <v-row>
                    <v-col class="px-4">
                      <v-range-slider id="1" color="primary" v-model="rangeFame" :max="maxFame" :min="minFame" hide-details class="align-center">
                        <template v-slot:prepend>
                          <v-text-field v-model="rangeFame[0]" class="mt-0 pt-0" hide-details single-line type="number" style="width: 60px"></v-text-field>
                        </template>
                        <template v-slot:append>
                          <v-text-field v-model="rangeFame[1]" class="mt-0 pt-0" hide-details single-line type="number" style="width: 60px"></v-text-field>
                        </template>
                      </v-range-slider>
                    </v-col>
                  </v-row>
                </v-list-item-content>
              </template>
            </v-list-item>
            <!-- Localisation -->
            <v-list-item>
              <template>
                <v-list-item-action>
                  <v-checkbox color="primary" v-model="active" value="Loc"></v-checkbox>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>Localication (Km)</v-list-item-title>
                  <v-row>
                    <v-col class="px-4">
                      <v-range-slider  color="primary" v-model="rangeLoc" :max="maxLoc" :min="minLoc" hide-details class="align-center">
                        <template v-slot:prepend>
                          <v-text-field id="555" v-model="rangeLoc[0]" class="mt-0 pt-0" hide-details single-line type="number" style="width: 60px"></v-text-field>
                        </template>
                        <template v-slot:append>
                          <v-text-field id="556" v-model="rangeLoc[1]" class="mt-0 pt-0" hide-details single-line type="number" style="width: 60px"></v-text-field>
                        </template>
                      </v-range-slider>
                    </v-col>
                  </v-row>
                </v-list-item-content>
              </template>
            </v-list-item>
            <!-- Tags -->
            <v-list-item>
              <template>
                <v-list-item-action>
                  <v-checkbox color="primary" v-model="active" value="Tag"></v-checkbox>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>Tags</v-list-item-title>
                </v-list-item-content>
              </template>
            </v-list-item>
            <v-btn dark width="100%" color="primary" @click="data">Match</v-btn>
          </v-form>
        </v-list-item-group>
      </v-list>
    </v-card>    
  </v-col>
  <v-col cols="12" xl="8" lg="8" md="8">
    <v-card color="accent" class="scroll" height="70%" width="100%">
          <div class="text-center">
            <v-snackbar v-model="snackbar" :timeout="timeout">
              {{ text }}
              <v-btn color="primary" text @click="snackbar = false">Close</v-btn>
            </v-snackbar>
          </div>
          <v-row>
            <v-col align="center"><v-btn @click="sortBy('age')">Age</v-btn></v-col>
            <v-col align="center"><v-btn @click="sortBy('rating')">Fame Rating</v-btn></v-col>
            <v-col align="center"><v-btn @click="sortBy('distance')">Location</v-btn></v-col>
            <v-col align="center"><v-btn @click="sortBy('nb')">Tags</v-btn></v-col>
          </v-row>
      <v-row>
        <v-col v-for="item in items" :key="item.text" cols="12" xs="12" sm="12" md="4" lg="4" xl="4">
          <v-card style="margin: 1vh">
            <center>
              <v-avatar size="150" class="my-2">
                <v-img :src="item.pic"></v-img>
              </v-avatar>
              <v-btn
                @click="() => ft_user(item.id)"
                color="black"
                dark
                width="90%"
                activator
              >Profile</v-btn>
              <v-btn
                @click="() => ft_match(item.id)"
                color="primary"
                dark
                width="90%"
                style="margin: 1vh 0"
                activator
              >Like</v-btn>
              <div class="text-center" style="margin: 1vh">
                <v-rating
                  readonly
                  dense
                  background-color="black"
                  color="primary"
                  v-model="item.rating"
                ></v-rating>
              </div>
              <v-card-text>
                <span>{{ item.username }}</span>
                <span>{{ item.age }}</span>
              </v-card-text>
              <v-card-text>
                <span>{{ item.nbb }}</span>
              </v-card-text>
              <v-card-text>
                <span>{{ item.distancee }}</span>
              </v-card-text>
            </center>
          </v-card>
        </v-col>
        <v-dialog max-width="750px" eager v-model="dialog_user">
          <user :contextId="contextId" />
        </v-dialog>
      </v-row>
    </v-card>      
  </v-col>
</v-row>

</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import user from './user';
import { matchWith, likeUser } from '@/api';

export default defineComponent({
  name: 'MatchWithApp',
  created() {
    console.log("Je suis dans le composant @/components/app/match/matchApp.vue");
  },
  components: { user },
  setup() {
    const sort = ref(true);
    const contextId = ref(null);
    const snackbar = ref(false);
    const timeout = ref(8000);
    const status = ref('login');
    const text = ref('');
    const dialog_user = ref(false);
    const items = ref([]);
    const settings = ref([]);
    const active = ref(['Age', 'Loc', 'Fame', 'Tag']);
    const rangeAge = ref([16, 99]);
    const minAge = ref(16);
    const maxAge = ref(99);
    const rangeFame = ref([1, 5]);
    const minFame = ref(1);
    const maxFame = ref(5);
    const rangeLoc = ref([0, 5000]);
    const minLoc = ref(0);
    const maxLoc = ref(5000);

    onMounted(async () => {
      const token = localStorage.getItem('token');
      const filters = {
        token,
        rangeAge: rangeAge.value,
        rangeLoc: rangeLoc.value,
        rangeFame: rangeFame.value,
        tag: active.value.includes('Tag'),
      };
      const data = await matchWith(filters);
      items.value = data.map((item) => ({
        username: item.username,
        pic: item.pic,
        id: item.id,
        age: item.age,
        distancee: `${item.distance}km`,
        distance: item.distance,
        rating: item.rating,
        nbb: `${item.nb} Tags in common`,
        nb: item.nb,
      }));
    });

    const sortBy = (prop) => {
      sort.value = !sort.value;
      if (sort.value) {
        items.value.sort((a, b) => (a[prop] < b[prop] ? -1 : 1));
      } else {
        items.value.sort((a, b) => (a[prop] < b[prop] ? 1 : -1));
      }
    };

    const ft_user = async (id) => {
      dialog_user.value = true;
      contextId.value = id;
      await user.user(id);
    };

    const ft_match = async (id) => {
      const respons = await likeUser(id);
      user.history(id);
      snackbar.value = true;
      text.value = respons.msg;
    };

    return {
      sort,
      contextId,
      snackbar,
      timeout,
      status,
      text,
      dialog_user,
      items,
      settings,
      active,
      rangeAge,
      minAge,
      maxAge,
      rangeFame,
      minFame,
      maxFame,
      rangeLoc,
      minLoc,
      maxLoc,
      sortBy,
      ft_user,
      ft_match,
    };
  },
});
</script>

<style scoped>
</style>