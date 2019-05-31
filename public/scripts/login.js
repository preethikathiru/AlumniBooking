var hostname = config.hostname;
function submit() {
    var user = document.getElementById('name1').value
    var pass = document.getElementById('pass1').value
    Userinfo = {
        Username: user,
        Password: pass
    }
    console.log(Userinfo)
    fetch(hostname + "/validateuser", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(Userinfo)
    })
        .then(function (response) {
            console.log('here')
            return response.json();
        })
        .then(function (data) {
            console.log(data, 'data')
            if (data.success) {
                alert('Login success')
                window.localStorage.setItem('token', data.token);
                window.localStorage.setItem('username', data.username);
                window.localStorage.setItem('passedout', data.passed_out);
                if (data.passed_out) {
                    location.replace(hostname + "/getbookinglist")
                } else {
                    location.replace(hostname + "/studentpage")
                }
            }
            else {
                console.log('second wrong')
                alert('User not found ')
            }
        })
        .catch(err => {
            console.log(err);
            console.log('catch wrongly entered')
        })
}