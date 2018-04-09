$(document).ready(function () {
    $("#txtTimeZone").datepicker();
    $('#btnSubmit').click(function () {
        var dayLight = new Date(); 
        dayLight = new Date($('#txtTimeZone').val());
        if (dayLight.dst()) {
            timeZoneValue = dayLight.stdTimezoneOffset();// Day light time is OFF
        } else {
            timeZoneValue = dayLight.stdTimezoneOnset();// Day light time is ON
        }
        $("#placeholder").text('The time zone value for ' + dayLight + ' is ' + timeZoneValue);
    });
});

Date.prototype.dst = function () {
    return this.getTimezoneOffset() < this.stdTimezoneOffset();
}
Date.prototype.stdTimezoneOffset = function () {
    var jan = new Date(this.getFullYear(), 0, 1);
    var jul = new Date(this.getFullYear(), 6, 1);
    return (Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset()) * -1);
}
Date.prototype.stdTimezoneOnset = function () {
    var jan = new Date(this.getFullYear(), 0, 1);
    var jul = new Date(this.getFullYear(), 6, 1);
    return (Math.min(jan.getTimezoneOffset(), jul.getTimezoneOffset()) * -1);
}

// This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

function initAutocomplete() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -33.8688, lng: 151.2195 },
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });
    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();
        debugger;
        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        markers.forEach(function (marker) {
            marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));
            $('#latlon').text(place.geometry.location.lat() + ',' + place.geometry.location.lng() + ', The time zone value is ' + place.utc_offset);
            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });
}
