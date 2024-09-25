import express from 'express';
const router = express.Router();

router.get('/', async (_, res) => {
  res.send('Welcome to API');
});

export default router;