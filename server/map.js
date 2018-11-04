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
var STATE;

var twitter_markers = []
var heatmap_arr = []
var countmap_arr = [];
var heatmap;
var stores_by_state = {}
var ave_counts_by_state = {}

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
    var start_date = document.getElementById("date-picker-start").value
    DATE = new Date(start_date)
    console.log(formatDate(DATE))
    process_twitter()
};

// Fill map with markers
function populateMarkers(data) {
    var markers = []
    data.forEach(store => {
        stores_by_state[store.state] = []
        stores_by_state[store.state].push({location: new google.maps.LatLng(store.latitude, store.longitude), weight:0.2})
        // heatmap_arr.push({location: new google.maps.LatLng(store.latitude, store.longitude), weight:0.2})
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

    heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatmap_arr,
        map: map
    });

    this.gradient = [
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
        // iterate over markers and call setVisible
        for (i = 0; i < markers.length; i++) {
            markers[i].setVisible(zoom > 8);
        }
    });

    map.data.addListener('mouseover', mouseInToRegion);
    map.data.addListener('mouseout', mouseOutOfRegion);
    map.data.loadGeoJson('https://storage.googleapis.com/mapsdevsite/json/states.js', { idPropertyName: 'STATE' });

};

/**
       * Responds to the mouse-in event on a map shape (state).
       *
       * @param {?google.maps.MouseEvent} e
       */
      function mouseInToRegion(e) {
        // set the hover state so the setStyle function can change the border
        console.log("You are in " + e.feature.getProperty('NAME'))
        var stateName = e.feature.getProperty('NAME')
        var stateAbbrev = statesToAbbrev[stateName]
        var count = ave_counts_by_state[stateAbbrev]
        console.log("The average count here is " + count)
        e.feature.setProperty('state', 'hover');
      }

      /**
       * Responds to the mouse-out event on a map shape (state).
       *
       * @param {?google.maps.MouseEvent} e
       */
      function mouseOutOfRegion(e) {
        // reset the hover state, returning the border to normal
        e.feature.setProperty('state', 'normal');
      }

function snapToState(){
    var state = document.getElementById("stateSelected").value
    map.panTo(new google.maps.LatLng(states[state].lat, states[state].lng));
    map.setZoom(7);
}

function changeCategory(){
    CATEGORY = document.getElementById("categorySelected").value
    console.log("Category is now: " + CATEGORY)
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

function process_twitter(){
    Object.entries(twitter_by_state).forEach(arr =>{
        state_name = arr[0]
        twitter_coeff = arr[1]
        if(states[state_name]){

            // the details of the marker for the store
            var marker = new google.maps.Marker({
                map: map,
                position: new google.maps.LatLng(states[state_name].lat, states[state_name].lng),
                shopname: state_name,
                details: twitter_coeff,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: twitter_coeff,
                    fillColor: "#32CD32",
                    fillOpacity: 0.8,
                    strokeWeight: 0.4
                },
            });
            twitter_markers.push(marker)

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
        }
    })
    toggleTwitter()
}

function toggleTwitter(){
    // console.log("Toggling!")
    twitter_markers.forEach(marker => {
        // console.log(marker)
        // console.log(marker.visible)
        marker.setVisible(!marker.visible)
    })
}

function handleSlider(){
    console.log("Handling slider!")
    var num_days_from_start = document.getElementById("forecastSlider").value
    console.log(num_days_from_start)
    var start_date = document.getElementById("date-picker-start").value
    start_date = new Date(start_date)
    DATE.setDate(start_date.getDate() + num_days_from_start)
    document.getElementById("currDate").innerHTML = "Current Date: " + formatDate(DATE)
    run_against_model_and_update_map()
}

function run_against_model_and_update_map(){
    if(!CATEGORY || !DATE){
        return;
    }
    var numStates = STATES.length
    var numStatesProcessed = 0
    countmap_arr.splice(0, countmap_arr.length - 1);
    let promises = [];
    STATES.forEach(state => {
        promises.push(new Promise((res, rej) => {
            query_model(state, CATEGORY, DATE)
            .then(data => data.json())
            .then(count => {
                if(count.prediction == null){
                    COUNT = 0
                } else {
                    COUNT = count.prediction
                }
                stores_by_state[state].forEach(store=>{
                    console.log(store)
                    countmap_arr.push({location: new google.maps.LatLng(store.location.lat(), store.location.lng()), weight: 200 * COUNT})
                    ave_counts_by_state[state] = COUNT
                })
                res()
            }).catch(err => {console.error(err); rej()})
        }));
    });
    Promise.all(promises).then(() => {
        console.log(countmap_arr);
        heatmap.setData(countmap_arr);
    });
}

function query_model(s, c, d){
    // console.log(JSON.stringify({date: formatDate(DATE).replace("/", "-"), category: CATEGORY, state: STATE}))
    return fetch("http://localhost:3000/count", {method: 'POST', headers: {
        "Content-Type": "application/json; charset=utf-8",
    }, body: JSON.stringify({date: formatDate(d), category: c, state: s})})
}

function formatDate(date) {
    var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    var temp_date = [year, month, day].join('-');
    temp_date = temp_date.replace("/", "-")
    return temp_date
}

function animation(){
    var end_date = document.getElementById("date-picker-end").value
    end_date = new Date(end_date)
    end_date.setDate(end_date.getDate() + 1) //to include the last date
    var num_days_from_start = document.getElementById("forecastSlider").value
    console.log(num_days_from_start)
    var start_date = document.getElementById("date-picker-start").value
    start_date = new Date(start_date)
    DATE.setDate(start_date.getDate() + num_days_from_start)
    var count = 0
    while(formatDate(DATE) != formatDate(end_date)){
        console.log("DATE: " + formatDate(DATE))
        console.log("END: " + formatDate(end_date))
        document.getElementById("currDate").innerHTML = "Current Date: " + formatDate(DATE)
        document.getElementById("forecastSlider").value++
        run_against_model_and_update_map()
        DATE.setDate(DATE.getDate() + 1)
        if(++count == 20){
            break; // sanity check on dates
        }
    }
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

let twitter_by_state = {
    "Arizona": -0.99,
    "California": 1.97,
    "Colorado": 1.54,
    "Florida": 3.43,
    "Georgia": 6.77,
    "Indiana": 12.6,
    "Lousiana": 2.21,
    "Massachusetts": 1.46,
    "Montana": 2.08,
    "Nevada": 10.35,
    "North Carolina": 2.12,
    "Ohio": 2.12,
    "Oklahoma": 6.09,
    "Pennsylvania": 22.11,
    "Rhode Island": 22.11,
    "Tennessee": 16.0,
    "Texas": 2.12,
    "Utah": 21.18,
    "Virginia": 22.11,
    "Washington": 15.61,
    "Alabama": 13.6,
    "Kentucky": 30.49,
    "Maryland": 40.02,
    "Mississippi": 27.85,
    "Nebraska": 30.1,
    "New Mexico": 27.85,
    "Oregon": 32.57
}

var statesToAbbrev = {
    'Arizona': 'AZ',
    'Alabama': 'AL',
    'Alaska': 'AK',
    'Arizona': 'AZ',
    'Arkansas': 'AR',
    'California': 'CA',
    'Colorado': 'CO',
    'Connecticut': 'CT',
    'Delaware': 'DE',
    'Florida': 'FL',
    'Georgia': 'GA',
    'Hawaii': 'HI',
    'Idaho': 'ID',
    'Illinois': 'IL',
    'Indiana': 'IN',
    'Iowa': 'IA',
    'Kansas': 'KS',
    'Kentucky': 'KY',
    'Kentucky': 'KY',
    'Louisiana': 'LA',
    'Maine': 'ME',
    'Maryland': 'MD',
    'Massachusetts': 'MA',
    'Michigan': 'MI',
    'Minnesota': 'MN',
    'Mississippi': 'MS',
    'Missouri': 'MO',
    'Montana': 'MT',
    'Nebraska': 'NE',
    'Nevada': 'NV',
    'New Hampshire': 'NH',
    'New Jersey': 'NJ',
    'New Mexico': 'NM',
    'New York': 'NY',
    'North Carolina': 'NC',
    'North Dakota': 'ND',
    'Ohio': 'OH',
    'Oklahoma': 'OK',
    'Oregon': 'OR',
    'Pennsylvania': 'PA',
    'Rhode Island': 'RI',
    'South Carolina': 'SC',
    'South Dakota': 'SD',
    'Tennessee': 'TN',
    'Texas': 'TX',
    'Utah': 'UT',
    'Vermont': 'VT',
    'Virginia': 'VA',
    'Washington': 'WA',
    'West Virginia': 'WV',
    'Wisconsin': 'WI',
    'Wyoming': 'WY',
};