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

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

console.log('Loaded imports')

const app = express()

const swaggerConfig = config.get('SwaggerConfig');
const swaggerOptions = swaggerConfig;
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
var appMode;
if(process.argv[2] == "dev"){
    appMode = "Development";
}
else if(process.argv[2] == "production")
    appMode = "Production";
else
    appMode = "Development";
console.log('Loading ' + appMode + ' mode')

const port = config.get(appMode + '.appPort');

//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


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


/**
 * @swagger
 * /getUserProfileStatistics:
 *   post:
 *     summary: Get profile statistics
 *     description: Use to get the user profile related statistics
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: The user's id.
 *                 example: user_id
 *     responses:
 *      '200':
 *         description: A Successful response
 */

app.post('/getUserProfileStatistics', function(request, response) {
    db.getUserProfileStatistics(request, response)
});

/**
 * @swagger
 * /addCheckList:
 *   post:
 *     summary: Add checklist
 *     description: Use to add a new checklist
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The checklist name.
 *                 example: checklist name
 *               description:
 *                 type: string
 *                 description: The checklist description.
 *                 example: Description of checklist
 *               is_group:
 *                 type: string
 *                 description: The checklist group type.
 *                 example: Yes/No
 *               group_count:
 *                 type: integer
 *                 description: The checklist group count.
 *                 example: 1
 *               travel_mode:
 *                 type: string
 *                 description: The checklist travel mode.
 *                 example: Travel modes
 *               user_id:
 *                 type: string
 *                 description: The checklist user id.
 *                 example: user_id
 * 
 *     responses:
 *      '200':
 *         description: A Successful response
 */
app.post('/addCheckList', (request, response) => {
    db.addCheckList(request, response)
})

/**
 * @swagger
 * /getChecklists:
 *   post:
 *     summary: Get checklists
 *     description: Use to get the list of checklists
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: The user's id.
 *                 example: user_id
 *     responses:
 *      '200':
 *         description: A Successful response
 */
app.post('/getChecklists', (request, response) => {
    db.getChecklists(request, response)
})

app.post('/addObservation', (request, response) => {
    db.addObservation(request, response)
})

/**
 * @swagger
 * /getObservations:
 *   post:
 *     summary: Get observations
 *     description: Use to get the list of observations for a checklist
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: The user's id.
 *                 example: user_id
 *               checkListId:
 *                 type: string
 *                 description: The checkListId id.
 *                 example: checklist id
 *               srs:
 *                 type: integer
 *                 description: The map projection.
 *                 example: 4326 
 *     responses:
 *      '200':
 *         description: A Successful response
 */
app.post('/getObservations', function(request, response) {
    db.getObservations(request, response)
});

/**
 * @swagger
 * /getObservationDetails:
 *   post:
 *     summary: Get observation details
 *     description: Use to get the details of the observation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               observationId:
 *                 type: string
 *                 description: The observationId id.
 *                 example: observation id
 *     responses:
 *      '200':
 *         description: A Successful response
 */
app.post('/getObservationDetails', function(request, response) {
    db.getObservationDetails(request, response)
});

//keyword
/**
 * @swagger
 * /searchSpecies:
 *   post:
 *     summary: Get species list
 *     description: Use to get the list of the species
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               keyword:
 *                 type: string
 *                 description: The keyword.
 *                 example: keyword
  *               srs:
 *                 type: integer
 *                 description: The map projection.
 *                 example: 4326
 *     responses:
 *      '200':
 *         description: A Successful response
 */
app.post('/searchSpecies', function(request, response) {
    db.searchSpecies(request, response)
});

/**
 * @swagger
 * /getTotalObservations:
 *   post:
 *     summary: Get total observations
 *     description: Use to get the total observations
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: The user's id.
 *                 example: user_id
 *               srs:
 *                 type: integer
 *                 description: The map projection.
 *                 example: 4326
 *     responses:
 *      '200':
 *         description: A Successful response
 */
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