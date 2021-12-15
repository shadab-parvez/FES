var _checklistId;
var _checklistname;
var speciesSuggestionsArray =[];
var selectedSpeciesObject;

const showObservationDialogBox = (id) => {
    
    $("#link-tab").on('click', () => {
        console.log('Clicked');
        setTimeout(() => {
            if($("#captureLocationMap").find("canvas").attr("width") == undefined)
                initMapClickForLocationCapture();
        }, 300)
    });

    console.log(id);
    var _arr = id.split(',');
    $("#addObservationCheckListId").val(_arr[0]);
    _arr.shift();
    _checklistname = _arr.join(',');
    $('#addObservationDialogBox').addClass('u-dialog-open');
    $('#addObservationDialogBoxTitle').html("Checklist name: " + _checklistname);
    $("#addObservationCheckListName").val(_checklistname);
    $('#addObservationUserId').val(userId);

    $('#addObservationTabsHeaderList').find('a:first').click();
}

const limitUploadFileSize = () => {
    const input = document.getElementById('addObservationFileUpload')
    input.addEventListener('change', (event) => {
    const target = event.target;
        console.log(target.files[0].size);
        if (target.files && target.files[0]) {
            
        /*Maximum allowed size in bytes 5MB*/
        const maxAllowedSize = maxAllowedSizeInMB * 1024 * 1024;
        if (target.files[0].size > maxAllowedSize) {
            showErrorMessage('Select a file size less than ' + maxAllowedSizeInMB + ' MB');
            target.value = ''
        }
    }
    });
}

const submitObservationForm = () => {
    
    $('#submitObservationFormButton').click(function(e) {
        if($("#addObservationSpeciesCount").val() == "") {
            showErrorMessage('Please enter a value for species count');
            return;
        }
        if($("#addObservationSpeciesName").val() == "") {
            showErrorMessage('Please select species name');
            return;
        }
        if($("#addObservationSpeciesGender").val() == "") {
            showErrorMessage("Please select specie's gender");
            return;
        }
        if($("#addObservationMaleCount").val() == "") {
            showErrorMessage('Please enter the number of males');
            return;
        }
        if($("#addObservationFemaleCount").val() == "") {
            showErrorMessage('Please enter the number of females');
            return;
        }
        if($("#addObservationChildCount").val() == "") {
            showErrorMessage('Please enter the number of children');
            return;
        }
        if($("#addObservationLatitude").val() == "") {
            showErrorMessage('Please enter the latitude');
            return;
        }
        if($("#addObservationLongitude").val() == "") {
            showErrorMessage('Please enter the longitude');
            return;
        }
        if($("#addObservationFileUpload").val() == "") {
            showErrorMessage('Please select a file to upload');
            return;
        }

        // Ocurence Check
        if($("#addObservationIndividualCount").val() == "") {
            showErrorMessage('Please enter the individual count');
            return;
        }
        
        if($("#addObservationIndividualCount").val() == "") {
            showErrorMessage('Please enter the individual count');
            return;
        }

        e.preventDefault();
        var formData = new FormData($('#addObservationForm')[0]);
        $.ajax({
            type: 'POST',
            url : '/addObservation',
            data: formData,
            dataType: 'json',
            contentType: false,
            processData: false,            
            success: function(d) {
                if(d.status == "SUCCESS") {
                    showSuccessMessage('Observation successfuly added');
                    resetAddObservationForm();

                    $('#addObservationDialogBox').removeClass('u-dialog-open');
                }
                console.log(d);
            }
        });
    });
}

const resetAddObservationForm = () => {
    $('#addObservationSpeciesCount').val('');
    $('#addObservationSpeciesName').val('');
    $('#addObservationSpeciesGender').val('Select Gender');
    $('#addObservationMaleCount').val('');
    $('#addObservationFemaleCount').val('');
    $('#addObservationChildCount').val('');
    $('#addObservationFileUpload').val('');

    $('#addObservationLatitude').val('');
    $('#addObservationLongitude').val('');
}

const validateObservationData = () => {

}

const saveObservation = () => {

    console.log($('#addObservationIndividualCount').val());
    console.log($('#addObservationSex').val());
    console.log($('#addObservationLifeStage').val());
    console.log($('#addObservationReproductiveCondition').val());
    console.log($('#addObservationBehaviour').val());
    console.log($('#addObservationRemarks').val());

    var data = {
        // Checklist Id
        checklist_id: _checklistId,

        // Observation Fields
        species_count: $('#addObservationSpeciesCount').val(),
        species_name: $('#addObservationSpeciesName').val(),
        species_gender: $('#addObservationSpeciesGender').val(),
        male_count: $('#addObservationMaleCount').val(),
        female_count: $('#addObservationFemaleMaleCount').val(),
        child_count: $('#addObservationChildCount').val(),
        
        
        


        // Occurence Fields
		individual_count: $('#addObservationIndividualCount').val(),
		sex: $('#addObservationSex').val(), 
		life_stage: $('#addObservationLifeStage').val(), 
		reproductive_condition: $('#addObservationReproductiveCondition').val(), 
		behaviour: $('#addObservationBehaviour').val(),
        remarks: $('#addObservationRemarks').val(),
		user_id: userId,
        checklist_name: $('#addObservationDialogBoxTitle').html().split(':')[1].trim()
	};
	console.log(data)
	/* if(data.name == "" || data.description == "" || data.is_group == "" || data.travel_mode == "")
	{
		alert("Please fill all values");
		return;
	} */
	fetch(addObservationUrl,
	{
		method: "POST",
		headers: {
            "Content-Type": "application/json"
          },
		body: JSON.stringify(data)
	})
	.then(function(res){ return res.text(); })
	.then(function(data) {
		if(data == 'added') {
			const name = getValue('createCheckListName');
			setValue('createCheckListName', '');
			setValue('createCheckListDescription', '');
			setValue('createCheckListIsGroupYes', '');
			setValue('createCheckListGroupCount', '');
			setValue('createCheckListTravelMode', '');
			showSuccessMessage('Checklist ' + name + ' created.');
			$('#addChecklistModal').removeClass('u-dialog-open');
			getChecklists();
		}
		if(data == "exists") {
			showErrorMessage('There exists a checklist by this name. Use a different checklist name.');
		}
	})

}

function myFunction() {
    document.getElementById("addObservationSpeciesNameDropDown").classList.toggle("show");
}

const getSpeciesOnKeyPress = (keyword) => {
    //console.log(keyword);
    //if(keyword.length<=2)
        //return;
    $("#addObservationSpeciesNameDropDown").show();
    $.ajax({
        type: 'GET',
        url : COLSpeciesListURL + keyword,
        data: '',
        dataType: 'json',
        contentType: false,
        processData: false,            
        success: function(d) {
            $("#addObservationSpeciesNameDropDown").empty();
            if(d.hasOwnProperty('suggestions')) {
                speciesSuggestionsArray = d.suggestions;
                d.suggestions.map(({ match }) => match).forEach((matchedItem) => {
                    $("#addObservationSpeciesNameDropDown").append('<a href="#" onclick="selectSpeciesValue(this.innerHTML)">' + matchedItem + '</a>');
                });
            }
            else {
                $("#addObservationSpeciesNameDropDown").append('<a href="#">No match found</a>');
            }
        }
    });
}

const selectSpeciesValue = (value) => {
    selectedSpeciesObject = speciesSuggestionsArray.filter((val) => value == val.match);
    $("#addObservationSpeciesName").val(value);
    $("#addObservationSpeciesNameDropDown").hide();

    //speciesSuggestionsArray[0].usageId + '/info'

    /* Get the COL Id and send the details */
    //https://api.catalogueoflife.org/dataset/2351/taxon/5K5LD/info
    $.ajax({
        type: 'GET',
        url : COLTaxonomyURL + speciesSuggestionsArray[0].usageId + '/info',
        data: '',
        dataType: 'json',
        contentType: false,
        processData: false,            
        success: function(d) {
            $("#addObservationTaxonID").val(speciesSuggestionsArray[0].usageId);
            $("#addObservationScientificNameID").val(speciesSuggestionsArray[0].usageId);
            $("#addObservationAcceptedNameUsageID").val(speciesSuggestionsArray[0].usageId);
            $("#addObservationScientificName").val(d.taxon.name.scientificName);
            
            $("#addObservationOriginalNameUsageID").val('');
            $("#addObservationNameAccordingToID").val('');
            $("#addObservationAcceptedNameUsage").val('');
            $("#addObservationParentNameUsage").val('');
            $("#addObservationOriginalNameUsage").val('');
            $("#addObservationHigherClassification").val('');
            
            $("#addObservationGenericName").val(d.taxon.name.scientificName);
            $("#addObservationSubgenus").val('');
            $("#addObservationInfragenericEpithet").val('');
            $("#addObservationSpecificEpithet").val(d.taxon.name.specificEpithet);
            $("#addObservationInfraspecificEphithet").val(d.taxon.name.infraspecificEpithet);
            $("#addObservationCultivarEpithet").val('');
            $("#addObservationTaxonRank").val(d.taxon.name.rank);
            $("#addObservationScientificNameAuthorship").val(d.taxon.name.authorship);
            vernacularNamesItemsArray = [];
            if(d.vernacularNames != undefined){
                d.vernacularNames.forEach((vernacularNamesItem) => {
                    vernacularNamesItemsArray.push(vernacularNamesItem.name);
                })
            }

            $("#addObservationVernacularName").val(vernacularNamesItemsArray.join(" | "));
            $("#addObservationNomenclaturalCode").val(d.taxon.name.code);
            $("#addObservationTaxonomicStatus").val(d.taxon.name.nomStatus);
            $("#addObservationNomenclaturalStatus").val('');
        }
    });

    $.ajax({
        type: 'GET',
        url : COLTaxonHeirarchyURL.replace('COLID', speciesSuggestionsArray[0].usageId),
        data: '',
        dataType: 'json',
        contentType: false,
        processData: false,            
        success: function(d) {

            d.forEach((item) => {
                d.forEach((subItem) => {
                    if(item.parentId == subItem.id && subItem.rank == "kingdom") {
                        $("#addObservationKingdom").val(subItem.name);
                    }
                    if(item.parentId == subItem.id && subItem.rank == "phylum") {
                        $("#addObservationPhylum").val(subItem.name);
                    }
                    if(item.parentId == subItem.id && subItem.rank == "subphylum") {
                        console.log("subphylum: ", subItem.name)
                    }
                    if(item.parentId == subItem.id && subItem.rank == "class") {
                        $("#addObservationClass").val(subItem.name);
                    }
                    if(item.parentId == subItem.id && subItem.rank == "subclass") {
                        console.log("subclass: ", subItem.name)
                    }
                    if(item.parentId == subItem.id && subItem.rank == "infraclass") {
                        console.log("infraclass: ", subItem.name)
                    }
                    if(item.parentId == subItem.id && subItem.rank == "order") {
                        $("#addObservationOrder").val(subItem.name);
                    }
                    if(item.parentId == subItem.id && subItem.rank == "family") {
                        $("#addObservationFamily").val(subItem.name);
                    }
                    if(item.parentId == subItem.id && subItem.rank == "subfamily") {
                        $("#addObservationSubfamily").val(subItem.name);
                    }
                    if(item.parentId == subItem.id && subItem.rank == "genus") {
                        $("#addObservationGenus").val(subItem.name);
                    }
                    if(item.parentId == subItem.id && subItem.rank == "species") {
                        $("#addObservationParentNameUsageID").val(item.parentId);
                    }
                    if(item.parentId == subItem.id && subItem.rank == "subspecies") {
                        console.log("subspecies: ", subItem.name)
                    }
                });
            })
        }
    });
}

var captureLocationMap;
const initMapClickForLocationCapture = () => {
    $("#captureLocationMap").empty();
    var attribution = new ol.control.Attribution({
        collapsible: false
    });
    captureLocationMap = new ol.Map({
        controls: ol.control.defaults({attribution: false}).extend([attribution]),
        layers: [
            new ol.layer.Tile({
              source: new ol.source.OSM()
            })
        ],
        target: 'captureLocationMap',
        view: new ol.View({
            center: ol.proj.fromLonLat([4.35247, 50.84673]),
            maxZoom: 18,
            zoom: 2
        })
    });

    const source = new ol.source.Vector({wrapX: false});
    var draw = new ol.interaction.Draw({
        source: source,
        type: 'Point',
    });
    captureLocationMap.addInteraction(draw);

    captureLocationMap.on('singleclick', function (evt) {
        var pos = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
        $('#addObservationLatitude').val(pos[0]);
        $('#addObservationLongitude').val(pos[1]);

        const vectorSource = new ol.source.Vector({
            features: new ol.format.GeoJSON().readFeatures({
                'type': 'Feature',
                'geometry': {
                    'coordinates':[evt.coordinate[0], evt.coordinate[1]],
                    'type': 'Point'
                }
            })
        }); 
    
        captureLocationMap.getLayers().forEach(function (layer) {
            if(layer.get('name') == "placemarker") {
                captureLocationMap.removeLayer(layer);
            }
        });

        const vectorLayer = new ol.layer.Vector({
            source: vectorSource,
            name: 'placemarker',
            style: [new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 8,
                    fill: new ol.style.Fill({
                        color: [255, 255, 255, 0.3]
                    }),
                    stroke: new ol.style.Stroke({color: '#FF0000', width: 2})
                })
            })],
        });
        captureLocationMap.addLayer(vectorLayer);

    });
}