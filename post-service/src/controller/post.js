const Post = require('../models/post.models');
const RabbitMQEvent = require('../utills/rabbitmq');

async function invalidPostCache(req) {
    const keys = await req.redisClient.keys('posts:*');
    if (keys.length > 0) {
        await req.redisClient.del(keys);
    }
}

async function createPost(req, res) {
    try {
        const post = new Post({
            user: '67e25e88b7f5777f2bca5eb4',
            content: req.body.content,
            mediaURL: req.body.mediaURL,
            public_id: req.body.public_id
        });

        const savedPost = await post.save();

        // Call the function directly instead of using 'this'
        await invalidPostCache(req);

        res.status(201).json({ message: 'Post created successfully', post: savedPost });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function getPosts(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startIndex = (page - 1) * limit;
        const cacheKey = `posts:${page}:${limit}`;

        // Check cache
        const cachedPost = await req.redisClient.get(cacheKey);
        if (cachedPost) return res.json(JSON.parse(cachedPost));

        // Fetch from database
        const posts = await Post.find({})
            .sort({ createdAt: -1 })
            .skip(startIndex)
            .limit(limit);

        const totalNoOfPosts = await Post.countDocuments();
        const result = {
            posts,
            currentPage: page,
            totalPages: Math.ceil(totalNoOfPosts / limit),
            totalPost: totalNoOfPosts
        };

        // Store result in cache for 5 minutes
        await req.redisClient.set(cacheKey, JSON.stringify(result), 'EX', 300);

        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
async function getSinglePost(req, res) {
    try {
        const postId = req?.params.id;
        const cacheKey = `post:${postId}`
        const cachepost = await req.redisClient.get(cacheKey);
        if (cachepost) return res.status(200).json(JSON.parse(cachepost))
        const singlePost = await Post.findById(postId);
        if (!singlePost) return res.status(404).json("Post is not found")
        await req.redisClient.set(cacheKey, JSON.stringify(singlePost), 'EX', 300);
        res.status(200).json(singlePost);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
async function deletePost(req, res) {
    try {
        const postId = req?.params?.id;
        if (!postId) {
            return res.status(400).json({ error: "Post ID is required" });
        }

        const cacheKey = `post:${postId}`;
        const PostDetail = await Post.findById({ _id: postId });
        const deleteResult = await Post.deleteOne({ _id: postId });

        if (deleteResult.deletedCount === 0) {
            return res.status(404).json({ error: "Post not found" });
        }

        // Remove from cache
        await req.redisClient.del(cacheKey);
        await RabbitMQEvent.publicEvent('post.deleted', { postId:postId,userId:PostDetail.user });
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
module.exports = { invalidPostCache, createPost, getPosts, getSinglePost, deletePost };
