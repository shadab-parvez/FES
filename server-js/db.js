//const fileUpload = require('express-fileupload');
const config = require('config');
const Pool = require('pg').Pool
const fetch = require('cross-fetch');
var FormData = require('form-data');

var appMode;
if(process.argv[2] == "dev")
    appMode = "Development";
else if(process.argv[2] == "production")
    appMode = "Production";
else
    appMode = "Development";

const dbConfig = config.get(appMode + '.dbConfig');
const fileUploadPath = config.get(appMode + '.fileUploadPath');
const fileUploadVirtualPath = config.get(appMode + '.fileUploadVirtualPath');

const pool = new Pool(dbConfig)

const getUserProfileStatistics = (request, response) => {
    const {user_id } = request.body
    pool.connect()
    .then(client => {
        return client.query("SELECT * FROM sp_getprofilestatistics($1)", [user_id])
            .then(res => {
                client.release();
                response.status(200).send({data: res.rows})
            })
            .catch(e => {
                client.release();
                console.log(e.stack);
            })
    });
}

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
                    response.status(200).send(`added`);
                else if(res.rows[0].sp_addchecklist == "EXISTS")
                    response.status(200).send(`exists`);
                else
                    response.status(200).send('failed')
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
                response.status(200).send({data: res.rows})
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

    console.log(request.body.addObservationIndividualCount)
    console.log(request.body.addObservationSex)
    console.log(request.body.addObservationLifeStage)
    console.log(request.body.addObservationReproductiveCondition)
    console.log(request.body.addObservationBehaviour)
    console.log(request.body.addObservationRemarks)

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
    //response.status(200).send({ status: 'FILE_UPLOADED' });

    console.log(uploadFileArray);

    pool.connect()
    .then(client => {
        return client.query("SELECT * FROM sp_addObservation($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15," 
        + "$16, $17, $18, $19, $20, $21,"
        + "$22, $23, $24, $25, $26, $27,"
        + "$28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, $50, $51, $52, $53, $54, $55, $56, $57)",
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
            uploadExtensionArray,
            
            // For Occurence Table
            request.body.addObservationIndividualCount,
            request.body.addObservationLifeStage,
            request.body.addObservationReproductiveCondition,
            request.body.addObservationBehaviour,
            uploadVirtualPathArray.join("|"),
            request.body.addObservationRemarks,
            
            // For Location Table
            request.body.addObservationMinimumElevationInMeters,
            request.body.addObservationMaximumElevationInMeters,
            request.body.addObservationLocationRemarks,
            request.body.addObservationGeodeticDatum,
            request.body.addObservationCoordinateUncertainityInMeters, 
            request.body.addObservationCoordinatePrecision,

            // For Taxon
            request.body.addObservationTaxonID,
            request.body.addObservationScientificNameID,
            request.body.addObservationAcceptedNameUsageID,
            request.body.addObservationParentNameUsageID,
            request.body.addObservationOriginalNameUsageID,
            request.body.addObservationNameAccordingToID,
            request.body.addObservationScientificName,
            request.body.addObservationAcceptedNameUsage,
            request.body.addObservationParentNameUsage,
            request.body.addObservationOriginalNameUsage,
            request.body.addObservationHigherClassification,
            request.body.addObservationKingdom,
            request.body.addObservationPhylum,
            request.body.addObservationClass,
            request.body.addObservationOrder,
            request.body.addObservationFamily,
            request.body.addObservationSubfamily,
            request.body.addObservationGenus,
            request.body.addObservationGenericName,
            request.body.addObservationSubgenus,
            request.body.addObservationInfragenericEpithet,
            request.body.addObservationSpecificEpithet,
            request.body.addObservationInfraspecificEphithet,
            request.body.addObservationCultivarEpithet,
            request.body.addObservationTaxonRank,
            request.body.addObservationScientificNameAuthorship,
            request.body.addObservationVernacularName,
            request.body.addObservationNomenclaturalCode,
            request.body.addObservationTaxonomicStatus,
            request.body.addObservationNomenclaturalStatus]
            )
            .then(res => {
                client.release();
                console.log(res.rows);
                console.log(res.rows[0].sp_addobservation);
                if(res.rows[0].sp_addobservation == "SUCCESS")
                response.status(200).send({ status: 'SUCCESS' });
            })
            .catch(e => {
                client.release();
                console.log(e.stack);
            })
    });
}

const searchSpecies = (request, response) => {
    const { keyword, srs } = request.body
    console.log(keyword)
    console.log(request.body)
    pool.connect()
    .then(client => {
        return client.query("SELECT * FROM sp_searchSpecies($1, $2)", [keyword, srs])
            .then(res => {
                client.release();
                response.status(200).send(res.rows)
            })
            .catch(e => {
                client.release();
                console.log(e.stack);
            })
    });
}

const getObservations = (request, response) => {
    const {user_id, checkListId, srs } = request.body;
    pool.connect()
    .then(client => {
        return client.query('SELECT * FROM sp_getObservations($1, $2, $3)',
        [user_id, checkListId, srs])
            .then(res => {
                client.release();
                response.status(200).send({data: res.rows})
            })
            .catch(e => {
                client.release();
                console.log("ERROR");
                console.log(e.stack);
            })
    });
}

const getObservationDetails = (request, response) => {
    const {observationId } = request.body;
    pool.connect()
    .then(client => {
        return client.query('SELECT * FROM sp_getObservationDetails($1)',
        [observationId])
            .then(res => {
                client.release();
                response.status(200).send({data: res.rows})
            })
            .catch(e => {
                client.release();
                console.log(e.stack);
            })
    });
}

const getTotalObservations = (request, response) => {
    const {user_id, srs } = request.body;
    pool.connect()
    .then(client => {
        return client.query('SELECT * FROM sp_getUserObservationLocations($1, $2)',
        [user_id, srs])
            .then(res => {
                client.release();
                response.status(200).send({data: res.rows})
            })
            .catch(e => {
                client.release();
                console.log(e.stack);
            })
    });
}

const getStates = (request, response) => {
    fetch('https://adminhierarchy.indiaobservatory.org.in/API/getStates',
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
        response.status(200).send(data)
    })
}

const getDistricts = (request, response) => {
    const { state_id} = request.body
    var formData = new FormData();
    formData.append('state_id', state_id);
    fetch('https://adminhierarchy.indiaobservatory.org.in/API/getDistricts',
    {
        method: "POST",
        body: formData
    })
    .then(function(res) { return res.text(); })
    .then(function(data) {
        response.status(200).send(data)
    })
}

const getSubDistricts = (request, response) => {
    const { district_id} = request.body
    var formData = new FormData();
    formData.append('district_id', district_id);
    fetch('https://adminhierarchy.indiaobservatory.org.in/API/getSubDistricts',
    {
        method: "POST",
        body: formData
    })
    .then(function(res) { return res.text(); })
    .then(function(data) {
        response.status(200).send(data)
    })
}

const getBlocks = (request, response) => {
    const { district_id} = request.body
    var formData = new FormData();
    formData.append('district_id', district_id);
    fetch('https://adminhierarchy.indiaobservatory.org.in/API/getBlocks',
    {
        method: "POST",
        body: formData
    })
    .then(function(res) { return res.text(); })
    .then(function(data) {
        response.status(200).send(data)
    })
}

const getBoundaryGeometry = (request, response) => {
    const { region_id} = request.body
    var formData = new FormData();
    formData.append('region_id', region_id);
    fetch('https://adminhierarchy.indiaobservatory.org.in/API/getGeometry',
    {
        method: "POST",
        body: formData
    })
    .then(function(res) { return res.text(); })
    .then(function(data) {
        response.status(200).send(data)
    })
}



module.exports = {
    getUserProfileStatistics,
    addCheckList,
    getChecklists,
    addObservation,
    getObservations,
    getObservationDetails,
    searchSpecies,
    getTotalObservations,
    getStates,
    getDistricts,
    getSubDistricts,
    getBlocks,

    getBoundaryGeometry
  }