import express from 'express';
const router = express.Router();

let post = [
    { id: 1, title: "Post one" },
    { id: 2, title: "Post Two" },
    { id: 3, title: "Post Three" },
    { id: 4, title: "Post Four" },
]

// Get all posts
router.get('', (req, res) => {
    const limit = parseInt(req.query.limit);

    if (!isNaN(limit) && limit > 0) {
        res.status(200).json(post.slice(0, limit));
    } else {
        res.status(200).json(post);
    }
});

// Get single posts
router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const p = post.find((p) => p.id === id);

    if (!p) {
        res.status(404).json({ msg: `A post with the id of ${id} was not found` });
    } else {
        res.status(200).json(p);
    }
});

// Create new post
router.post('/', (req, res) => {
    const newPost = {
        id: post.length + 1,
        title: req.body.title,
    };

    if (!newPost.title) {
        return res.status(400).json({ msg: 'Please include a title' });
    }
    post.push(newPost);

    res.status(201).json(post);
});

//update post
router.put('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const p = post.find((p) => p.id === id);

    if (!p) {
        return res.status(404).json({ msg: `Post ${p} not found` });
    }

    p.title = req.body.title;
    res.status(200).json(post);
})

// delete posts
router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const p = post.find((p) => p.id === id);

    if (!p) {
        return res.status(404).json({ msg: `Post ${p} not found` });
    }

    post = post.filter((p) => p.id !== id);
    res.status(200).json(post);
})


export default router;