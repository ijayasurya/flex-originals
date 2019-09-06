import Vue from 'vue';
import Router from 'vue-router';
import Routers from './routers/routers';
import { api } from './app/Api';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: Routers
});

router.beforeEach(async (to, from, next) => {
  if (to.name) {
    api.Nprogress.start();
  }
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!(await api.isLogged())) {
      if (to.name != 'login' && to.name != 'signup') {
        next({
          path: '/login',
          query: {
            redirect: to.fullPath
          }
        });
      } else {
        next();
      }
    } else if (to.name == 'login' || to.name == 'signup') {
      next({
        path: '/'
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

router.afterEach(() => {
  api.Nprogress.done();
});

export default router;
