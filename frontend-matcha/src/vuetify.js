import { createVuetify } from 'vuetify';
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/lib/components';

export default createVuetify({
  theme: {
    themes: {
      dark: {
        primary: '#E0234E',
        secondary: '#FCF2F6',
        accent: '#131313',
        info: '#131313',
      },
      light: {
        primary: '#E0234E',
        secondary: '#131313',
        accent: '#f3f2f5',
        info: '#656',
      },
    },
  },
  icons: {
    iconfont: 'mdi',
  },
});
