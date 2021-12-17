const toggleDropDownDiv = () => {
    document.getElementById("searchSpeciesTextBoxDropDown").classList.toggle("show");
}

const toggleList = () => {
    if($(".adminToolset").css('right') == '0px') {
        $(".adminToolset").animate({right: '-310px'});
        $("#toggleAdminSearchTools").text("Show");
    }
    else{
        $(".adminToolset").animate({right: '0px'});
        $("#toggleAdminSearchTools").text("Hide");
    }
}

const inputWMSLayer = () => {
    $("#addWMSLayerDialog").addClass('u-dialog-open');
}

const searchSpeciesOnKeyPress = (keyword) => {
    console.log(keyword);
    if(keyword.length<=2) {
        map.getLayers().forEach(function (layer) {
            if(layer.get('name') == "mySearchedSpeciesLayer") {
                map.removeLayer(layer);
            }
        });
        $("#searchSpeciesTextBoxDropDown").hide();
        return;
    }
    $("#searchSpeciesTextBoxDropDown").show();
    fetch(searchSpeciesUrl,
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
            },
        body: JSON.stringify({keyword})
    })
    .then(function(res){ return res.text(); })
    .then(function(data) {
        $("#searchSpeciesTextBoxDropDown").empty();
        console.log(data);
        data = JSON.parse(data);
        
        speciesGeojsonObject = {
            'type': 'FeatureCollection',
            'crs': {
              'type': 'name',
              'properties': {
                'name': 'EPSG:3857',
              },
            },
            'features': []
        }

        data.forEach((item) => {
            $("#searchSpeciesTextBoxDropDown").append('<a href="#" id=' + item.sp_observation_id + ' onclick="selectSpeciesValue(this.id)">' + 
            '<b style="color: #3e668d">' + item.sp_scientific_name + '</b>: ' + item.sp_kingdom + '>' + item.sp_phylum + ' > ' + item.sp_class + ' > ' + item.sp_order + ' > ' + item.sp_family + ' > ' + item.sp_subfamily + ' > ' + item.sp_genus + ' > ' + item.sp_generic_name + ' > ' + item.sp_vernacular_name + '</a>');
            speciesGeojsonObject.features.push({
                'type': 'Feature',
                'geometry': JSON.parse(item.sp_geom)
                //'properties': geom.json_row.properties
            });
            
        })
        console.log(speciesGeojsonObject);

        const vectorSource = new ol.source.Vector({
            features: new ol.format.GeoJSON().readFeatures(speciesGeojsonObject)
        }); 
    
        const vectorLayer = new ol.layer.Vector({
            source: vectorSource,
            name: 'mySearchedSpeciesLayer',
            style: [new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 8,
                    fill: new ol.style.Fill({
                        color: [255, 255, 255, 0.3]
                    }),
                    stroke: new ol.style.Stroke({color: '#cb1d1d', width: 2})
                })
            })],
        });
        map.getLayers().forEach(function (layer) {
            if(layer.get('name') == "mySearchedSpeciesLayer") {
                map.removeLayer(layer);
            }
        });
        map.addLayer(vectorLayer);
    })
}

const selectSpeciesValue = (value) => {
    console.log(value);
    //$("#addObservationSpeciesName").val(value);
    $("#searchSpeciesTextBoxDropDown").hide();
}

var geomArray = [];
var map;
var mapview;
var speciesGeojsonObject;
const initOpenLayers =() => {
    var attribution = new ol.control.Attribution({
        collapsible: false
    });
    mapview = new ol.View({
        center: ol.proj.fromLonLat([4.35247, 50.84673]),
        maxZoom: 18,
        zoom: 2,
        extent: [1193621.21746663, -788296.0228458717, 16055425.50101002, 5082067.749455664]
    });
    map = new ol.Map({
        controls: ol.control.defaults({attribution: false}).extend([attribution]),
        interactions: ol.interaction.defaults({mouseWheelZoom:false}),
        layers: [
            new ol.layer.Tile({
              source: new ol.source.OSM()
            })
        ],
        target: 'map',
        view: mapview
    });

    map.getView().fit([1193621.21746663, -788296.0228458717, 16055425.50101002, 5082067.749455664] , map.getSize());

    getLocation();
    loadStates();
}

var currentPosition = document.getElementById("currentPosition");
const getLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        currentPosition.innerHTML = "Geolocation is not supported by this browser.";
    }
}

const showPosition = (position) => {
    //currentPosition.innerHTML = "<b>Latitude</b>: " + position.coords.latitude + ", <b>Longitude</b>: " + position.coords.longitude;
}


var layerDataProjection;

const showStatesGeometry = () => {
    layerDataProjection = 'EPSG:3857';
    getBoundaryGeometry($("#statesCombo").val());
}

const showDistrictsGeometry = () => {
    layerDataProjection = 'EPSG:4326';
    getBoundaryGeometry($("#districtsCombo").val());
}

const showSubDistrictsGeometry = () => {
    layerDataProjection = 'EPSG:4326';
    getBoundaryGeometry($("#subDistrictsCombo").val());
}

const showBlocksGeometry = () => {
    layerDataProjection = 'EPSG:4326';
    getBoundaryGeometry($("#blocksCombo").val());
}

const loadStates = () => {
    fetch('/getStates',
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        //body: JSON.stringify(data)
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
        data.text.forEach((item) => {
            $("#statesCombo").append('<option value="' + item.lid + '">' + item.name + '</option>');
        })
    })
}

const loadDistricts = (state_id) => {
    console.log(state_id)
    $("#adminSearchPanelLoader").show();
    var data = {
		state_id
	};
    fetch('/getDistricts',
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
        $("#adminSearchPanelLoader").hide();
        $('#districtsCombo').empty().append('<option value="">Select Districts</option>');
        $('#subDistrictsCombo').empty().append('<option value="">Select Sub Districts</option>');
        $('#blocksCombo').empty().append('<option value="">Select Blocks</option>');
        data.text.forEach((item) => {
            $("#districtsCombo").append('<option value="' + item.id + '">' + item.name + '</option>');
        })
    })
}

const loadSubDistricts = (district_id) => {
    console.log(district_id)
    $("#adminSearchPanelLoader").show();
    var data = {
		district_id
	};
    fetch('/getSubDistricts',
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
        $("#adminSearchPanelLoader").hide();
        $('#subDistrictsCombo').empty().append('<option value="">Select Sub Districts</option>');
        data.text.forEach((item) => {
            $("#subDistrictsCombo").append('<option value="' + item.id + '">' + item.name + '</option>');
        })
    })
}

const loadBlocks = (district_id) => {
    console.log(district_id)
    $("#adminSearchPanelLoader").show();
    var data = {
		district_id
	};
    fetch('/getBlocks',
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
        $("#adminSearchPanelLoader").hide();
        $('#blocksCombo').empty().append('<option value="">Select Blocks</option>');
        data.text.forEach((item) => {
            $("#blocksCombo").append('<option value="' + item.id + '">' + item.name + '</option>');
        })
    })
}

const getBoundaryGeometry = (region_id) => {
    var data = {
		region_id
	};
    $("#adminSearchPanelLoader").show();
    fetch('/getBoundaryGeometry',
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
        $("#adminSearchPanelLoader").hide();
        data.text.forEach((item) => {

        const format = new ol.format.WKT();

        const feature = format.readFeature(item.geometry, {
            dataProjection: layerDataProjection,
            featureProjection: 'EPSG:3857',
        });
        
        const wktLayer = new ol.layer.Vector({
            name: 'wktLayer',
            source: new ol.source.Vector({
            features: [feature],
            }),
        });
        map.getLayers().forEach(function (layer) {
            if(layer.get('name') == "wktLayer") {
                map.removeLayer(layer);
            }
        });
        map.addLayer(wktLayer);
        console.log('WKT added');

        if($("#zoomToFeature").is(":checked")) {
            
            var coord1 = ol.proj.transform([parseFloat(item.xmin), parseFloat(item.ymin)], layerDataProjection, 'EPSG:3857');
            var coord2 = ol.proj.transform([parseFloat(item.xmax), parseFloat(item.ymax)], layerDataProjection, 'EPSG:3857');

            map.getView().fit([coord1[0], coord1[1], coord2[0], coord2[1]] , map.getSize());
        }
            
        })
    })
}