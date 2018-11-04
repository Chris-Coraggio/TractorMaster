//Create a single global variable
var MAPAPP = {};
MAPAPP.markers = [];
MAPAPP.currentInfoWindow;
MAPAPP.pathName = window.location.pathname;

var DATE;
var CATEGORY;
var STATES = [
    "CT",
    "DE",
    "MA",
    "MD",
    "MN",
    "NH",
    "NJ",
    "NY",
    "PA",
    "RI",
    "VT"
]

//Initialize our Google Map
function initialize() {
    var center = new google.maps.LatLng(36.14695, -86.803819); //Vanderbilt
    var mapOptions = {
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: center
    };
    this.map = new google.maps.Map(document.getElementById('map'),
        mapOptions);
};

// Fill map with markers
function populateMarkers(data) {
    var heatmap = []
    var markers = []
    data.forEach(store => {
        heatmap.push(new google.maps.LatLng(store.latitude, store.longitude))
    })
    data.forEach(store => {

        // the details of the marker for the store
        var marker = new google.maps.Marker({
            map: map,
            position: new google.maps.LatLng(store.latitude, store.longitude),
            shopname: store.nickname,
            details: store.phone,
            icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
        });
        markers.push(marker)

        // control what gets displayed when the icon is clicked
        var content = '<h1 class="mt0">' + marker.shopname + '</h1><p>' + marker.details + '</p>';
        marker.infowindow = new google.maps.InfoWindow({
            content: content,
            maxWidth: 400
        });

        google.maps.event.addListener(marker, 'click', function() {
            if (MAPAPP.currentInfoWindow) MAPAPP.currentInfoWindow.close();
            marker.infowindow.open(map, marker);
            MAPAPP.currentInfoWindow = marker.infowindow;
        });

        MAPAPP.markers.push(marker);
    })

    var heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatmap,
        map: map
    });

    var gradient = [
        'rgba(0, 255, 255, 0)',
        'rgba(0, 255, 255, 1)',
        'rgba(0, 191, 255, 1)',
        'rgba(0, 127, 255, 1)',
        'rgba(0, 63, 255, 1)',
        'rgba(0, 0, 255, 1)',
        'rgba(0, 0, 223, 1)',
        'rgba(0, 0, 191, 1)',
        'rgba(0, 0, 159, 1)',
        'rgba(0, 0, 127, 1)',
        'rgba(63, 0, 91, 1)',
        'rgba(127, 0, 63, 1)',
        'rgba(191, 0, 31, 1)',
        'rgba(255, 0, 0, 1)'
    ]
    heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
    heatmap.set('radius', heatmap.get('radius') ? null : 20);
    heatmap.set('opacity', heatmap.get('opacity') ? null : 0.2);

    // change the visibility of the markers based on zoom level

    google.maps.event.addListener(map, 'zoom_changed', function() {
        var zoom = map.getZoom();
        console.log("Current zoom level: " + zoom)
        // iterate over markers and call setVisible
        for (i = 0; i < markers.length; i++) {
            markers[i].setVisible(zoom > 8);
        }
    });
};

function snapToState(){
    var state = document.getElementById("stateSelected").value
    map.panTo(new google.maps.LatLng(states[state].lat, states[state].lng));
    map.setZoom(7);
}

function changeCategory(){
    CATEGORY = document.getElementById("categorySelected").value
    run_against_model_and_update_map()
}

function getRange(){
    // let date_format = "YYYY-MM-dd"
    var start_date = document.getElementById("date-picker-start").value
    var end_date = document.getElementById("date-picker-end").value
    start_date = new Date(start_date)
    end_date = new Date(end_date)
    var timeDiff = Math.abs(end_date - start_date);
    var num_days_diff = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
    document.getElementById("forecastSlider").max = num_days_diff
}

function toggleTwitter(){

}

function handleSlider(){
    var num_days_from_start = document.getElementById("forecastSlider").value
    start_date = new Date(start_date)
    DATE = start_date.addDays(num_days_from_start)
    run_against_model_and_update_map()
}

function run_against_model_and_update_map(){
    STATES.forEach(STATE => {
        var COUNT = query_model(DATE, CATEGORY, STATE)
        for()
    })
}

let states = {
    "Alabama": {"lat": 32.806671, "lng": -86.791130},
    "Alaska": {"lat": 61.370716, "lng": -152.404419},
    "Arizona": {"lat": 33.729759, "lng": -111.431221},
    "Arkansas": {"lat": 34.969704, "lng": -92.373123},
    "California": {"lat": 36.116203, "lng": -119.681564},
    "Colorado": {"lat": 39.059811, "lng": -105.311104},
    "Connecticut": {"lat": 41.597782, "lng": -72.755371},
    "Delaware": {"lat": 39.318523, "lng": -75.507141},
    "Florida": {"lat": 27.766279, "lng": -81.686783},
    "Georgia": {"lat": 33.040619, "lng": -83.643074},
    "Hawaii": {"lat": 21.094318, "lng": -157.498337},
    "Idaho": {"lat": 44.240459, "lng": -114.478828},
    "Illinois": {"lat": 40.349457, "lng": -88.986137},
    "Indiana": {"lat": 39.849426, "lng": -86.258278},
    "Iowa": {"lat": 42.011539, "lng": -93.210526},
    "Kansas": {"lat": 38.526600, "lng": -96.726486},
    "Kentucky": {"lat": 37.668140, "lng": -84.670067},
    "Louisiana": {"lat": 31.169546, "lng": -91.867805},
    "Maine": {"lat": 44.693947, "lng": -69.381927},
    "Maryland": {"lat": 39.063946, "lng": -76.802101},
    "Massachusetts": {"lat": 42.230171, "lng": -71.530106},
    "Michigan": {"lat": 43.326618, "lng": -84.536095},
    "Minnesota": {"lat": 45.694454, "lng": -93.900192},
    "Mississippi": {"lat": 32.741646, "lng": -89.678696},
    "Missouri": {"lat": 38.456085, "lng": -92.288368},
    "Montana": {"lat": 46.921925, "lng": -110.454353},
    "Nebraska": {"lat": 41.125370, "lng": -98.268082},
    "Nevada": {"lat": 38.313515, "lng": -117.055374},
    "New Hampshire": {"lat": 43.452492, "lng": -71.563896},
    "New Jersey": {"lat": 40.298904, "lng": -74.521011},
    "New Mexico": {"lat": 34.840515, "lng": -106.248482},
    "New York": {"lat": 42.165726, "lng": -74.948051},
    "North Carolina": {"lat": 35.630066, "lng": -79.806419},
    "North Dakota": {"lat": 47.528912, "lng": -99.784012},
    "Ohio": {"lat": 40.388783, "lng": -82.764915},
    "Oklahoma": {"lat": 35.565342, "lng": -96.928917},
    "Oregon": {"lat": 44.572021, "lng": -122.070938},
    "Pennsylvania": {"lat": 40.590752, "lng": -77.209755},
    "Rhode Island": {"lat": 41.680893, "lng": -71.511780},
    "South Carolina": {"lat": 33.856892, "lng": -80.945007},
    "South Dakota": {"lat": 44.299782, "lng": -99.438828},
    "Tennessee": {"lat": 35.747845, "lng": -86.692345},
    "Texas": {"lat": 31.054487, "lng": -97.563461},
    "Utah": {"lat": 40.150032, "lng": -111.862434},
    "Vermont": {"lat": 44.045876, "lng": -72.710686},
    "Virginia": {"lat": 37.769337, "lng": -78.169968},
    "Washington": {"lat": 47.400902, "lng": -121.490494},
    "West Virginia": {"lat": 38.491226, "lng": -80.954453},
    "Wisconsin": {"lat": 44.268543, "lng": -89.616508},
    "Wyoming": {"lat": 42.755966, "lng": -107.302490}
}