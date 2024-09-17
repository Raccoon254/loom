// src/routes/postRoutes.ts
import { Router } from 'express';
import { PostController } from '../controllers/PostController';

const router = Router();
const postController = new PostController();

router.get('/', (req, res) => postController.index(req, res));
router.get('/:id', (req, res) => postController.show(req, res));
router.post('/', (req, res) => postController.store(req, res));
router.put('/:id', (req, res) => postController.update(req, res));
router.delete('/:id', (req, res) => postController.destroy(req, res));
router.put('/:id/publish', (req, res) => postController.publish(req, res));

export default router;
