<template>
    <div id="login">
        <b-container>
            <div id="logo">
                <img src="../assets/icon-left-font-monochrome-black.svg" alt="">
            </div>
            <b-row class="justify-content-md-center mt-4">
                <b-col col md="8">
                    <b-card header="Groupomania - Connexion"> <!-- header-bg-variant="primary" header-text-variant="white" -->
                        <b-card-text>
                            <b-form @submit="userLogin" class="text-start">
                                <b-form-group label="Email:" class="mb-2">
                                    <b-form-input class="mb-2 mr-sm-2 mb-sm-0" v-model="email" type="email" pattern="^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" required></b-form-input>
                                </b-form-group>
                                <b-form-group label="Mot de passe:" class="mb-2">
                                    <b-form-input class="mb-2 mr-sm-2 mb-sm-0" v-model="password" type="password" required></b-form-input>
                                </b-form-group>
                                <label class="mb-2">Pas encore inscrit ? <router-link to="/signup">S'inscrire</router-link></label>
                                <b-form-group>
                                    <b-button type="submit">Se connecter</b-button>
                                </b-form-group>
                            </b-form>
                            <p class="errorMessage">{{ errorMessage }}</p>
                        </b-card-text>
                    </b-card>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
const axios = require('axios');

export default {
    name: 'Login',
    data() {
        return {
            email: '',
            password: '',
            errorMessage: ''
        }
    },
    methods: {
        /**
        * Fonction de connexion d'un user existant
        * @param {Object} data - Email et password du user
        */
        userLogin(e) {
            e.preventDefault();

            let data = {
                email: this.email,
                password: this.password
            };
            //-- Fonction qui lance la requête Axios POST
            axios.post("http://localhost:3000/user/login", data)
                .then(response => {
                    const user = {
                        token: response.data.token,
                        userId: response.data.userId,
                        //userName: response.data.username,
                        userRole: response.data.role,
                    };
                    //sessionStorage.setItem('isLogged', true);
                    sessionStorage.setItem('user', JSON.stringify(user));
                    this.$router.push('Feed');
                })
                .catch(error => {
                    console.log(error);
                    if (error.response.status === 401) {
                       this.errorMessage = "Mot de passe incorrect !";
                    } else if (error.response.status === 429) {
                        this.errorMessage =  "Vous avez dépassé le nombre maximal de tentatives, merci de réessayer ultérieurement.";
                    } else if (error.response.status === 404) {
                        this.errorMessage = "Cet email est invalide ou ne correspond à aucun utilisateur connu.";
                    }
                })
        }
    },
    /*beforeMount() {
        localStorage.clear();
        sessionStorage.clear();
    },*/
    mounted() {
        //localStorage.clear();
        sessionStorage.clear();
    }
}
</script>

<style lang="scss">
    // #login {
    //     height: 90vh;
    // }
</style>