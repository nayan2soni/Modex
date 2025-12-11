import { Router } from 'express';
import { listShows, getShowSeats, bookSeats, getBooking } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.get('/shows', listShows);
router.get('/shows/:id/seats', getShowSeats);
router.post('/shows/:id/book', protect, bookSeats);
router.get('/booking/:bookingId', getBooking);

export default router;
