var hostname = config.hostname;
function submit() {
    var user = document.getElementById('name1').value
    var pass = document.getElementById('pass1').value
    var passed_out = document.getElementById('passed_out1').value
    Userinfo = {
        Username: user,
        Password: pass,
        passed_out : passed_out
    }
    console.log(Userinfo)
    fetch(hostname+"/adduser", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(Userinfo)
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log('Saved succes', data);
            alert('saved succesfully')
            location.replace(hostname+"/login")
        })
        .catch(err => {
            console.log(err)
            alert('Some error in booking')
        })
}

function login() {
    location.replace(hostname+"/login")
}