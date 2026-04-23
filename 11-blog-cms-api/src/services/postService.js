const posts = [];
exports.getPosts = () => posts;
exports.createPost = (data) => {
    const post = { id: Date.now(), ...data };
    posts.push(post);
    return post;
};
