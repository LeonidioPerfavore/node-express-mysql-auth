const emailInp = document.getElementById('email-login');
const passwordInp = document.getElementById('password-login');
const msg = document.getElementById('validate-login-msg');

if(localStorage.getItem('login')){
    window.location.href = '/profile'
}

async function checkAuthUser(){
    const access_token = localStorage.getItem('access_token')
    if(access_token && localStorage.getItem('login')){
        await axios.post('/api/v1/auth/check').then(function (response) {
            window.location.href = '/profile'
        }).catch(function (error) {
            console.log(error)
        });
    }else{
        console.log('noy acc')
    }
}

checkAuthUser()

/** Login **/
function login(){

    let email = emailInp.value;
    let password = passwordInp.value;

    if(!email || !password){
        showMsg(msg, 'Incorrect email or password.')
    }else{
        if(password.length < 11){
            showMsg(msg, 'Incorrect email or password.')
        }
        if(!validateEmail(email)){
            showMsg(msg, 'Invalid email.')
        }
        axios.post('/api/v1/auth/login', {
            email: email,
            password: password,
        }).then(function (response) {
            localStorage.setItem('access_token', response.data.access_token)
            localStorage.setItem('refresh_token', response.data.refresh_token)
            localStorage.setItem('login', true)
            window.location.href = '/profile'
        }).catch(function (error) {
            showMsg(msg, 'Incorrect email or password.')
        });
    }
}

function showMsg(el, msg){
    if(el.classList.contains('opacity-0')){
        el.classList.remove('opacity-0')
    }
    el.innerHTML = msg
}

function validateEmail(email){
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}