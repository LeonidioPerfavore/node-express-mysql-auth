import {asyncWrapperMiddleware} from "../middleware/async-wrapper.middleware.js";
import authService from "../services/auth.service.js";

export const profile = asyncWrapperMiddleware(async (req, res, next) => {

    const user = await authService.getUser(req, next)

    res.status(200).json({status: "Success", profile: user})
})