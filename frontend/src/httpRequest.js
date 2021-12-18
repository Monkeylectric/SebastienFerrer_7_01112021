const axios = require('axios');

let authToken = null;

if(sessionStorage.getItem('user')){
    authToken = JSON.parse(sessionStorage.getItem('user')).token;
}

const httpRequest = axios.create({
    baseURL: 'http://localhost:3000/',
    //timeout: 2000,
    headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${authToken}`
    }
})

export default httpRequest;