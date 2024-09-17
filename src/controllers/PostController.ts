// src/controllers/PostController.ts
import { Request, Response } from 'express';
import { Post } from '../models/Post';
import { BaseController } from './BaseController';

export class PostController extends BaseController {
  // Get all published posts
  async index(req: Request, res: Response) {
    try {
      const posts = await Post.getPublishedPosts();
      this.sendSuccessResponse(res, posts);
    } catch (error) {
      this.sendErrorResponse(res, error);
    }
  }

  // Get a single post by ID
  async show(req: Request, res: Response) {
    try {
      const post = await Post.getPostWithAuthor(Number(req.params.id));
      if (post) {
        this.sendSuccessResponse(res, post);
      } else {
        res.status(404).json({ error: 'Post not found' });
      }
    } catch (error) {
      this.sendErrorResponse(res, error);
    }
  }

  // Create a new post
  async store(req: Request, res: Response) {
    try {
      const post = await Post.createPost(req.body);
      res.status(201).json(post);
    } catch (error) {
      this.sendErrorResponse(res, error);
    }
  }

  // Update an existing post
  async update(req: Request, res: Response) {
    try {
      const post = await Post.update(Number(req.params.id), req.body);
      this.sendSuccessResponse(res, post, 'Post updated successfully');
    } catch (error) {
      this.sendErrorResponse(res, error);
    }
  }

  // Delete a post
  async destroy(req: Request, res: Response) {
    try {
      await Post.delete(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      this.sendErrorResponse(res, error);
    }
  }

  // Publish a post
  async publish(req: Request, res: Response) {
    try {
      const post = await Post.publishPost(Number(req.params.id));
      this.sendSuccessResponse(res, post, 'Post published successfully');
    } catch (error) {
      this.sendErrorResponse(res, error);
    }
  }
}
