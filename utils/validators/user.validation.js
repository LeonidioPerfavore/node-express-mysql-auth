import {createCustomError} from "../errors/custom-api-error.js"

const validateEmail = (email) => {
    return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const userValidation = (req, next, registration) => {

    let errorMsg = null;

    if(!req){ errorMsg = `Data for registration not sent.` }

    if(!req.email){ errorMsg = `Email required.` }

    if(!req.password){ errorMsg = `Password required` }

    if (!validateEmail(req.email)) { errorMsg ='Email not valid' }

    if(req.password.length < 11){ errorMsg = `Password is to short.`}

    if (!req.password.replace(/\s/g, '').length) { errorMsg ='Password only contains whitespace' }

    if(registration){
        if(!req.name){ errorMsg = `Name required.` }
        if(req.name.length <= 2){ errorMsg = `Name is to short.`}
    }

    if(errorMsg){
        return next(createCustomError(errorMsg, 400))
    }
}

export const emailValidation = (req, next) => {

    let errorMsg = null;

    if(!req){ errorMsg = `Data not sent.` }

    if(!req.email){ errorMsg = `Email required.` }

    if (!validateEmail(req.email)) { errorMsg ='Email not valid' }

    if(errorMsg){
        return next(createCustomError(errorMsg, 400))
    }
}