//Create a single global variable
var MAPAPP = {};
MAPAPP.markers = [];
MAPAPP.currentInfoWindow;
MAPAPP.pathName = window.location.pathname;

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