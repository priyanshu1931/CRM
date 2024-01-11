import express from 'express';
import { createActivity, getAgentProfile, getAllAgentsProfiles, getMonthSummary, getSummaryByDate } from '../controllers/adminController.js';
import isAuthenticated from '../utils/isAuthenticated.js';
import isAuthorized from '../utils/isAuthorized.js';
const router = express.Router();
router.use(isAuthenticated);
router.use(isAuthorized);
router.get('/agent/:id', getAgentProfile);
router.get('/allagents',getAllAgentsProfiles);
router.get('/monthlysummary', getMonthSummary);
router.get('/summary/:date', getSummaryByDate);
router.post('/activity',createActivity)

export default router;