import express from 'express';
import { getHomeRoute } from '../controllers/indexController';

const router = express.Router();

router.get('/', getHomeRoute);

export default router; 