var hostname = config.hostname;

var globalalumni;
listalumni();
myBookings();
function JsontoHtml(list,htmlId) {
    var col = [];
    for (var i = 0; i < list.length; i++) {
        for (var key in list[i]) {
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
    for (var i = 0; i < list.length; i++) {
        tr = table.insertRow(-1);
        for (var j = 0; j < col.length; j++) {
            var tabCell = tr.insertCell(-1);
            tabCell.innerHTML = list[i][col[j]];
        }
        if(htmlId != 'myBookings'){
            var textbox = document.createElement("INPUT");
            textbox.type = "Date";
            tr.appendChild(textbox);
            td1 = document.createElement("td")
            var button = document.createElement('input');
            button.setAttribute('type', 'button');
            button.setAttribute('value', 'BOOK');
            button.setAttribute('onclick', 'bookslot(this)');
            td1.appendChild(button);
            tr.appendChild(td1);
        }
    }
    var divContainer = document.getElementById(htmlId);
    divContainer.innerHTML = "";
    divContainer.appendChild(table);
}
function listalumni() {
    var local = window.localStorage.getItem('token');
    console.log(local, 'token from browser')
    fetch(hostname + "/getalumni", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'token': local
        }
    })
        .then(function (response) {
            return response.json();
        })
        .then(alumni => {
            console.log(alumni)
            JsontoHtml(alumni,'showData')
            globalalumni = alumni
        })
        .catch(err => {
            console.log(err)
        })

}

function myBookings() {
    var local = window.localStorage.getItem('token');
    var username = window.localStorage.getItem('username');
    console.log(local, 'token from browser')
    fetch(hostname + "/getbookings?studentname="+username, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'token': local
        }
    })
        .then(function (response) {
            return response.json();
        })
        .then(bookings => {
            console.log(bookings)
            JsontoHtml(bookings,'myBookings')
        })
        .catch(err => {
            console.log(err)
        })
}

function bookslot(obj) {

    var par = obj.parentNode;
    while (par.nodeName.toLowerCase() != 'tr') {
        par = par.parentNode;
    }
    var index = par.rowIndex;
    console.log(globalalumni[index], 'using index')
    var table = document.getElementsByTagName("table");
    var input = table[0].rows.item(index).getElementsByTagName("input");

    console.log('Rows:', table[0].rows)
    console.log(input[0].value)
    var studentName = window.localStorage.getItem('username');

    dataToBookApi = {
        Student_name: studentName,
        Alumni: globalalumni[index - 1].Username,
        Date: input[0].value
    }
    console.log(dataToBookApi, 'dataToBookApi')
    var local = window.localStorage.getItem('token');
    fetch(hostname + "/bookslot", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'token': local
        },
        body: JSON.stringify(dataToBookApi)
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if(!handleFetchResponse(data))
            {
                console.log('Saved succes', data);
                alert('saved succesfully')
            }
        })
        .catch(err => {
            console.log(err)
            alert('Some error in booking')
        })
}
