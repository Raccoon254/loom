import express from 'express';
import { User } from './models/User';
import { Post } from './models/Post';
import { generatePrismaSchema } from './utils/schemaGenerator';

const app = express();
app.use(express.json());

// Generate Prisma schema on startup
generatePrismaSchema();

// User routes
app.get('/users', async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

app.get('/users/:id', async (req, res) => {
  const user = await User.findById(Number(req.params.id));
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

app.post('/users', async (req, res) => {
  const user = await User.createUser(req.body);
  res.status(201).json(user);
});

app.get('/users/:id/posts', async (req, res) => {
  const user = await User.getUserWithPosts(Number(req.params.id));
  if (user && user.posts) {
    res.json(user.posts);
  } else {
    res.status(404).json({ error: 'User not found or has no posts' });
  }
});

// Post routes
app.get('/posts', async (req, res) => {
  const posts = await Post.getPublishedPosts();
  res.json(posts);
});

app.get('/posts/:id', async (req, res) => {
  const post = await Post.getPostWithAuthor(Number(req.params.id));
  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ error: 'Post not found' });
  }
});

app.post('/posts', async (req, res) => {
  const post = await Post.createPost(req.body);
  res.status(201).json(post);
});

app.put('/posts/:id/publish', async (req, res) => {
  const post = await Post.publishPost(Number(req.params.id));
  res.json(post);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});