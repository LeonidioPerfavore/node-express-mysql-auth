import jwt from "njwt";
import Token from "../models/token.js";

class TokenService {

    generateToken = (userId) => {

        const claims = { id: String(userId) }
        const accessToken = jwt.create(claims, process.env.JWT_ACCESS_SECRET_KEY)
        /** 10 min. **/
        accessToken.setExpiration(new Date().getTime() + 600000)

        const refreshToken = jwt.create(claims, process.env.JWT_REFRESH_SECRET_KEY)
        /** 1 h. **/
        refreshToken.setExpiration(new Date().getTime() + 3600000)

        return {
            "access_token": accessToken.compact(),
            "refresh_token": refreshToken.compact()
        }
    }

    createRefreshToken = async (userId, refreshTokenName) => {

        const newRefreshToken = new Token({
            user_id: userId,
            name: refreshTokenName,
            createdAt: Date.now(),
            expired: Date.now()
        });

        await newRefreshToken.save();
    }

    remove = async (refreshTokenName) => {
        await Token.destroy({ where: { name: refreshTokenName } });
    }

    validateAccessToken(token){
        try {
            return  jwt.verify(token, process.env.JWT_ACCESS_SECRET_KEY)
        } catch (e){
            return null
        }
    }

    validateRefreshToken(token){
        try {
            return jwt.verify(token, process.env.JWT_REFRESH_SECRET_KEY)
        } catch (e){
            return null
        }
    }

    async findToken(token) {
        return await Token.findOne({where: {name: token}})
    }
}

export default new TokenService();