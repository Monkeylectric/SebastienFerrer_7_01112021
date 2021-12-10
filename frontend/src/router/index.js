import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue')
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () => import(/* webpackChunkName: "about" */ '../views/Signup.vue')
  },
  {
    path: '/feed',
    name: 'Feed',
    component: () => import(/* webpackChunkName: "about" */ '../views/Feed.vue')
  },
  {
    //path: '/profil/:id',
    path: '/profil',
    name: 'Profil',
    component: () => import(/* webpackChunkName: "about" */ '../views/Profil.vue')
  },
  {
    path: '/user/:id',
    name: 'User',
    component: () => import(/* webpackChunkName: "about" */ '../views/User.vue')
  },
  {
    path: '/post/:id',
    name: 'ViewPost',
    component: () => import(/* webpackChunkName: "about" */ '../views/ViewPost.vue')
  },
]

const router = new VueRouter({
  routes,
  scrollBehavior (to) {
    if (to.hash) {
      return {
        selector: to.hash
        // , offset: { x: 0, y: 10 }
      }
    }
  }
})

export default router