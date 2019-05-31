var hostname = config.hostname;
function handleFetchResponse(responseJson) {
    if(responseJson.status == 213){
        alert(responseJson.message);
        return true;
    }
}

function loginValidation() {
    if(!window.localStorage.getItem('token')){
        console.log('Logout plsjbskffbskvf')
        alert('Please login')
        location.replace(hostname + "/login")
        return false
    }
    return true
}

function logout() {
    window.localStorage.clear();
    location.replace(hostname + "/login")
}

