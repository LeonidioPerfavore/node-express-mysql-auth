import { CustomApiError } from "../utils/errors/custom-api-error.js"
export const errorHandlerMiddleware = (err, req, res, next) => {
    if (err instanceof CustomApiError) {
        return res.status(err.statusCode).json({ msg: err.message })
    }
    console.log(err)
    return res.status(500).json({ msg: 'Something went wrong, please try again', err: err })
}