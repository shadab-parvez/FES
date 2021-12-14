//const fileUpload = require('express-fileupload');
const config = require('config');
const Pool = require('pg').Pool

const dbConfig = config.get('Staging.dbConfig');
const fileUploadPath = config.get('Staging.fileUploadPath');
const fileUploadVirtualPath = config.get('Staging.fileUploadVirtualPath');


const pool = new Pool(dbConfig)

const addCheckList = (request, response) => {
    const { name, description, is_group, group_count, travel_mode, user_id } = request.body
    pool.connect()
    .then(client => {
        return client.query('SELECT * FROM sp_addCheckList($1, $2, $3, $4, $5, $6)',
        [name, description, is_group, parseInt(group_count), travel_mode, user_id])
            .then(res => {
                client.release();
                console.log(res.rows[0]);
                if(res.rows[0].sp_addchecklist == "SUCCESS")
                    response.status(201).send(`added`);
                else if(res.rows[0].sp_addchecklist == "EXISTS")
                    response.status(201).send(`exists`);
                else
                    response.status(201).send('failed')
            })
            .catch(e => {
                client.release();
                console.log(e.stack);
            })
    });
}

const getChecklists = (request, response) => {
    const {user_id } = request.body
    pool.connect()
    .then(client => {
        return client.query("SELECT * FROM sp_getChecklists($1)", [user_id])
            .then(res => {
                client.release();
                response.status(201).send(res.rows)
            })
            .catch(e => {
                client.release();
                console.log(e.stack);
            })
    });
}

const addObservation = (request, response) => {
    let addObservationFileUpload;
    let uploadPath;
    let uploadVirtualPath;

    if (!request.files || Object.keys(request.files).length === 0) {
        return response.status(400).send('No files were uploaded.');
    }
    console.log(request.body.addObservationCheckListId)
    console.log(request.body.addObservationCheckListName)
    console.log(request.body.addObservationSpeciesCount)
    console.log(request.body.addObservationSpeciesName)
    console.log(request.body.addObservationSpeciesGender)
    console.log(request.body.addObservationMaleCount)
    console.log(request.body.addObservationFemaleCount)
    console.log(request.body.addObservationChildCount)
    console.log(request.body.addObservationUserId)
    console.log(request.body.addObservationLatitude)
    console.log(request.body.addObservationLongitude)

    addObservationFileUpload = request.files.addObservationFileUpload;
    var uploadFileArray = [];
    var uploadPathArray = [];
    var uploadVirtualPathArray = [];
    var uploadExtensionArray = [];
    if(addObservationFileUpload.name == undefined) {
        request.files.addObservationFileUpload.forEach((file)=> {
            uploadPath = fileUploadPath + file.name
            uploadPathArray.push(uploadPath);
            var _arr = uploadPath.split('.');
            uploadExtensionArray.push(_arr[_arr.length - 1].toUpperCase());
            uploadVirtualPathArray.push(fileUploadVirtualPath + file.name);
            file.mv(uploadPath, function(err) {
                if (err)
                    return response.status(500).send(err);
            });
        });
    }
    else {
        uploadPath = fileUploadPath + addObservationFileUpload.name;
        var _arr = uploadPath.split('.');
        uploadExtensionArray.push(_arr[_arr.length - 1].toUpperCase());
        uploadPathArray.push(uploadPath);
        uploadVirtualPathArray.push(fileUploadVirtualPath + addObservationFileUpload.name);
        addObservationFileUpload.mv(uploadPath, function(err) {
            if (err)
                return response.status(500).send(err);
        });
    }
    //response.setHeader('Content-Type', 'application/json');
    //response.status(201).send({ status: 'FILE_UPLOADED' });

    console.log(uploadFileArray);

    pool.connect()
    .then(client => {
        return client.query("SELECT * FROM sp_addObservation($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)", 
        [request.body.addObservationCheckListId,
            request.body.addObservationCheckListName,
            request.body.addObservationSpeciesCount,
            request.body.addObservationSpeciesName,
            request.body.addObservationSpeciesGender,
            request.body.addObservationMaleCount,
            request.body.addObservationFemaleCount,
            request.body.addObservationChildCount,
            request.body.addObservationUserId,
            request.body.addObservationLatitude,
            request.body.addObservationLongitude,
            "CC License",
            uploadPathArray,
            uploadVirtualPathArray,
            uploadExtensionArray])
            .then(res => {
                client.release();
                console.log(res.rows);
                console.log(res.rows[0].sp_addobservation);
                if(res.rows[0].sp_addobservation == "SUCCESS")
                response.status(201).send({ status: 'SUCCESS' });
            })
            .catch(e => {
                client.release();
                console.log(e.stack);
            })
    });
}


const getObservations = (request, response) => {
    const {user_id } = request.body;
    pool.connect()
    .then(client => {
        return client.query('SELECT * FROM sp_getObservations($1)',
        [user_id])
            .then(res => {
                client.release();
                response.status(201).send(res.rows)
            })
            .catch(e => {
                client.release();
                console.log(e.stack);
            })
    });
}



module.exports = {
    addCheckList,
    getChecklists,
    addObservation,
    getObservations
  }