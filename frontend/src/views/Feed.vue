<template>
    <div>
        <div id="feed" class="container">
            <b-form id="newPostForm" @submit="postMessage" v-if="isLogged">
                <label for="setPost" id="setPostHeader">Publier un message:</label>
                <b-form-input class="mb-2 mr-sm-2 mb-sm-0" v-model="titleToPost" type="text" placeholder="Votre titre..." required></b-form-input>
                <b-form-textarea id="comment" class="mb-2 mr-sm-2 mb-sm-0" type="text" v-model="messageToPost" placeholder="Enter un message..." required></b-form-textarea>
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
        <!-- <Footer /> -->
    </div>
</template>

<script>
import Post from '@/components/Post.vue'
//import Footer from '@/components/Footer.vue'

const axios = require('axios');

export default {
    name: 'Feed',
    components: {
        Post,
        //Footer
    },
    data() {
        return {
            userId: null,
            tokenToCheck: null,
            isLogged: false,
            titleToPost: '',
            messageToPost: '',
            postFile: null,
            errorMessage: '',
            posts: []
        }
    },
    methods: {
        getAllPosts(){
            axios.get('http://localhost:3000/post/getAllPost', { 
                headers: {
                    'Authorization': `Bearer ${this.tokenToCheck}`
                }
            })
            .then(response => {
                //console.log(response.data.result);
                this.posts = response.data.result; 
            })
            .catch(error => {
                console.log(error);
            })
        },
        postMessage(e) {
            e.preventDefault();

            let formData = new FormData();
            formData.append ("userId", this.userId);
            formData.append("title", this.titleToPost);
            formData.append("message", this.messageToPost);
            formData.append("image", this.postFile);

            axios.post('http://localhost:3000/post/createPost', formData, { 
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${this.tokenToCheck}`
                }
            })
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
    mounted() {
        if(sessionStorage.getItem('user')) {
            this.userId = JSON.parse(sessionStorage.getItem('user')).userId;
            this.tokenToCheck = JSON.parse(sessionStorage.getItem('user')).token;
            this.isLogged = JSON.parse(sessionStorage.getItem('isLogged'));
        }
        this.getAllPosts();
    },
    /*beforeupdated() {
        this.getAllPosts();
    }*/
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