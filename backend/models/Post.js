const Post = function(post) {
    this.id = post.id;
    this.userId = post.userId;
    this.title = post.title;
    this.message = post.message;
    this.imageUrl = post.imageUrl;
    this.date = new Date();
};

module.exports = Post;