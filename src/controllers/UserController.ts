import { Request, Response } from 'express';
import { User } from '../models/User';
import { BaseController } from './BaseController';

export class UserController extends BaseController {
  // Get all users
  async index(req: Request, res: Response) {
    try {
      const users = await User.findAll();
      this.sendSuccessResponse(res, users);
    } catch (error) {
      this.sendErrorResponse(res, error);
    }
  }

  // Get a single user by ID
  async show(req: Request, res: Response) {
    try {
      const user = await User.findById(Number(req.params.id));
      if (user) {
        this.sendSuccessResponse(res, user);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      this.sendErrorResponse(res, error);
    }
  }

  // Create a new user
  async store(req: Request, res: Response) {
    try {
      const user = await User.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      this.sendErrorResponse(res, error);
    }
  }

  // Update an existing user
  async update(req: Request, res: Response) {
    try {
      const user = await User.update(Number(req.params.id), req.body);
      this.sendSuccessResponse(res, user, 'User updated successfully');
    } catch (error) {
      this.sendErrorResponse(res, error);
    }
  }

  // Delete a user
  async destroy(req: Request, res: Response) {
    try {
      await User.delete(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      this.sendErrorResponse(res, error);
    }
  }

  // Get a user's posts
  async getUserPosts(req: Request, res: Response) {
    try {
      const user = await User.getUserWithPosts(Number(req.params.id));
      if (user && user.posts) {
        this.sendSuccessResponse(res, user.posts);
      } else {
        res.status(404).json({ error: 'User not found or has no posts' });
      }
    } catch (error) {
      this.sendErrorResponse(res, error);
    }
  }
}
