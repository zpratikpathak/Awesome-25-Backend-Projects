const posts = [];
exports.getPosts = () => posts;
exports.createPost = (data) => {
    const post = { id: require('node:crypto').randomUUID(), title: data.title, content: data.content };
    posts.push(post);
    return post;
};
