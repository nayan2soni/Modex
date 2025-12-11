import { Router } from 'express';
import { createShow, listShows } from '../controllers/adminController';

const router = Router();

router.post('/shows', createShow);
router.get('/shows', listShows);

export default router;
