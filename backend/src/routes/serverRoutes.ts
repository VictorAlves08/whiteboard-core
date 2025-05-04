import { Router } from 'express';
import { serverController } from '../controllers/serverController';

const router = Router();

router.get('/servers', async (req, res) => {
  await serverController.fetch(req, res);
});

export default router;