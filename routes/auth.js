import express from 'express'
const router = express.Router()

import {emailVerification, login, register, logout, activate, refresh, check} from "../controllers/auth.controller.js";

router.route('/email-validity-checks').post(emailVerification)
router.route('/login').post(login)
router.route('/registration').post(register)
router.route('/logout').post(logout)
router.route('/activate/:id').get(activate)
router.route('/refresh').post(refresh)
router.route('/check').post(check)

export default router