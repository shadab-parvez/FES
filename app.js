console.log('Loading...')
const config = require('config');
const express = require('express')
const bodyParser = require('body-parser')
const db = require('./server-js/db')
const http = require('http')
const fs = require('fs')
const path = require('path');
const fileUpload = require('express-fileupload');
const cors = require('cors');

console.log('Loaded imports')

const app = express()

var appMode;
if(process.argv[2] == "dev")
    appMode = "Development";
else if(process.argv[2] == "production")
    appMode = "Production";
else
    appMode = "Development";
console.log('Loading ' + appMode + ' mode')

const port = config.get(appMode + '.appPort');

app.use(bodyParser.json())
app.use(cors())
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
)

app.use(fileUpload());
app.use(require('body-parser').json())
console.log(__dirname)
app.use(express.static(path.join(__dirname, '/css')))
app.use(express.static(path.join(__dirname, '/js')))
app.use(express.static(path.join(__dirname, '/uploads')))

app.post('/getUserProfileStatistics', function(request, response) {
    db.getUserProfileStatistics(request, response)
});

app.post('/addCheckList', (request, response) => {
    db.addCheckList(request, response)
})

app.post('/getChecklists', (request, response) => {
    db.getChecklists(request, response)
})

app.post('/addObservation', (request, response) => {
    db.addObservation(request, response)
})

app.post('/getObservations', function(request, response) {
    db.getObservations(request, response)
});

app.post('/getObservationDetails', function(request, response) {
    db.getObservationDetails(request, response)
});

app.post('/searchSpecies', function(request, response) {
    db.searchSpecies(request, response)
});


app.post('/getTotalObservations', function(request, response) {
    db.getTotalObservations(request, response)
});

/* HTML Pages */
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/html/index.html'));
});

app.get('/viewObservation', function(req, res) {
    res.sendFile(path.join(__dirname, '/html/ViewObservation.html'));
});

app.get('/viewGallery', function(req, res) {
    res.sendFile(path.join(__dirname, '/html/Gallery.html'));
});

app.get('/speciesSearch', function(req, res) {
    res.sendFile(path.join(__dirname, '/html/SpeciesSearch.html'));
});

app.get('/profile', function(req, res) {
    res.sendFile(path.join(__dirname, '/html/Profile.html'));
});

// For Admin heirarchy
app.post('/getStates', function(request, response) {
    db.getStates(request, response)
});

app.post('/getDistricts', function(request, response) {
    db.getDistricts(request, response)
});

app.post('/getSubDistricts', function(request, response) {
    db.getSubDistricts(request, response)
});

app.post('/getBlocks', function(request, response) {
    db.getBlocks(request, response)
});

app.post('/getBoundaryGeometry', function(request, response) {
    db.getBoundaryGeometry(request, response)
});

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})