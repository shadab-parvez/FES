const toggleDropDownDiv = () => {
    document.getElementById("searchSpeciesTextBoxDropDown").classList.toggle("show");
}

speciesGeojsonObject
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
            $("#searchSpeciesTextBoxDropDown").append('<a href="#" onclick="selectSpeciesValue(this.innerHTML)">' + 
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
    //loadStates();
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