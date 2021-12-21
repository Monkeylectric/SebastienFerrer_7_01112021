<template>
    <div id="viewPost">
        <b-container>
            <!-- USER INFOS -->
            <h1 class="viewPostHeader">Modfier la publication</h1>
            <b-row class="justify-content-md-center mt-4">
                <b-col col md="8">
                    <b-card>
                        <b-card-text>
                            <b-form class="text-start" @submit="modifyPost">
                                <div id="imageContainer">
                                    <img id="postImage" :src="post.imageUrl" alt="post image" v-if="post.imageUrl">
                                    <b-form-file v-model="image" plain></b-form-file>
                                </div>
                                <b-form-group label="Titre:" class="mb-2">
                                    <b-form-input class="mb-2 mr-sm-2 mb-sm-0" v-model="post.title" type="text" required></b-form-input>
                                </b-form-group>
                                <b-form-group label="Message:" class="mb-2">
                                    <b-form-textarea class="mb-2 mr-sm-2 mb-sm-0" v-model="post.message" type="text" required></b-form-textarea>
                                </b-form-group>
                                <b-form-group>
                                    <b-button type="submit" variant="outline-primary">Enregistrer les modifications</b-button>
                                </b-form-group>
                                <p class="errorMessage">{{ errorMessage }}</p>
                            </b-form>
                        </b-card-text>
                    </b-card>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
//const axios = require('axios');
import httpResquest from '../httpRequest'

export default {
    name: 'ViewPost',
    data() {
        return {
            image: null,
            errorMessage: '',
            post: {},
        }
    },
    methods: {
        /**
        * Fonction qui récupère les données d'une publication
        * @param {Int} postId - id du post
        * @return {Object} - Informations de la publication
        */
        getOnePost() {
            httpResquest.get(`post/getOnePost/${this.$route.params.id}`, { headers: {
                'Authorization': `Bearer ${this.$parent.token}`
            }})
            .then(response => {
                this.post = response.data.result[0];
            })
            .catch(error => {
                console.log(error);
            })
        },
        /**
        * Fonction qui modifie les informations d'une publication
        * @param {Int} postId - id du post
        * @return {Object} - Informations du post
        */
        modifyPost(e) {
            e.preventDefault();

            let formData = new FormData();
            formData.append("image", this.image);
            formData.append("title", this.post.title);
            formData.append("message",this.post.message);

            httpResquest.put(`post/modifyPost/${this.$route.params.id}`, formData, { headers: {
                'Authorization': `Bearer ${this.$parent.token}`,
                'Content-Type': 'multipart/form-data'
            }})
            .then(() => {
                this.image = null;
                this.getOnePost();
            })
            .catch(error => {
                console.log(error);
            })
        },
    },
    mounted() {
        this.getOnePost();
    },
}
</script>

<style lang="scss">
    .viewPostHeader {
        text-decoration: underline;
    }
    #imageContainer {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        row-gap: 1vh;
        margin: 0 0 2vh 0;
    }
    #postImage {
        width: 70%;
    }
</style>