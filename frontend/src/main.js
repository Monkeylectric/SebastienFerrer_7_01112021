import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import { BootstrapVue, BootstrapVueIcons  } from 'bootstrap-vue'

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App),
    /*data() {
        return {
            userId: null,
            token: null,
        }
    },
    mounted() {
        this.setAuth();
    },
    updated() {
        this.setAuth();
    },
    methods: {
        setAuth() {
            if(sessionStorage.getItem('user')) {
                this.userId = JSON.parse(sessionStorage.getItem('user')).userId;
                this.token = JSON.parse(sessionStorage.getItem('user')).token;
            }else {
                this.userId = null;
                this.token = null;
            }
        }
    },
    computed: {
        isLogged() {
            return this.userId != null;
        }
    }*/
}).$mount('#app')