import { Router } from 'express';
import { UserController } from '../../controllers/v2/user.controller';

const router = Router();

router.get('/users', UserController.getAllUsers);

export default router;