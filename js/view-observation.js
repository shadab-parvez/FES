var geomArray = [];
var map;
var mapview;
var geojsonObject;
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

    var url_string = window.location.href
    var url = new URL(url_string);
    var checklistid = url.searchParams.get("checklistid");
    console.log(checklistid);
    if(checklistid == "")
        getObservations();
    else
        getObservations(checklistid);

    getLocation();
    loadStates();
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

const getObservations = (checkListId) => {

    map.getLayers().forEach(function (layer) {
        if(layer.get('name') == "myObservations") {
            map.removeLayer(layer);
        }
    });
    var data;

    if(checkListId == "")
        data = {
            user_id: 'UserId_1',
            checkListId: ""
        };
    else
        data = {
            user_id: 'UserId_1',
            checkListId: checkListId
        };
    fetch(getObservationUrl,
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
            },
        body: JSON.stringify(data)
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
        geomArray = [];
        geojsonObject = {
            'type': 'FeatureCollection',
            'crs': {
              'type': 'name',
              'properties': {
                'name': 'EPSG:3857',
              },
            },
            'features': []
        }

        data.data.forEach((geom) => {
            geojsonObject.features.push({
                'type': 'Feature',
                'geometry': geom.json_row.geometry,
                'properties': geom.json_row.properties
            });
            
        })
        console.log(geojsonObject);

        const vectorSource = new ol.source.Vector({
            features: new ol.format.GeoJSON().readFeatures(geojsonObject)
        }); 
    
        const vectorLayer = new ol.layer.Vector({
            source: vectorSource,
            name: 'myObservations',
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
                
                getObservationDetails(feature.get('observation_id'));
                return;

                var content = '<h3>' + feature.get('collection_code') + '</h3>';
                content += '<table><thead><tr><th>Property</th><th>Value</th></tr></thead>';
                content += '<tbody><tr><td>Dataset name</td><td>' + feature.get('dataset_name') + '</td></tr>';
                content += '<tbody><tr><td>Basis of record</td><td>' + feature.get('basis_of_record') + '</td></tr>';
                content += '<tbody><tr><td>Child count</td><td>' + feature.get('child_count') + '</td></tr>';
                content += '<tbody><tr><td>Collection id</td><td>' + feature.get('collection_id') + '</td></tr>';
                content += '<tbody><tr><td>Dataset id</td><td>' + feature.get('dataset_id') + '</td></tr>';
                content += '<tbody><tr><td>Date</td><td>' + feature.get('date_time') + '</td></tr>';
                content += '<tbody><tr><td>Dynamic properties</td><td>' + feature.get('dynamic_properties') + '</td></tr>';
                content += '<tbody><tr><td>Male count</td><td>' + feature.get('male_count') + '</td></tr>';
                content += '<tbody><tr><td>Female count</td><td>' + feature.get('female_count') + '</td></tr>';
                content += '<tbody><tr><td>Child count</td><td>' + feature.get('child_count') + '</td></tr>';
                content += '<tbody><tr><td>Gender</td><td>' + feature.get('gender') + '</td></tr>';
                content += '<tbody><tr><td>Institution id</td><td>' + feature.get('institution_id') + '</td></tr>';
                content += '<tbody><tr><td>Institution code</td><td>' + feature.get('institution_code') + '</td></tr>';
                content += '<tbody><tr><td>Language</td><td>' + feature.get('language') + '</td></tr>';
                content += '<tbody><tr><td>License</td><td>' + feature.get('license') + '</td></tr>';
                content += '<tbody><tr><td>Rights holder</td><td>' + feature.get('rights_holder') + '</td></tr>';
                content += '<tbody><tr><td>Species count</td><td>' + feature.get('species_count') + '</td></tr>';
                content += '<tbody><tr><td>Type</td><td>' + feature.get('type') + '</td></tr>';
                //content += '<tbody><tr><td>URL</td><td>' + feature.get('file_uri') + '</td></tr>';
                content += '</tbody></table>';
                

                /* content += '<div class="u-gallery u-layout-grid u-lightbox u-no-transition u-show-text-on-hover u-gallery-1">'
                + '<div class="u-gallery-inner u-gallery-inner-1">'
                + '<div class="u-effect-fade u-gallery-item">'
                + '<div class="u-back-slide">'
                +  '<img class="u-back-image u-expanded" src="' + feature.get('file_uri').replace('/uploads', '') + '">'
                +  '</div>'
                +  '<div class="u-over-slide u-shading u-over-slide-1">'
                +  '<h3 class="u-gallery-heading"></h3>'
                +  '<p class="u-gallery-text"></p>'
                +  '</div>'
                + '</div>'
                
                + '</div>'
                + '</div>' */

                //$("#details").append(content);
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
    });
}

const getObservationDetails = (observationId) => {

    var data = {
        observationId
    }
    fetch(getObservationDetailsUrl,
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
            },
        body: JSON.stringify(data)
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
        console.log(data.data[0].json_row);
        var obj = data.data[0].json_row;
        
        $("#occurenceTimestamp").html("Occurence " + getOccurenceDateTime(obj.date_time));
        $("#speciesName").html("<i>" + obj.scientific_name + "</i>, " + obj.scientific_name_authorship);
        $("#vernacularName").html("<b>" + obj.vernacular_name + "</b> in " + languageStore[obj.language] + ", observed in <b>" + obj.continent + "</b>");
        $("#authorName").html("Published by " + obj.scientific_name_authorship);
        
        $("#mailCount").html(obj.male_count);
        $("#femailCount").html(obj.female_count);
        $("#childCount").html(obj.child_count);
        
        $("#taxon_id").html(obj.taxon_id);
        $("#species").html(obj.scientific_name);
        $("#kingdom").html(obj.kingdom);
        $("#phylum").html(obj.phylum);
        $("#class").html(obj.class);
        $("#order").html(obj.order);
        $("#family").html(obj.family);
        $("#subfamily").html(obj.subfamily);
        $("#genus").html(obj.genus);

        

        $("#basisOfRecord").html(basisOfRecordStore[obj.basis_of_record]);
        $("#collectionCode").html(obj.collection_code);
        $("#dynamicProperties").html(obj.dynamic_properties);
        $("#institutionCode").html(obj.institution_code);

        $("#occurenceId").html(obj.occurence_id);
        $("#behaviour").html(obj.behaviour);
        $("#individualCount").html(obj.individual_count);
        $("#recordedBy").html(obj.recorded_by);

        var imageSourceCarousalItemHTML = '';
        var imageSourceHTML = '';
        obj.associated_media.split('|').forEach((item, i) => {
            var active = '';
            if(i == 0)
                active = 'u-active';
            else 
                active = '';
            imageSourceCarousalItemHTML += '<div class="' + active + ' u-carousel-item u-gallery-item u-carousel-item-' + i + '">'
            + '                  <div class="u-back-slide">'
            + '                    <img class="u-back-image u-expanded" src="' + window.location.origin + "/" + item.replace('/uploads', '') + '">'
            + '                  </div>'
            + '                  <div class="u-over-slide u-over-slide-1">'
            + '                    <h3 class="u-gallery-heading">Sample Title</h3>'
            + '                    <p class="u-gallery-text">Sample Text</p>'
            + '                  </div>'
            + '                </div>';

            imageSourceHTML += '<li class="u-active u-carousel-thumbnail u-carousel-thumbnail-1" data-u-target="#carousel-a197" data-u-slide-to="0">'
            + '<img class="u-carousel-thumbnail-image u-image" src="' + window.location.origin + "/" + item.replace('/uploads', '') + '">'
            + '</li>';
        })

        $("#imageSourceCarousalItem").html(imageSourceCarousalItemHTML);
        $("#imageSource").html(imageSourceHTML);        
    });
    
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
    currentPosition.innerHTML = "<b>Latitude</b>: " + position.coords.latitude + ", <b>Longitude</b>: " + position.coords.longitude;
}


const inputWMSLayer = () => {
    $("#addWMSLayerDialog").addClass('u-dialog-open');
}

const addWMSLayer = () => {
    var layer = new ol.layer.Image({
        extent: [-13884991, 2870341, -7455066, 6338219],
        source: new ol.source.ImageWMS({
          url: $("#wmsServiceURL").val(),//'https://ahocevar.com/geoserver/wms','topp:states'
          params: {'LAYERS': $("#wmsLayerName").val()},
          ratio: 1,
          //serverType: 'geoserver',
        }),
      })
      map.addLayer(layer);
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