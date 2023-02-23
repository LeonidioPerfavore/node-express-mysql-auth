import {asyncWrapperMiddleware} from "../middleware/async-wrapper.middleware.js";
import {emailValidation, userValidation} from "../utils/validators/user.validation.js";
import {createCustomError} from "../utils/errors/custom-api-error.js";
import User from "../models/user.js";
import dotenv from "dotenv";
import authService from "../services/auth.service.js"
import tokenService from "../services/token.service.js";
dotenv.config()

export const emailVerification = asyncWrapperMiddleware(async (req, res, next) => {

    emailValidation(req.body, next)
    const databaseUser = await User.findOne({ where: { email: req.body.email } })
    if(databaseUser){
        return next(createCustomError(`User with email ${req.body.email} already exist`, 423))
    }

    res.status(200).json({ status: 'success' })
})

export const register = asyncWrapperMiddleware(async (req, res, next) => {

    userValidation(req.body, next, true)

    await authService.registration(req, next)

    res.status(200).json({message: `${req.body.name} registered successfully`})
})

export const activate = asyncWrapperMiddleware(async (req, res, next) => {

    await authService.activate(req, next)

    res.redirect(process.env.APP_URL+':'+process.env.APP_PORT+'/login')
})

export const login = asyncWrapperMiddleware(async (req, res, next) => {

    userValidation(req.body, next, false)

    const userTokens = await authService.login(req, next)

    res.cookie('refreshToken', userTokens.refresh_token, { maxAge: 60 * 60 * 1000, httpOnly: true })

    res.status(200).json({
        status: 'success',
        access_token: userTokens.access_token,
        refresh_token: userTokens.refresh_token
    })
})

export const logout = asyncWrapperMiddleware(async (req, res, next) => {

    await authService.logout(req, next)

    res.clearCookie("refreshToken")

    res.status(200).json({
        logout: 'success'
    })
})

export const refresh = asyncWrapperMiddleware(async (req, res, next) => {

    const userTokens = await authService.refresh(req, next)

    res.status(200).json({
        status: 'success',
        access_token: userTokens.access_token,
        refresh_token: userTokens.refresh_token
    })
})

export const check = asyncWrapperMiddleware(async (req, res, next) => {

   const refresh = req.cookies.refreshToken;
   if(!refresh){
       return next(createCustomError(`Unauthorized`, 401))
   }
    const validate = await tokenService.validateRefreshToken(refresh)
    if(!validate){
        return next(createCustomError(`Unauthorized`, 401))
    }

    res.status(200).json({
        check: 'success'
    })
})