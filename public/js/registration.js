const registrationDOM = document.getElementById('registration-dom')
const emailRegistrationInp = document.getElementById('email-registration-inp')
const passwordRegistrationInp = document.getElementById('password-registration-inp')
const nameRegistrationInp = document.getElementById('name-registration-inp')
const continueBtnEmail = document.getElementById('continue-btn')
const continueBtnPassword = document.getElementById('continue-btn-2')
const submitBtn = document.getElementById('register-submit-btn')
const validateMessage = document.getElementById('validate-message')
const passwordRegistrationBlock = document.getElementById('password-registration-block')
const nameRegistrationBlock = document.getElementById('name-registration-block')
const labelCreatePassword = document.getElementById('create-password-label')
const labelCreateName = document.getElementById('create-name-label')
const emailRegistrationIcon = document.getElementById('email-registration-icon')
const passwordRegistrationIcon = document.getElementById('password-registration-icon')
const nameRegistrationIcon = document.getElementById('name-registration-icon')
const eyeSvgWrapper = document.getElementById('svg-password-wrapper')
const registrationMessage = document.getElementById('registration-success-message')

let email = null;
let password = null;
let name = null;

function checkEmailVerifyError(error){
    continueBtnEmail.disabled = true
    if(error.response.status === 423){
        validateMessage.innerHTML = 'Email is already taken'
    }else{
        if(error.response.status === 400){
            validateMessage.innerHTML = 'Email is invalid'
        }else{
            console.log(error);
        }
    }
}

function checkRegistrationError(error){
    console.log(error)
    validateMessage.innerHTML = 'An error occurred, please try again later'
}

function validateEmail(email){
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}

function validatePassword(password){
    let validate = true;
    if (!password.replace(/\s/g, '').length) {
        validateMessage.innerHTML = 'Password not valid'
        validate = false
    }
    if (password.length < 11) {
        validateMessage.innerHTML = 'Password to short, min length: 10'
        validate = false
    }
    return validate;
}

function validateName(name){
    let validate = true;
    if(name.length < 3){
        validateMessage.innerHTML = 'Name is to short min length: 3'
        validate = false
    }
    if (!name.replace(/\s/g, '').length) {
        validateMessage.innerHTML = 'Name not valid'
        validate = false
    }
    return validate;
}

function showHidePassword(){
    if(passwordRegistrationInp.type === 'password'){
        passwordRegistrationInp.type = 'text'
        eyeSvgWrapper.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash svg-icon" viewBox="0 0 16 16"> <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/> <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/> <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/> </svg>
        `
    }else{
        passwordRegistrationInp.type = 'password'
        eyeSvgWrapper.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye svg-icon" viewBox="0 0 16 16"> <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/> <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/> </svg>
        `
    }
}

/** Add email **/
emailRegistrationInp.addEventListener('input', async (e) => {
    const emailForRegistration = e.target.value
    email = emailForRegistration
    if(emailForRegistration){
        if (validateEmail(emailForRegistration))
        {
            await axios.post('/api/v1/auth/email-validity-checks', {
                email: emailForRegistration,
            }).then(function (response) {
                continueBtnEmail.disabled = false
                validateMessage.innerHTML = ''
                email = emailForRegistration;
            }).catch(function (error) {
                checkEmailVerifyError(error)
            });

        }else{
            continueBtnEmail.disabled = true
            validateMessage.innerHTML = 'Email is invalid'
         }
    }
})

/** Add password **/
passwordRegistrationInp.addEventListener('input', async (e) => {
    const passwordForRegistration = e.target.value
    password = passwordForRegistration
    if(passwordForRegistration){
        if (validatePassword(passwordForRegistration))
        {
            continueBtnPassword.disabled = false
            validateMessage.innerHTML = ''
        }else{
            continueBtnPassword.disabled = true
        }
    }else{
        continueBtnPassword.disabled = true
    }
})

/** Add name **/
nameRegistrationInp.addEventListener('input', async (e) => {
    const nameForRegistration = e.target.value
    name = nameForRegistration;
    if(nameForRegistration){
        if(validateName(nameForRegistration)){
            submitBtn.disabled = false
            validateMessage.innerHTML = ''
        }else{
            submitBtn.disabled = true
        }
    }
})

/** Activate EMAIL input **/
emailRegistrationInp.addEventListener('click',  (e) => {
    eyeSvgWrapper.classList.add('opacity-0')
    submitBtn.classList.add('opacity-0')
    submitBtn.disabled = true
    checkIconStatus(name, validateName, nameRegistrationIcon, emailRegistrationIcon)
    checkIconStatus(password, validatePassword, passwordRegistrationIcon, emailRegistrationIcon)
    activateContinueBtn(continueBtnEmail, continueBtnPassword, submitBtn)
})

/** Activate Password input **/
passwordRegistrationInp.addEventListener('click',  (e) => {
    eyeSvgWrapper.classList.remove('opacity-0')
    submitBtn.classList.add('opacity-0')
    submitBtn.disabled = true
    checkIconStatus(name, validateName, nameRegistrationIcon, passwordRegistrationIcon)
    checkIconStatus(email, validateEmail, emailRegistrationIcon, passwordRegistrationIcon)
    activateContinueBtn(continueBtnPassword, continueBtnEmail, submitBtn)
})

/** Activate Name input **/
nameRegistrationInp.addEventListener('click',  (e) => {
    eyeSvgWrapper.classList.add('opacity-0')
    checkIconStatus(email, validateEmail, emailRegistrationIcon, nameRegistrationIcon)
    checkIconStatus(password, validatePassword, passwordRegistrationIcon, nameRegistrationIcon)
    activateContinueBtn(submitBtn, continueBtnEmail, continueBtnPassword)

    if(email && validateEmail(email) && password && validatePassword(password) && name && validateName(name)){
        submitBtn.disabled = false
    }
})

function checkIconStatus(value, validate, icon, currentIcon){
    if(value){
        if(validate(value)){
            icon.classList.add('check-symbol')
        }else{
            if(icon.classList.contains('check-symbol')){
                icon.classList.remove('check-symbol')
            }
            if(icon.classList.contains('arrow-right')){
                icon.classList.remove('arrow-right')
            }
            icon.classList.add('cross-mark-symbol')
        }
    }else{
        if(icon.classList.contains('check-symbol')){
            icon.classList.remove('check-symbol')
        }
        if(icon.classList.contains('cross-mark-symbol')){
            icon.classList.remove('cross-mark-symbol')
        }
        icon.classList.add('arrow-right')
    }
    if(currentIcon.classList.contains('check-symbol')){
        currentIcon.classList.remove('check-symbol')
    }
    if(currentIcon.classList.contains('cross-mark-symbol')){
        currentIcon.classList.remove('cross-mark-symbol')
    }
    currentIcon.classList.add('arrow-right')
}

function activateContinueBtn(currentBtn, otherBtn1, otherBtn2){
    otherBtn1.classList.add('opacity-0')
    otherBtn2.classList.add('opacity-0')
    if(currentBtn.classList.contains('opacity-0')){
        currentBtn.classList.remove('opacity-0')
    }
}

function submitContinueBtn(value, activatedBlock, prevContinueBtn, currentContinueBtn, label, currentIcon){
    if(value){
        if(activatedBlock.classList.contains('d-none')){
            activatedBlock.classList.remove('d-none')
        }
        activatedBlock.classList.add('d-flex')
        prevContinueBtn.classList.add('opacity-0')
        if(currentContinueBtn.classList.contains('d-none')){
            currentContinueBtn.classList.remove('d-none')
            currentContinueBtn.classList.add('d-block')
        }
        if(currentContinueBtn.classList.contains('opacity-0')){
            currentContinueBtn.classList.remove('opacity-0')
        }
        if(label.classList.contains('d-none')){
            label.classList.remove('d-none')
        }
        if(currentIcon.classList.contains('arrow-right')){
            currentIcon.classList.remove('arrow-right')
        }
        currentIcon.classList.add('check-symbol')
    }
}

/** Click to email continue. Activate password registration  **/
continueBtnEmail.addEventListener('click', (e) => {
    submitContinueBtn(email, passwordRegistrationBlock, continueBtnEmail, continueBtnPassword, labelCreatePassword, emailRegistrationIcon)
})

/**  Click to password continue.  Activate name registration  **/
continueBtnPassword.addEventListener('click', (e) => {
    if(email && validateEmail(email) && password && validatePassword(password) && name && validateName(name)){
        submitBtn.disabled = false
    }
    submitContinueBtn(password, nameRegistrationBlock, continueBtnPassword, submitBtn, labelCreateName, passwordRegistrationIcon)
})

/** Click to registration btn **/
submitBtn.addEventListener('click', async (e) => {
    await axios.post('/api/v1/auth/registration', {
        name: name,
        email: email,
        password: password,
    }).then(function (response) {
        registrationDOM.style.display = 'none'
        submitBtn.disabled = true
        registrationMessage.classList.remove('d-none')
    }).catch(function (error) {
        checkRegistrationError(error)
    });
})

