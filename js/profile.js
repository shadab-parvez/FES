var geomArray = [];
var map;
var mapview;
var geojsonObject;

const initProfileMap =() => {
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
    getUserStatistics();
    getTotalUserObservations();
}

const getUserStatistics = () => {
    var data = {
        user_id : 'UserId_1'
    };
    fetch(getUserProfileStatistics,
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
            },
        body: JSON.stringify(data)
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
        console.log(data.data[0].checklists);
        console.log(data.data[0].identifications);
        console.log(data.data[0].images);
        console.log(data.data[0].observations);
        console.log(data.data[0].species);
        console.log(data.data[0].videos);

        $("#userProfileStatistics").append("<label>Checklists: " + data.data[0].checklists + "</label></br>");
        $("#userProfileStatistics").append("<label>Identifications: " + data.data[0].identifications + "</label></br>");
        $("#userProfileStatistics").append("<label>Images: " + data.data[0].images + "</label></br>");
        $("#userProfileStatistics").append("<label>Observations: " + data.data[0].observations + "</label></br>");
        $("#userProfileStatistics").append("<label>Species: " + data.data[0].species + "</label></br>");
        $("#userProfileStatistics").append("<label>Videos: " + data.data[0].videos + "</label></br>");
    })
}

const getTotalUserObservations = () => {
    map.getLayers().forEach(function (layer) {
        if(layer.get('name') == "myTotalObservations") {
            map.removeLayer(layer);
        }
    })

    var data = {
        user_id : 'UserId_1',
        srs: map.getView().getProjection().getCode().split(":")[1]
    };

    fetch(getTotalObservationsUrl,
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
                'geometry': JSON.parse(geom.sp_geometry)
            });
            
        })
        console.log(geojsonObject);

        const vectorSource = new ol.source.Vector({
            features: new ol.format.GeoJSON().readFeatures(geojsonObject)
        }); 
    
        const vectorLayer = new ol.layer.Vector({
            source: vectorSource,
            name: 'myTotalObservations',
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
    });

}