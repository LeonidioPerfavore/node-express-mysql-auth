const welcomeHeader  = document.getElementById('welcome-header');
let access_token = localStorage.getItem('access_token')
let refresh_token = localStorage.getItem('refresh_token')

if(!access_token || !refresh_token){
    window.location.href = '/login'
}

async function checkTokenExpired(){
    await axios.post('/api/v1/auth/refresh').then(function (response) {
        localStorage.setItem('access_token', response.data.access_token)
        localStorage.setItem('refresh_token', response.data.refresh_token)
        getProfile(response.data.access_token)
    }).catch(function (error) {
        localStorage.removeItem('login')
        window.location.href = '/login'
    });
}

const getProfile = async (access_token) => {
    await axios.get('/api/v1/user/profile', {
        headers: {'Authorization': 'Bearer '+access_token }
    }).then(function (response) {
        let userName = response.data.profile.name
        welcomeHeader.innerHTML = "Congratulations! "+userName+", you are logged in!"
    }).catch(function (error) {
        if(error.response && error.response.status === 401){
            checkTokenExpired()
        }else{
            window.location.href = '/login'
        }
    });
}

async function logout(){
    await axios.post('/api/v1/auth/logout');
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('login')
    window.location.href = '/login'
}

getProfile(localStorage.getItem('access_token'))
