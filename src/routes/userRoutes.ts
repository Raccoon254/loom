import { Router } from 'express';
import { UserController } from '../controllers/UserController';

const router = Router();
const userController = new UserController();

router.get('/', (req, res) => userController.index(req, res));
router.get('/:id', (req, res) => userController.show(req, res));
router.post('/', (req, res) => userController.store(req, res));
router.put('/:id', (req, res) => userController.update(req, res));
router.delete('/:id', (req, res) => userController.destroy(req, res));
router.get('/:id/posts', (req, res) => userController.getUserPosts(req, res));

export default router;
