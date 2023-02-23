import {createCustomError} from "../utils/errors/custom-api-error.js";
import tokenService from "../services/token.service.js";

export function authMiddleware(req, res, next){
    let authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return next(createCustomError(`Access Denied: No token provided`, 403))
    }

    let bearer = "Bearer ";
    const token = authHeader.slice(bearer.length);

    const validate = tokenService.validateAccessToken(token)
    if(!validate){
        return next(createCustomError(`Token expired`, 401))
    }else{
        next()
    }
}