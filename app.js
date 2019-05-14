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
    Student_name : String,
    Alumni : String,
    Date : Date,
    Accepted : {  type : String, default : false}
});
var Bookingmodel = mongoose.model("booking", bookingSchema);

var studentSchema = new mongoose.Schema({
    name : String,
    passed_out :  Boolean
});
var Studentmodel = mongoose.model("student",studentSchema);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/getalumni",(req,res) => {
    Studentmodel.find({ passed_out : true})
    .then(item => {
        res.send(item)
    })
    .catch(err => {
        console.log(err)
    })
})

// app.get("/bookslot", (req,res) =>  {
    
    
// })

app.listen(port, () => {
    console.log("Server listening on port " + port);
});

