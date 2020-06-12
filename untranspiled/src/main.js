import 'bootstrap/dist/css/bootstrap.css';
import BootstrapVue from 'bootstrap-vue';
import Vue from 'vue';
import App from './App.vue';
import router from './router';

//  регистрируем новые компоненты глобально
import Addtask from './components/Addtask.vue';
import Changetask from './components/Changetask.vue';

Vue.use(BootstrapVue);
Vue.config.productionTip = true;

//  регистрируем новые компоненты глобально
Vue.component('addtask', Addtask);
Vue.component('changetask', Changetask);

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
