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
    data.forEach(store => {

        // the details of the marker for the store
        var marker = new google.maps.Marker({
            map: map,
            position: new google.maps.LatLng(store.latitude, store.longitude),
            shopname: store.nickname,
            details: store.phone,
            icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
        });

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
};