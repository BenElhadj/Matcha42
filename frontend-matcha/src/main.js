import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './vuetify';
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import '@/assets/globalStyles.css';

const app = createApp(App);
app.use(router);
app.use(store);
app.use(vuetify);
app.use(PrimeVue);
app.mount('#app');