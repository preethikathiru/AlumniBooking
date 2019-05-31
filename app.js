var express = require("express"),
    app = express(),
    path = require('path'),
    port = 4000,
    bodyParser = require('body-parser'),
    cors = require('cors'),
    mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var mustacheExpress = require('mustache-express');

app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, 'public')));
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

var userSchema = new mongoose.Schema({
    Username: {
        type: String,
        unique: true
    },
    Password: String,
    passed_out: Boolean
});
var Usermodel = mongoose.model("user", userSchema);


var validateJWTToken = function (token) {
    console.log('validate function')
    console.log(token);
    if (token) {
        try {
            console.log('validate function in try')
            var decoded = jwt.verify(token, 'secret');
            console.log('true')
            return { valid: true }
        } catch (e) {
            console.log(e)
            return { valid: false, message: 'invalid token' }
        }
    } else {
        return { valid: false, message: 'token required' }
    }
}

app.use(express.static(__dirname + '/pubic/scripts'));

app.get('/health', function(req, res) {
  res.send(200);
});

app.get("/", (req, res) => {
    res.render('signup');
});

app.get("/alumnipage", (req, res) => {
    res.render('alumni');
})

app.get("/studentpage", (req, res) => {
    res.render('student');
})

app.get("/login", (req, res) => {
    res.render('login');
})
app.post("/adduser", (req, res) => {
    let hash = bcrypt.hashSync(req.body.Password, 10);
    console.log(req.body.Username, 'username')
    var userjson = {
        Username: req.body.Username,
        Password: hash,
        passed_out: req.body.passed_out
    }
    console.log(hash, 'hashed password')
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
    Usermodel.findOne({ Username: req.body.Username })
        .then(item => {
            console.log(item, 'from db')
            bcrypt.compare(req.body.Password, item.Password, function (err, result) {
                if (err) {
                    return res.status(401).json({
                        failed: 'Unauthorized Access'
                    });
                }
                if (result) {
                    const JWTToken = jwt.sign({
                        Username: item.Username,
                        _id: item._id
                    },
                        'secret',
                        {
                            expiresIn: '5h'
                        });
                    console.log(JWTToken, 'token')
                    return res.status(200).json({
                        success: 'true',
                        token: JWTToken,
                        username: item.Username,
                        passed_out : item.passed_out
                    });
                }
                return res.status(401).json({
                    failed: 'Unauthorized Access'
                });
            });
        })
        .catch(err => {
            res.send({
                success: false,
                error: 'Db error'
            })
        })
})
app.get("/getalumni", (req, res) => {
    console.log(req.headers.token, 'inside getalumni');
    var validationJson = validateJWTToken(req.headers.token);
    if (validationJson.valid) {
        Usermodel.find({ passed_out: true })
            .then(item => {
                
                console.log(item,'from db')
                var elements  =[];
                item.forEach(function(element){
                    element = element.toObject();
                    delete element.Password
                    console.log(element,'element')
                    elements.push( element);
                })
                res.send(elements)
            })
            .catch(err => {
                console.log(err)
            })
    } else {
        console.log('in else')
        res.send({
            data: validationJson
        })
    }
});
app.post("/bookslot", (req, res) => {
    console.log(req.headers.token, 'inside bookslot');
    var validationJson = validateJWTToken(req.headers.token);
    if (validationJson.valid) {
        console.log(req.body);
        var currentDate = new Date();
        var bookingDate = new Date(req.body.Date);
        var timeDiff = bookingDate.getTime() - currentDate.getTime();
        var daysDiff = timeDiff / (1000 * 3600 * 24);
        

        if(daysDiff < 7){
            return res.send({status :213,message : 'Please pick a date after a week'})
        }
        
        var bookingdata = {
            Alumni: req.body.Alumni,
            Student_name: req.body.Student_name,
            Date: req.body.Date
        }
        console.log(req.body, 'boking')
        console.log(bookingdata, 'bookingdata')
        Bookingmodel.count({Student_name : req.body.Student_name}).then(count =>{
            if(count >= 2){
                return res.send({status :213,message : 'Only 2 bookings allowed'})
            }
            bookingObject = new Bookingmodel(bookingdata);
            bookingObject.save().then(booking => {
                res.send(booking);
                console.log(booking, 'json')
            }).catch(err => {
                res.send(err);
            })
        })
       
    } else {
        console.log('in else')
        res.send({
            data: validationJson
        })
    }
});
app.get("/getbookings", (req, res) => {
    var alumniName = req.query.alumniName;
    var studentname = req.query.studentname;
    var queryCondition ={};
    if(alumniName){
        queryCondition.Alumni = alumniName;
    }
    if(studentname){
        queryCondition.Student_name = studentname;
    }

    console.log(req.headers.token, 'inside getbookings');
    var validationJson = validateJWTToken(req.headers.token);
    if (validationJson.valid) {
        Bookingmodel.find(queryCondition)
            .then(item => {
                res.send(item)
                console.log('then')
            })
            .catch(err => {
                console.log(err)
                console.log('catch')
            })
    } else {
        console.log('in else')
        res.send({
            data: validationJson
        })
    }

})
app.post("/editbookings", (req, res) => {

    console.log('my login token', req.headers.token)
    var validationJson = validateJWTToken(req.headers.token);
    if (validationJson.valid) {
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
    } else {
        res.send({
            data: validationJson
        })
    }
})
app.listen(process.env.PORT || port, () => {
    console.log("Server listening on port " + port);
});

