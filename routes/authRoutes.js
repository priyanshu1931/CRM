import express from 'express';
const router=express.Router();
import {login,logout,register} from  '../controllers/authController.js'
import isAuthenticated from '../utils/isAuthenticated.js';


router.post('/login', login);
router.get('/logout', isAuthenticated, logout);
router.post('/register',register);

export default router;