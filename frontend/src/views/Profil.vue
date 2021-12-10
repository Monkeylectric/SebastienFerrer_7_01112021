<template>
    <div id="profil">
        <b-container>
            <!-- USER INFOS -->
            <h1 class="profilHeader">Mon compte</h1>
            <b-row class="justify-content-md-center mt-4">
                <b-col col md="8">
                    <b-card>
                        <b-card-text>
                            <b-form class="text-start" @submit="modifyUser">
                                <div id="avatarContainer">
                                    <img id="userAvatar" :src="user.avatarUrl" alt="user avatar">
                                    <b-form-file v-model="avatar" plain></b-form-file>
                                </div>
                                <div class="d-flex justify-content-evenly" id="form-user">
                                    <b-form-group label="Nom:" class="mb-2" id="lastname">
                                        <b-form-input class="mb-2 mr-sm-2 mb-sm-0" v-model="user.lastname" type="text"></b-form-input>
                                    </b-form-group>
                                    <b-form-group label="Prénom:" class="mb-2" id="firstname">
                                        <b-form-input class="mb-2 mr-sm-2 mb-sm-0" v-model="user.firstname" type="text"></b-form-input>
                                    </b-form-group>
                                </div>
                                <b-form-group label="Email:" class="mb-2">
                                    <b-form-input class="mb-2 mr-sm-2 mb-sm-0" v-model="user.email" type="email"></b-form-input>
                                </b-form-group>
                                <b-form-group label="Mot de passe:" class="mb-2">
                                    <b-form-input class="mb-2 mr-sm-2 mb-sm-0" v-model="password" type="password" required></b-form-input>
                                </b-form-group>
                                <!-- <b-form-group label="Nouveau mot de passe:" class="mb-2">
                                    <b-form-input class="mb-2 mr-sm-2 mb-sm-0" v-model="newPassword" type="password"></b-form-input>
                                </b-form-group>
                                <b-form-group label="Confirmer le nouveau mot de passe:" class="mb-2">
                                    <b-form-input class="mb-2 mr-sm-2 mb-sm-0" type="password"></b-form-input>
                                </b-form-group> -->
                                <b-form-group>
                                    <b-button type="submit" variant="outline-primary">Enregistrer les modifications</b-button>
                                    <b-button variant="danger" @click="deleteUser">Supprimer le compte</b-button>
                                </b-form-group>
                                <p class="errorMessage">{{ errorMessage }}</p>
                            </b-form>
                        </b-card-text>
                    </b-card>
                </b-col>
            </b-row>
        </b-container>
        <!-- USER POSTS -->
        <div id="userPostsContainer">
            <h1 class="profilHeader">Mes Publications</h1>
            <div id="userPosts">
                <div class="userPost" v-for="post in posts" :key="post.id">
                    <b-card :title="post.title" :img-src="post.imageUrl" img-alt="Image" img-bottom tag="article" style="max-width: 20rem;" class="mb-2 userPostCard">
                        <b-card-text class="cardText">{{post.message}}</b-card-text>
                        <router-link :to="{ name: 'Feed', hash: '#post'+post.id}">Voir la publication</router-link>
                    </b-card>
                    <router-link :to="{ name: 'ViewPost', params: { id: post.id }}"><b-button variant="outline-primary">Modifier</b-button></router-link>
                    <b-button variant="danger" @click="deletePost(post.id)">Supprimer</b-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
const axios = require('axios');

export default {
    name: 'Profil',
    data() {
        return {
            userLogged: null,
            password: '',
            avatar: null,
            errorMessage: '',
            //newPassword: "",
            user: {},
            posts: []
        }
    },
    methods: {
        /**
        * Fonction qui récupère les données d'un utilisateur
        * @param {Int} userId - id de l'utilisateur
        * @return {Object} - Informations de l'utilisateur ciblé
        */
        getUser() {
            axios.get(`http://localhost:3000/user/getUser/${this.userLogged.userId}`, { headers: {
                'Authorization': `Bearer ${this.userLogged.token}`
            }})
            .then(response => {
                this.user = response.data.result[0];
                this.getUserPosts();
            })
            .catch(error => {
                if (error.response.status === 404) {
                    this.errorMessage = "Utilisateur introuvable !";
                }
            })
        },
        /**
        * Fonction qui récupère les posts d'un utilisateur
        * @param {Int} userId - id de l'utilisateur
        * @return {Object} - Posts de l'utilisateur ciblé
        */
        getUserPosts() {
            axios.get(`http://localhost:3000/user/getUserPosts/${this.userLogged.userId}` , { headers: {
                'Authorization': `Bearer ${this.userLogged.token}`
            }})
            .then(response => {
                this.posts = response.data.result;
            })
            .catch(error => {
                if (error.response.status === 404) {
                    this.errorMessage = "Utilisateur introuvable !";
                }
            })
        },
        /**
        * Fonction qui modifie les informations d'un utilisateur
        * @param {Int} userId - id de l'utilisateur
        * @return {Object} - Informations de l'utilisateur ciblé
        */
        modifyUser(e) {
            e.preventDefault();

            let formData = new FormData();
            formData.append("image", this.avatar);
            formData.append("firstname", this.user.firstname);
            formData.append("lastname",this.user.lastname);
            formData.append("email",this.user.email);
            formData.append("password",this.password);

            axios.put(`http://localhost:3000/user/modifyUser/${this.userLogged.userId}`, formData, { headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${this.userLogged.token}`
            }})
            .then(() => {
                this.avatar = null;
                this.password = '';
                this.errorMessage = '';
                this.getUser();
            })
            .catch(error => {
                console.log(error);
            })
        },
        /**
        * Fonction qui supprime un utilisateur
        * @param {Int} userId - id de l'utilisateur
        */
        deleteUser() {
            let valid = confirm('Etes-vous sûr de vouloir supprimer votre compte ?');

            let data = {
                password: this.password
            }

            if(valid == true){
                axios.delete(`http://localhost:3000/user/deleteUser/${this.userLogged.userId}`, { data, headers: {
                    'Authorization': `Bearer ${this.userLogged.token}`,
                    'Content-Type': 'application/json'
                }})
                .then(() => {
                    this.$router.push('/');
                })
                .catch(error => {
                    if (error.response.status === 401) {
                        console.log(error);
                        this.errorMessage = "Mot de passe incorrect !";
                    } else if (error.response.status === 404) {
                        this.errorMessage =  "Utilisateur introuvable !";
                    } else if (error.response.status === 500) {
                        this.errorMessage = "Erreur lors de la vérification du mot de passe...";
                    }
                })
            }
        },
        /**
        * Fonction qui supprime un post
        * @param {Int} userId - id de l'utilisateur
        */
        deletePost(id) {
            let valid = confirm('Etes-vous sûr de vouloir supprimer ce post ?');

            if(valid == true){
                axios.delete(`http://localhost:3000/post/deletePost/${id}`, { headers: {
                    'Authorization': `Bearer ${this.userLogged.token}`
                }})
                .then(() => {
                    this.getUser();
                })
                .catch(error => {
                    console.log(error);
                    /*if (error.response.status === 400) {
                        this.errorMessage = "Une erreur s'est produite lors de la suppression de la publication";
                    }*/
                })
            }
        }
    },
    mounted() {
        this.userLogged = JSON.parse(sessionStorage.getItem('user'));
        this.getUser();
    },
    beforeupdated() {
        this.getUser();
    }
}
</script>

<style lang="scss">
    .profilHeader {
        text-decoration: underline;
    }
    #avatarContainer {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        row-gap: 1vh;
        margin: 0 0 2vh 0;
    }
    #userAvatar {
        width: 25%;
    }
    #form-user {
        column-gap: 1vh;
    }
    #lastname, #firstname {
        width: 50%;
    }

    #userPostsContainer {
        margin: 2vh 0 0 0;
    }
    #userPosts {
        display: flex;
        justify-content: center;
        column-gap: 20px;
        margin: 0 0 5vh 0;

        .userPost {
            height: fit-content;
            margin-bottom: 2vh;

            .userPostCard {
                border-radius: 10px;
                border: 1px solid rgba(255, 255, 255, .2);
                box-shadow: -6px -6px 16px #fff9f9, 6px 6px 16px #FFD7D7;
            }
        }

        img {
            height: 200px;
            object-fit: cover;
            object-position: center;
        }
    }
    .cardText {
        text-align: justify;
        text-overflow:ellipsis;
        overflow:hidden;
        display: -webkit-box;
        -webkit-line-clamp: 5;
        -webkit-box-orient: vertical;
        white-space: normal;
    }
</style>