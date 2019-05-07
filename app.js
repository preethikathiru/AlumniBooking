var express = require("express"),
    app = express(),
    port = 3000,
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
    alumniname: String,
    date: Date
});
var Bookingmodel = mongoose.model("booking", bookingSchema);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});
app.post("/bookalumni", (req, res) => {
    console.log('inside bookalumni')
    var receivedalumni = req.body.alumnii;
    var receiveddate = req.body.dates;
    var detailJson = { alumniname: receivedalumni, date: receiveddate }
    var bookingmodelObject = new Bookingmodel(detailJson);
    bookingmodelObject.save()
        .then(item => {
            console.log(item, 'received data');
            res.send(item);
        })
        .catch(err => {
            console.log(err)
        })
});
app.get("/getlist", (req, res) => {
    console.log('inside getlist');
    Bookingmodel.find()
        .then(item => {
            res.send(item)
        })
        .catch(err => {
            console.log(err)
        })
})
app.listen(port, () => {
    console.log("Server listening on port " + port);
});

