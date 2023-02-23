import User from "../models/user.js";
import {createCustomError} from "../utils/errors/custom-api-error.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import * as mailService from "./mail.service.js";
import tokenService from "./token.service.js";
import Token from "../models/token.js";
import jwt from "njwt";

class AuthService {
   async registration(req, next){
        const databaseUser = await User.findOne({ where: { email: req.body.email } })
        if(databaseUser){
            return next(createCustomError(`User with email ${req.body.email} already exist`, 400))
        }

       const linkForActivation = crypto.randomBytes(40).toString('hex')
       const user = new User({
           name: req.body.name,
           email: req.body.email,
           password: await bcrypt.hash(req.body.password, 10),
           activation_link: linkForActivation,
           createdAt: Date.now()
       });

       await user.save();

       await mailService.sendLink(req.body.email, process.env.APP_URL+':'+process.env.APP_PORT+'/api/v1/auth/activate/'+linkForActivation)
    }

   async login(req, next){
        const user = await User.findOne({ where: { email: req.body.email } })

        if(!user){
            return next(createCustomError(`User not found`, 404))
        }

        if(user.activated === false){
            return next(createCustomError(`User not activated`, 401))
        }

        const passwordCheck = bcrypt.compare(req.body.password, user.password);
        if (!passwordCheck) {
            return next(createCustomError(`Wrong password`, 401))
        }

       const {access_token, refresh_token} = tokenService.generateToken(user.id, next)

       const refreshToken = await Token.findOne({ where: { user_id: user.id} })
       if (refreshToken) {
           await Token.destroy({ where: { id: refreshToken.id } });
       }

       await tokenService.createRefreshToken(user.id, refresh_token)

       return {
           access_token: access_token,
           refresh_token: refresh_token
       }
    }

    async activate(req, next){
        const { id: activationLink } = req.params
        const user = await User.findOne({ where: { activation_link: activationLink } })
        if(!user){
            return next(createCustomError(`There is no user with this activation link`, 401))
        }
        user.update({
            activated: true,
            activation_link: null
        })
    }

    async logout(req, next){
       const token = req.cookies.refreshToken;
       if(!token){
           return next(createCustomError(`Access Denied: No token provided`, 403))
       }
        await tokenService.remove(token)
    }

    async refresh(req, next){
        const token = req.cookies.refreshToken;
        if(!token){
            return next(createCustomError(`Access Denied: No token provided`, 401))
        }
        const validate = tokenService.validateRefreshToken(token)
        const tokenFromDb = await tokenService.findToken(token)

        if(!validate || !tokenFromDb){
            return next(createCustomError(`Unauthorized`, 401))
        }

        await tokenService.remove(token)

        return tokenService.generateToken(tokenFromDb.user_id)
    }

   async getUser(req, next){
        const token = req.cookies.refreshToken;
        let data = jwt.verify(token, process.env.JWT_REFRESH_SECRET_KEY);
        if(!data){
            return next(createCustomError(`Refresh token expire`, 401))
        }
        const user = User.findOne({ where: { id: data.body.id } })
        if(!user){
            return next(createCustomError(`Access Denied: user not register`, 401))
        }
        return user;
    }
}

export default new AuthService();