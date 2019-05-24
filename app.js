var express = require("express"),
    app = express(),
    port = 4000,
    bodyParser = require('body-parser'),
    cors = require('cors'),
    mongoose = require("mongoose");

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://node_demo:node_demo123@ds151222.mlab.com:51222/myfirstdb")
    .then((data) => {
        console.log('db connected')
    }).catch((err) => {
        console.log(err)
    })

var bookingSchema = new mongoose.Schema({
    Student_name: String,
    Alumni: String,
    Date: Date,
    Accepted: { type: String, default: false }
});
var Bookingmodel = mongoose.model("booking", bookingSchema);

var studentSchema = new mongoose.Schema({
    name: String,
    passed_out: Boolean
});
var Studentmodel = mongoose.model("student", studentSchema);

var userSchema = new mongoose.Schema({
    Username: {
        type: String,
        unique: true
    },
    Password: String
});
var Usermodel = mongoose.model("user", userSchema);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/getbookinglist", (req, res) => {
    res.sendFile(__dirname + "/alumni.html")
})

app.get("/signup", (req, res) => {
    res.sendFile(__dirname + "/signup.html")
})

app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/login.html")
})

app.post("/adduser", (req, res) => {
    var userjson = {
        Username: req.body.Username,
        Password: req.body.Password
    }
    UserObject = new Usermodel(userjson)
    UserObject.save()
        .then(item => {
            console.log(item)
            res.send(item)
        })
        .catch(err => {
            res.send(err)
        })
});

app.post("/validateuser", (req, res) => {
    console.log()
    Usermodel.findOne({ Username: req.body.Username })
        .then(item => {
            console.log(item, 'from db')
            console.log(req.body, 'request')
            if (item && item.Password === req.body.Password) {
                console.log(item, 'logged in successfully')
                res.send({
                    success: true,
                    data:item
                })
                //res.send('success')
            }
            else {
                console.log('wrongly entered')
                //res.status(req.body,'200')
                res.send({
                    success: false,
                    data:item
                })
            }
        })
        .catch(err => {
            res.send({
                success: false,
                error:'Db error'
            })
        })
});


app.get("/getalumni", (req, res) => {
    Studentmodel.find({ passed_out: true })
        .then(item => {
            res.send(item)
        })
        .catch(err => {
            console.log(err)
        })
});

app.post("/bookslot", (req, res) => {
    console.log(req.body);
    var bookingdata = {
        Alumni: req.body.Alumni,
        Student_name: req.body.Student_name,
        Date: req.body.Date
    }
    bookingObject = new Bookingmodel(bookingdata);
    bookingObject.save().then(booking => {
        res.send(booking);
    }).catch(err => {
        res.send(err);
    })
});

app.get("/getbookings", (req, res) => {
    Bookingmodel.find()
        .then(item => {
            res.send(item)
        })
        .catch(err => {
            console.log(err)
        })
})

app.post("/editbookings", (req, res) => {
    console.log('hello')
    console.log(req.body._id)
    Bookingmodel.findOne({ _id: req.body._id })
        .then(function (item) {
            console.log(req.body.Accepted)
            item.Accepted = req.body.Accepted
            item.save()
                .then(item => {
                    res.send(item)
                    console.log(item)
                })
        })
        .catch(err => {
            console.log(err)
        })
})


app.listen(port, () => {
    console.log("Server listening on port " + port);
});

