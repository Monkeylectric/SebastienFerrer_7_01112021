<template>
    <div id="navbar">
        <b-navbar id="nav" toggleable="lg" variant="faded" type="light">
            <b-navbar-brand href="#">
                <img src="../assets/icon.svg" class="d-inline-block align-top" alt="logo">
                Groupomania
            </b-navbar-brand>

            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav id="nav-link">
                    <router-link to="/feed">Fil d'actualités</router-link>
                    <router-link to="/profil">Mon compte</router-link>
                    <router-link to="/">Se déconneter</router-link>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
    </div>
</template>

<script>
export default {
    name: "NavbarFeed",
    //props: [], 
    /*data() {
        return {
            userId: null,
        }
    },
    methods : {
        userConnected() {
            if(sessionStorage.getItem('user')){
                this.userId = JSON.parse(sessionStorage.getItem('user')).userId;
                //this.userId = sessionStorage.getItem('userId');
            }
        }
    },
    mounted() {
        this.userConnected();
    }*/
}
</script>

<style lang="scss">
    #nav {
        padding: 10px;
        height: 5vh;

        img {
            width: 30px;
            height: 30px;
        }

        #nav-link {
            margin-left: auto; 
            margin-right: 0;
            column-gap: 10px;
        }
    }
</style>