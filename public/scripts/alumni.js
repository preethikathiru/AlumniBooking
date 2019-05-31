var hostname = config.hostname;
var globalbooking;
var col = [];
listbookings();

function listbookings() {
    var local = window.localStorage.getItem('token');
    var username = window.localStorage.getItem('username');
    fetch(hostname + "/getbookings?alumniName="+username, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'token': local
        }
    })
        .then(function (response) {
            return response.json();
        })
        .then(booking => {
            
            if(booking.length==0){
                var button = document.createElement('input');
                button.setAttribute('type', 'button');
                button.setAttribute('value', 'No Booking available');
                var divContainer = document.getElementById("showData");
                divContainer.innerHTML = "";
                divContainer.appendChild(button);
            }else{
                console.log(booking)
                JsonTohtml(booking)
                globalbooking = booking;
            }
        })
        .catch(err => {
            console.log(err)
        })
}

function JsonTohtml(booking) {
    for (var i = 0; i < booking.length; i++) {
        for (var key in booking[i]) {
            if (col.indexOf(key) === -1) {
                col.push(key);
            }
        }
    }
    var table = document.createElement("table");
    var tr = table.insertRow(-1);                   // TABLE ROW.
    for (var i = 0; i < col.length; i++) {
        var th = document.createElement("th");      // TABLE HEADER.
        th.innerHTML = col[i];
        tr.appendChild(th);
    }
    for (var i = 0; i < booking.length; i++) {
        tr = table.insertRow(-1);
        for (var j = 0; j < col.length; j++) {
            var tabCell = tr.insertCell(-1);
            tabCell.innerHTML = booking[i][col[j]];
        }
        td1 = document.createElement("td")
        var button = document.createElement('input');
        button.setAttribute('type', 'button');
        button.setAttribute('value', 'ACCEPT');
        button.setAttribute('onclick', 'acceptslot(this)');
        console.log('Hello123')
        td1.appendChild(button);
        tr.appendChild(td1);
        td2 = document.createElement("td")
        var button = document.createElement('input');
        button.setAttribute('type', 'button');
        button.setAttribute('value', 'REJECT');
        button.setAttribute('name', 'reject')
        button.setAttribute('onclick', 'rejectslot(this)');
        console.log('Hello123')
        td2.appendChild(button);
        tr.appendChild(td2);
    }
    var divContainer = document.getElementById("showData");
    divContainer.innerHTML = "";
    divContainer.appendChild(table);

}

function acceptslot(obj) {
    var par = obj.parentNode;
    while (par.nodeName.toLowerCase() != 'tr') {
        par = par.parentNode;
    }
    var k = par.rowIndex - 1;
    console.log(globalbooking[k], 'using index')
    var datatoedit = {
        Student_name: globalbooking[k].Student_name,
        Alumni: globalbooking[k].Alumni,
        Date: globalbooking[k].Date,
        Accepted: 'true',
        _id: globalbooking[k]._id
    }
    console.log(datatoedit, 'data to ediing')
    var local = window.localStorage.getItem('token');
    fetch(hostname + "/editbookings", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'token': local
        },
        body: JSON.stringify(datatoedit)
    })
        .then(function (response) {
            return response.json();
            console.log('saved succesfully', response)
        })
        .then(function (data) {
            console.log('Saved successfully', data);
        })
        .catch(err => {
            console.log(err)
            alert('Some error in editing')
        })
}
function rejectslot(obj) {
    var par = obj.parentNode;
    while (par.nodeName.toLowerCase() != 'tr') {
        par = par.parentNode;
    }
    var j = par.rowIndex - 1;
    console.log(globalbooking[j], 'using index')

    datatoedit = {
        Student_name: globalbooking[j].Student_name,
        Alumni: globalbooking[j].Alumni,
        Date: globalbooking[j].Date,
        Accepted: 'false',
        _id: globalbooking[j]._id

    }
    console.log(datatoedit, 'data to ediing')
    var local = window.localStorage.getItem('token');
    fetch(hostname + "/editbookings", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'token': local
        },
        body: JSON.stringify(datatoedit)
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log('Saved successfully', data);
        })
        .catch(err => {
            console.log(err)
            alert('Some error in booking')
        })
}
