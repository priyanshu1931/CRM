import express from 'express';
import { createLead, endWorking, getLeads, pauseWorking, resumeWorking, startWorking } from '../controllers/userController.js';
import isAuthenticated from '../utils/isAuthenticated.js';
const router = express.Router();

router.use(isAuthenticated);
router.route('/lead').post(createLead).get(getLeads);
router.post('/activity/pause',pauseWorking);
router.post('/activity/resume',resumeWorking);
router.post('/activity/start',startWorking);
router.post('/activity/end',endWorking);

export default router;