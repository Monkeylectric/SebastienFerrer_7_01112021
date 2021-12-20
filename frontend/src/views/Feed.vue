<template>
    <div>
        <div id="feed" class="container">
            <b-form id="newPostForm" @submit="postMessage"> <!-- v-if="$root.isLogged" -->
                <label for="setPost" id="setPostHeader">Publier un message:</label>
                <b-form-input class="mb-2 mr-sm-2 mb-sm-0" v-model="titleToPost" type="text" placeholder="Votre titre..." maxlength="255" required></b-form-input>
                <b-form-textarea id="comment" class="mb-2 mr-sm-2 mb-sm-0" type="text" v-model="messageToPost" placeholder="Enter un message..." maxlength="1500" required></b-form-textarea>
                <b-form-file v-model="postFile" plain></b-form-file>
                <b-button type="submit">Publier</b-button>
                <p class="errorMessage">{{ errorMessage }}</p>
            </b-form>
            <Post v-for="post in posts"
            :key="post.id"
            :postId="post.id"
            :userName="post.firstname + ' ' + post.lastname"
            :title="post.title"
            :message="post.message"
            :image="post.imageUrl"
            :avatar="post.avatarUrl"
            :userId="post.userId" />
        </div>
    </div>
</template>

<script>
import Post from '@/components/Post.vue'
import httpResquest from '../httpRequest'

//const axios = require('axios');

export default {
    name: 'Feed',
    components: {
        Post
    },
    data() {
        return {
            titleToPost: '',
            messageToPost: '',
            postFile: null,
            errorMessage: '',
            posts: []
        }
    },
    methods: {
        getAllPosts(){
            httpResquest.get('post/getAllPost', { headers: {
                'Authorization': `Bearer ${this.$parent.token}`
            }})
            .then(response => {
                this.posts = response.data.result; 
            })
            .catch(error => {
                console.log(error);
            })
        },
        postMessage(e) {
            e.preventDefault();

            let formData = new FormData();
            formData.append("title", this.titleToPost);
            formData.append("message", this.messageToPost);
            formData.append("image", this.postFile);

            httpResquest.post('post/createPost', formData, { headers: {
                'Authorization': `Bearer ${this.$parent.token}`,
                'Content-Type': 'multipart/form-data'
            }})
            .then(() => {
                this.titleToPost = '';
                this.messageToPost = '';
                this.postFile = null;
                this.getAllPosts();
            })
            .catch(error => {
                console.log(error);
                if (error.response.status === 404) {
                    this.errorMessage = "Utilisateur introuvable !";
                } else if (error.response.status === 400) {
                    this.errorMessage =  "Errueur lors de la création du post...";
                }
            })
        },
    },
    beforeMount() {
        if(sessionStorage.getItem('user')) {
            this.$parent.userId = JSON.parse(sessionStorage.getItem('user')).userId;
            this.$parent.token = JSON.parse(sessionStorage.getItem('user')).token;
        }
    },
    mounted() {
        if(sessionStorage.getItem('user')) {
            this.$parent.userId = JSON.parse(sessionStorage.getItem('user')).userId;
            this.$parent.token = JSON.parse(sessionStorage.getItem('user')).token;
        }
        this.getAllPosts();
    }
}
</script>

<style lang="scss">
    #feed {
        display: flex;
        flex-direction: column;
        align-items: center;
        /*row-gap: 20px;*/
        margin-top: 20px;
    }

    #newPostForm {
        display: flex;
        flex-direction: column;
        row-gap: 1vh;
        width: 60%;
        margin: 1vh 0 5vh 0;
        padding: 10px;
        background: #FFF;
        border: 1px solid rgba(255, 255, 255, .2);
        box-shadow: -6px -6px 16px #fff9f9, 6px 6px 16px #FFD7D7;
        border-radius: 10px;

        #setPostHeader {
            font-weight: bold;
            font-size: 1.8rem;
            text-decoration: underline;
        }
    }

    @media screen and (max-width: 900px) {
        #newPostForm {
            width: 100%;
        }
    }
</style>