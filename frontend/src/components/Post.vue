<template>
    <div class="post" :id="'post'+postId">
        <div class="postHeader">
            <div class="userPostImg">
                <img class="userImg" :src="avatar" alt="User avatar">
            </div>
            <div class="userPostName"><router-link :to="{ name: 'User', params: { id: userId }}">{{userName}}</router-link></div>
        </div>
        <div class="postMain">
            <h2 class="postTitle">{{title}}</h2>
            <div class="postMessage">{{message}}</div>
            <div class="postImg" v-if="image">
                <img :src="image" alt="Post image">
            </div>
        </div>
        <div class="postFooter">
            <div class="postDate"></div>
        </div>
        <br>
        <div class="commentsContainer">
            <div v-if="comments.length > 0">
                <div class="commentHeader">Commentaire(s)</div>
                <div class="eachCommentContainer">
                    <div v-for="comment in comments" :key="comment.id" class="comment">
                            <div class="commentUsername"><router-link :to="{ name: 'User', params: { id: comment.userId }}">{{comment.firstname}} {{comment.lastname}}</router-link></div>
                            <div class="commentMessage">{{comment.message}}</div>
                            <span class="commentDelete" @click="deleteComment(comment.id)" v-if="$root.userId == comment.userId || userRole == 'admin'">X</span>
                    </div>
                </div>
            </div>
            <hr>
            <div class="commentForm"> <!-- v-if="$root.isLogged" -->
                <div class="userName"></div>
                <b-form class="postCommentForm" @submit="postComment">
                    <!-- <label for="comment">Votre commentaire:</label> -->
                    <b-form-textarea id="comment" class="mb-2 mr-sm-2 mb-sm-0" type="text" v-model="newComment" placeholder="Votre commentaire..." minlength="1" maxlength="255" required></b-form-textarea>
                    <b-button type="submit">Commenter</b-button>
                </b-form>
            </div>
        </div>
    </div>
</template>

<script>
//import axios from 'axios'
import httpResquest from '../httpRequest'

export default {
    name: "Post",
    props: {
        userId: { type: Number },
        userName: { type: String },
        postId: { type: Number },
        title: { type: String },
        message: { type: String },
        image: { type: String },
        avatar: { type: String }
    }, 
    data() {
        return {
            id: this.postId,
            userRole: null,
            newComment: '',
            comments: [],
        }
    },
    methods : {
        getComments() {
            httpResquest.get(`comment/${this.id}`)
            .then(response => {
                this.comments = response.data.result;
            })
            .catch(err => {
                console.log(err);
            })
        },
        postComment(e) {
            e.preventDefault();

            let comment = {
                postId: this.id,
                message: this.newComment,
            }

            httpResquest.post('comment/createComment', comment)
            .then(() => {
                this.newComment = '';
                this.getComments();
            })
            .catch(err => {
                console.log(err)
            })
        },
        deleteComment(commentId) {
            let valid = confirm('Etes-vous sûr de vouloir supprimer ce commentaire ?');
            if(valid == true){
                httpResquest.delete(`comment/deleteComment/${commentId}`)
                .then(() => {
                    console.log("Commentaire bien supprimé !");
                    this.getComments();
                })
                .catch(err => {
                    console.log(err);
                })
            }
        }
    },
    mounted() {
        if(sessionStorage.getItem('user')){
            this.userRole = JSON.parse(sessionStorage.getItem('user')).userRole;
        }
        this.getComments();
    }
}
</script>

<style lang="scss">
    a {
        color: initial;
        text-decoration: none;

        &:hover {
            color: #fdb8b8;
        }
    }

    .post {
        //border: 1px solid #AAA;
        border-radius: 10px;
        width: 60%;
        padding: 1rem;
        margin-bottom: 20px;
        background: #FFF;
        border: 1px solid rgba(255, 255, 255, .2);
        box-shadow: -6px -6px 16px #fff9f9, 6px 6px 16px #FFD7D7;
    }
    .postHeader{
        display: flex;
        height: 50px;
        align-items: center;
        column-gap: 10px;

        .userPostName {
            font-weight: bold;
            font-size: 1.2rem;
        }
    }
    .userPostImg{
        width: 50px;
        height: 50px;
    }
    .userImg {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
    }

    /*.postMain {

    }*/
    .postTitle{
        text-align: left;
        margin: 15px 0 5px 0;
    }
    .postMessage{
        text-align: justify;
        margin-bottom: 10px;
    }
    .postImg {
        height: 500px;
    }
    .postImg img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
    }

    .commentHeader {
        text-align: left;
        font-size: bold;
        text-decoration: underline;
        font-size: 1.5rem;
    }
    .eachCommentContainer {
        display: flex;
        flex-direction: column;
        row-gap: 1vh;
        text-align: start;
        margin: 1vh 0 1vh 0;
    }
    .comment {
        background: #EEE;
        border-radius: 10px;
        padding: .5rem;
        position: relative;

        .commentUsername {
            font-weight: bold;
            text-decoration: underline;
        }

        .commentDelete {
            position: absolute;
            top: 5px;
            right: 10px;
            cursor: pointer;
        }
    }

    .postCommentForm {
        display: flex;
        flex-direction: column;
        row-gap: 10px;
    }

    @media screen and (max-width: 900px) {
        .post {
            width: 100%;
        }
    }
</style>