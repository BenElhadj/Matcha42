import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import PrimeVue from 'primevue/config';
import VueCookies from 'vue-cookies'
import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import '@/assets/globalStyles.css';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/lib/components'
import * as directives from 'vuetify/lib/directives'
import 'vuetify/dist/vuetify.min.css'
const app = createApp(App);
const vuetify = createVuetify({
    components,
    directives,
  });
app.use(router);
app.use(store);
app.use(vuetify);
app.use(PrimeVue);
app.use(VueCookies);
app.mount('#app');