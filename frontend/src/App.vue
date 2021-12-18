<template>
    <div id="app">
        <NavbarFeed v-if="isLogged" />
        <Navbar v-else />
        <router-view />
    </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import NavbarFeed from '@/components/NavbarFeed.vue'

export default {
    components: {
        Navbar,
        NavbarFeed,
    },
    data() {
        return {
            isLogged: null,
        }
    },
    mounted() {
        if(sessionStorage.getItem('user')) {
            this.isLogged = true;
        }else {
            this.isLogged = null;
        }
    },
    updated() {
        if(sessionStorage.getItem('user')) {
            this.isLogged = true;
        }else {
            this.isLogged = null;
        }
    },
}
</script>

<style lang="scss">
    /* Works on Firefox */
    * {
        scrollbar-width: thin;
        scrollbar-color: #fdb8b8 #FFD7D7;
    }

    /* Works on Chrome, Edge, and Safari */
    *::-webkit-scrollbar {
        width: 8px;
    }

    *::-webkit-scrollbar-track {
        background: #FFD7D7;
    }

    *::-webkit-scrollbar-thumb {
        background-color: #fdb8b8;
        border-radius: 20px;
        border: 1px solid #FFD7D7;
    }

    html, body {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        background: #fff4f4 !important;
    }

    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }

    #nav {
        padding: 30px;
        background: #FFF;
        border-bottom: 1px solid #FFD7D7;

        a {
            font-weight: bold;
            color: #2c3e50;
            text-decoration: none;

            /*&.router-link-active {
                color: #fdb8b8 !important;
            }*/

            &.router-link-exact-active {
                color: #fdb8b8 !important;
            }
        }
    }

    #logo {
        margin-top: 3vh;
    }

    .errorMessage {
        color: red;
        font-weight: bold;
    }

    /*.btn-groupomania {
        background: #fdb8b8 !important;
        color: #333 !important;
        font-weight: bold !important;
    }*/

    @media screen and (max-width: 900px) {
        #nav {
            height: auto;
        }
    }
</style>
