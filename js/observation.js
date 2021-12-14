var _checklistId;
var _checklistname;
var speciesSuggestionsArray =[];
var selectedSpeciesObject;

const showObservationDialogBox = (id) => {
    
    $("#link-tab").on('click', () => {
        console.log('Clicked');
        initMapClickForLocationCapture();
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

const submitObservationForm = () => {
    
    $('#submitObservationFormButton').click(function(e) {
        if($("#addObservationFileUpload").val() == ""){
            alert('PLease select a file to upload');
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
                    alert('Observation successfuly added');
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
			alert('Checklist ' + name + ' created.');
			$('#addChecklistModal').removeClass('u-dialog-open');
			getChecklists();
		}
		if(data == "exists") {
			alert('There exists a checklist by this name. Use a different checklist name.');
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
        url : 'https://api.catalogueoflife.org/dataset/2351/nameusage/suggest?fuzzy=false&limit=25&q=' + keyword,
        data: '',
        dataType: 'json',
        contentType: false,
        processData: false,            
        success: function(d) {
            $("#addObservationSpeciesNameDropDown").empty();
            if(d.hasOwnProperty('suggestions')) {
                speciesSuggestionsArray = d.suggestions;
                console.log(d.suggestions.map(({ match }) => match));
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

    /* Get the COL Id and send the details */
    //https://api.catalogueoflife.org/dataset/2351/taxon/5K5LD/info
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

    captureLocationMap.on('singleclick', function (evt) {
        var pos = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
        console.log(pos);
        $('#addObservationLatitude').val(pos[0]);
        $('#addObservationLongitude').val(pos[1]);
    });
}