import Vue from 'vue';
import VueRouter from 'vue-router';
import Todos from '../components/Todos.vue';

Vue.use(VueRouter);

// export default new VueRouter({
//   mode: 'history',
//   base: process.env.BASE_URL,
//   routes: [
//     {
//       path: '/Skillfactory-module-c4_11-YeSergey',
//       name: 'todos',
//       component: Todos,
//     },
//   ],
// });

export default new VueRouter({
  mode: 'history',
  routes: [
    { path: '*', component: Todos },
  ],
});
