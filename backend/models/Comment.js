const mysql = require("mysql");

const Comment = function(comment) {
    this.id = comment.id;
    this.postId = comment.postId;
    this.userId = comment.userId;
    this.message = comment.message;
    this.date = new Date();
};

module.exports = Comment;