import {Router} from 'express';import {dashboard} from '../controllers/dashboardController.js';import {auth} from '../middleware/auth.js';const r=Router();r.get('/',auth,dashboard);export default r;
