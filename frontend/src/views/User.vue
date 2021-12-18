<template>
    <div id="user">
        <!-- USER INFOS -->
        <div class="container">
            <!--<p>{{this.$route.params.id}}</p>-->
            <div id="userHeader">
                <img :src="user.avatarUrl" alt="user avatar">
            </div>
            <div id="userMain">
                <div id="username">
                    <div id="userFirstname"><span class="usernameHeader">Prénom:</span><br>{{user.firstname}}</div>
                    <div id="userLastname"><span class="usernameHeader">Nom:</span><br>{{user.lastname}}</div>
                </div>
                <div id="userEmail"><span class="userEmailHeader">Adresse Mail:</span><br>{{user.email}}</div>
            </div>
        </div>
        <hr>
        <!-- USER POSTS -->
        <div id="userPostsContainer">
            <h2 class="userPostHeader">Publication(s) de {{user.firstname}}:</h2>
            <div id="userPosts">
                <div class="userPost" v-for="post in posts" :key="post.id">
                    <b-card :title="post.title" :img-src="post.imageUrl" img-alt="Image" img-bottom tag="article" style="max-width: 20rem;" class="mb-2 userPostCard">
                        <b-card-text class="cardText">{{post.message}}</b-card-text>
                        <router-link :to="{ name: 'Feed', hash: '#post'+post.id}">Voir la publication</router-link>
                    </b-card>
                    <b-button v-if="isAdmin" variant="danger" @click="deletePost(post.id)">Supprimer la publication</b-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
//const axios = require('axios');
import httpResquest from '../httpRequest'

export default {
    name: 'User',
    data() {
        return {
            id: 0,
            isAdmin: false,
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
            httpResquest.get(`user/getUser/${this.$route.params.id}`)
            .then(response => {
                this.user = response.data.result[0];
                this.getUserPosts();
            })
            .catch(error => {
                console.log(error);
            })
        },
        /**
        * Fonction qui récupère les posts d'un utilisateur
        * @param {Int} userId - id de l'utilisateur
        * @return {Object} - Posts de l'utilisateur ciblé
        */
        getUserPosts() {
            httpResquest.get(`user/getUserPosts/${this.$route.params.id}`)
            .then(response => {
                //console.log(response.data);
                this.posts = response.data.result;
            })
            .catch(error => {
                console.log(error);
            })
        },
        /**
        * Fonction qui supprime un post
        * @param {Int} userId - id de l'utilisateur
        */
        deletePost(id) {
            let valid = confirm('Etes-vous sûr de vouloir supprimer ce post ?');
            if(valid == true){
                httpResquest.delete(`http://localhost:3000/post/deletePost/${id}`)
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
        if(JSON.parse(sessionStorage.getItem('user')).userRole == 'admin') {
            this.isAdmin = true;
        }
        this.getUser();
    },
    beforeupdated() {
        //this.getUser();
    }
}
</script>

<style lang="scss">
    .userPost {
        border-radius: 10px;
        border: 1px solid rgba(255, 255, 255, .2);
        box-shadow: -6px -6px 16px #fff9f9, 6px 6px 16px #FFD7D7;
    }
    #userHeader {
        width: 100%;
        display: flex;
        justify-content: center;
        margin: 5vh 0 2vh 0;

        img {
            width: 20%;
        }
    }
    #username {
        display: flex;
        justify-content: center;
        column-gap: 5vh;
        font-size: 1.8rem;

        .usernameHeader {
            font-weight: bold;
            text-decoration: underline;
        }
    }
    #userEmail {
        font-size: 1.8rem;

        .userEmailHeader {
            font-weight: bold;
            text-decoration: underline;
        }
    }

    hr {
        width: 90%;
        margin: 3vh auto;
        background: #000;
        border: 1px solid #000;
    }

    #userPostsContainer {
        margin: 2vh 0 0 0;
    }
    .userPostHeader {
        margin-bottom: 3vh !important;
        text-decoration: underline;
    }
    #userPosts {
        display: flex;
        justify-content: center;
        column-gap: 20px;
        margin: 0 0 5vh 0;

        .userPost {
            height: fit-content;
            border-radius: 10px;
            border: 1px solid rgba(255, 255, 255, .2);
            margin-bottom: 2vh;

            .userPostCard {
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