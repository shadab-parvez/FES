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
        body: JSON.stringify({keyword, srs: map.getView().getProjection().getCode().split(":")[1]})
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
            var _item = item.json_row;
            $("#searchSpeciesTextBoxDropDown").append('<a href="#" id=' + _item.properties.observation_id + ' onclick="selectSpeciesValue(this.id)" > ' + 
            '<b style="color: #3e668d">' + _item.properties.scientific_name + '</b>: ' + _item.properties.kingdom + ' > ' + _item.properties.phylum + ' > ' + _item.properties.class + ' > ' + _item.properties.order + ' > ' + _item.properties.family + ' > ' + _item.properties.subfamily + ' > ' + _item.properties.genus + ' > ' + _item.properties.generic_name + ' > ' + _item.properties.vernacular_name + '</a>');
            speciesGeojsonObject.features.push({
                'type': 'Feature',
                'geometry': _item.geometry,
                'properties': _item.properties
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

        // Add Pop up
        var container = document.getElementById('popup');
        var content_element = document.getElementById('popup-content');
        var closer = document.getElementById('popup-closer');

        var overlay = new ol.Overlay({
            element: container,
            autoPan: true,
            offset: [0, -10],
            autoPanAnimation: {
                duration: 250
            }
        });
        map.addOverlay(overlay);

        closer.onclick = function() {
            overlay.setPosition(undefined);
            closer.blur();
            return false;
        };

        map.on('click', function(evt) {
            var feature = map.forEachFeatureAtPixel(evt.pixel,
              function(feature, layer) {
                return feature;
              });
            if (feature) {
                var geometry = feature.getGeometry();
                var coord = geometry.getCoordinates();
                
                $(".ol-popup").show();
                var content = '<h3>' + feature.get('vernacular_name') + '</h3>';
                content += '<table><thead><tr><th>Property</th><th>Value</th></tr></thead>';
                content += '<tbody><tr><td>Scientific name</td><td>' + feature.get('scientific_name') + '</td></tr>';
                content += '<tbody><tr><td>Kingdom</td><td>' + feature.get('kingdom') + '</td></tr>';
                content += '<tbody><tr><td>Phylum</td><td>' + feature.get('phylum') + '</td></tr>';
                content += '<tbody><tr><td>Class</td><td>' + feature.get('class') + '</td></tr>';
                content += '<tbody><tr><td>Order</td><td>' + feature.get('order') + '</td></tr>';
                content += '<tbody><tr><td>Family</td><td>' + feature.get('family') + '</td></tr>';
                content += '<tbody><tr><td>Subfamily</td><td>' + feature.get('subfamily') + '</td></tr>';
                content += '<tbody><tr><td>Genus</td><td>' + feature.get('genus') + '</td></tr>';
                content += '<tbody><tr><td>Generic name</td><td>' + feature.get('generic_name') + '</td></tr>';
                content += '<tbody><tr><td>Vernacular name</td><td>' + feature.get('vernacular_name') + '</td></tr>';
                content += '</tbody></table>';

                content_element.innerHTML = content;
                overlay.setPosition(coord);
                
            }
        });


        map.on("pointermove", function (evt) {
            var hit = this.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
                return true;
            }); 
            if (hit) {
                this.getTargetElement().style.cursor = 'pointer';
            } else {
                this.getTargetElement().style.cursor = '';
            }
        });
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