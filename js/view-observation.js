var geomArray = [];
var map;
var geojsonObject;
const initOpenLayers =() => {
    var attribution = new ol.control.Attribution({
        collapsible: false
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
        view: new ol.View({
            center: ol.proj.fromLonLat([4.35247, 50.84673]),
            maxZoom: 18,
            zoom: 2
        })
    });

    var url_string = window.location.href
    var url = new URL(url_string);
    var checklistid = url.searchParams.get("checklistid");
    console.log(checklistid);
    if(checklistid == "")
        getObservations();
    else
        getObservations(checklistid);
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

        data.forEach((geom) => {
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
        console.log(data[0].json_row);
        var obj = data[0].json_row;
        
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

        var imageSourceCarousalItemHTML;
        var imageSourceHTML;
        obj.associated_media.split('|').forEach((item) => {
            imageSourceCarousalItemHTML += '<div class="u-active u-carousel-item u-gallery-item u-carousel-item-1">'
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


