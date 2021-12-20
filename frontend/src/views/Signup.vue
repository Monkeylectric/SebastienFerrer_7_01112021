<template>
    <div id="signup">
        <b-container>
            <div id="logo">
                <img src="../assets/icon-left-font-monochrome-black.svg" alt="">
            </div>
            <b-row class="justify-content-md-center mt-4">
                <b-col col md="8">
                    <b-card header="Groupomania - Inscription"> <!-- header-bg-variant="primary" header-text-variant="white" -->
                        <b-card-text>
                            <b-form @submit="userSignup" class="text-start">
                                <div class="d-flex justify-content-evenly" id="form-user">
                                    <b-form-group label="Nom:" class="mb-2" id="lastname">
                                        <b-form-input class="mb-2 mr-sm-2 mb-sm-0" v-model="user.lastname" type="text" pattern="^[a-zA-z-éè]{1,15}$" required></b-form-input>
                                    </b-form-group>
                                    <b-form-group label="Prénom:" class="mb-2" id="firstname">
                                        <b-form-input class="mb-2 mr-sm-2 mb-sm-0" v-model="user.firstname" type="text" pattern="^[a-zA-z-éè]{1,15}$" required></b-form-input>
                                    </b-form-group>
                                </div>
                                <b-form-group label="Email:" class="mb-2">
                                    <b-form-input class="mb-2 mr-sm-2 mb-sm-0" v-model="user.email" type="email" pattern="^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([_\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$" required></b-form-input> <!-- ^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$ -->
                                </b-form-group>
                                <b-form-group label="Mot de passe:" class="mb-2">
                                    <b-form-input class="mb-2 mr-sm-2 mb-sm-0" v-model="user.password" type="password" pattern="^(?=.*[\d\W])(?=.*[a-z])(?=.*[A-Z]).{8,100}$" required></b-form-input>
                                    <small>Minimum 8 caractères, 1 chiffre (ou caractère spécial), 1 lettre majuscule et minuscule</small>
                                </b-form-group>
                                <b-form-group label="Verification du mot de passe:" class="mb-2">
                                    <b-form-input class="mb-2 mr-sm-2 mb-sm-0" v-model="user.verifyPassword" type="password" required></b-form-input>
                                </b-form-group>
                                <label class="mb-2">Déjà inscrit ? <router-link to="/">Se connecter</router-link></label>
                                <b-form-group>
                                    <b-button type="submit">S'inscrire</b-button>
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
    name: 'Signup',
    data() {
        return {
            user: {
                lastname: '',
                firstname: '',
                email: '',
                password: '',
                verifyPassword: '',
            },
            errorMessage: '',
        }
    },
    methods: {
        /**
        * Fonction de création d'un nouvel utilisateur
        * @param {Object} data - Données de l'utilisateur
        */
        userSignup(e) {
            e.preventDefault();
            
            if(this.user.password == this.user.verifyPassword){
                let data = {
                    lastname: this.user.lastname,
                    firstname: this.user.firstname,
                    email: this.user.email,
                    password: this.user.password,
                };
                console.log(data);
                //-- Fonction qui lance la requête Axios POST
                axios.post("http://localhost:3000/api/user/signup", data)
                    .then(() => {
                        this.$router.push('/');
                    })
                    .catch( () => {
                        this.errorMessage = "Une erreur s'est produite lors de la création du compte... Veuillez réessayer<br>Erreur: ";
                    });
            }else{
                this.errorMessage = "Confirmation du mot de passe incorrecte !";
            }
        }
    },
}
</script>

<style lang="scss">
    #form-user {
        column-gap: 1vh;
    }
    #logo img {
        width: 40vw;
    }
    #lastname, #firstname {
        width: 50%;
    }
    .card {
        border: 1px solid rgba(255, 255, 255, .2);
        box-shadow: -6px -6px 16px #fff9f9, 6px 6px 16px #FFD7D7;
    }
</style>