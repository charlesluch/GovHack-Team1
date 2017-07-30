
var geocoder;
var map;

function autocomplete() {
        autocomplete = new google.maps.places.Autocomplete(
            /** @type {!HTMLInputElement} */ (
                document.getElementById('start')), {
              types: ['address']
        });
        autocomplete2 = new google.maps.places.Autocomplete(
            /** @type {!HTMLInputElement} */ (
                document.getElementById('end')), {
              types: ['address']
        });
}


function initMap() {
        geocoder = new google.maps.Geocoder();
        var latlng = new google.maps.LatLng(-27.4698, 153.0251);
        var directionsService = new google.maps.DirectionsService;
        var homeTOpark = new google.maps.DirectionsRenderer({
                                              preserveViewport: true,
                                              suppressMarkers : true,
                                              polylineOptions : {strokeColor:'red'}});
        var parkTObike = new google.maps.DirectionsRenderer({
                                              preserveViewport: true,
                                              suppressMarkers : true,
                                              polylineOptions : {strokeColor:'green'}});
        var bikeTObike = new google.maps.DirectionsRenderer({
                                              preserveViewport: true,
                                              suppressMarkers : true,
                                              polylineOptions : {strokeColor:'orange'}});
        var bikeTOwork = new google.maps.DirectionsRenderer({
                                              preserveViewport: true,
                                              suppressMarkers : true,
                                              polylineOptions : {strokeColor:'green'}});

    
    
            var mapOptions = {
                zoom: 14,
                center: latlng,
                mapTypeIds: []
                }
        map = new google.maps.Map(document.getElementById('map'), mapOptions);
        

        homeTOpark.setMap(map);
        parkTObike.setMap(map);
        bikeTObike.setMap(map);
        bikeTOwork.setMap(map);

        var onChangeHandler = function() {
          calculateAndDisplayRoute(directionsService, homeTOpark, parkTObike, bikeTObike, bikeTOwork);
        };
        document.getElementById('router').addEventListener('click', onChangeHandler);
        autocomplete = new google.maps.places.Autocomplete(
            /** @type {!HTMLInputElement} */ (
                document.getElementById('start')), {
              types: ['address']
        });
        autocomplete2 = new google.maps.places.Autocomplete(
            /** @type {!HTMLInputElement} */ (
                document.getElementById('end')), {
              types: ['address']
        });
      }
        var icons = {
          parking: {
            icon: 'parking.png'
          },
          home: {
            icon: 'house.png'
          },
          work: {
            icon: 'work.png'
          },
          bike: {
            icon: 'bicycle.png'
          }
        };



      function calculateAndDisplayRoute(directionsService, homeTOpark, parkTObike, bikeTObike, bikeTOwork) {
          var carSpot;
          var bikeSpot1;
          var bikeSpot2;
//            var xmlhttp = new XMLHttpRequest();
//            xmlhttp.onreadystatechange = function() {
//                if (this.readyState == 4 && this.status == 200) {
//                    var markers = JSON.parse(this.responseText);
//                    var data = markers[0]
//                    var myLatlng = new google.maps.LatLng(data.lat, data.lng);
//
//                    var marker = new google.maps.Marker({
//                        position: myLatlng,
//                        map: themap,
//                        icon: icons[data.type].icon
//                    });
//                    gmarkers.push(marker);     
//                }
//
//            };
//            xmlhttp.open("GET", "map_db_pull.php?swLat=", true);
//            xmlhttp.send();
//        }
          
          var start = document.getElementById('start').value;
          carSpot = new google.maps.LatLng(-27.4970806,153.0086067);
          bikeSpot1 = "UQ Chancellor's Place, zone C";
          bikeSpot2 = "University QLD Lakes Station";
          var end = document.getElementById('end').value;
        directionsService.route({
          origin: start,
          destination: carSpot,
          travelMode: 'DRIVING'
        }, function(response, status) {
          if (status === 'OK') {
            homeTOpark.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
          
          
        directionsService.route({
          origin: carSpot,
          destination: bikeSpot1,
          travelMode: 'WALKING'
        }, function(response, status) {
          if (status === 'OK') {
            parkTObike.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
          
        directionsService.route({
          origin: bikeSpot1,
          destination: bikeSpot2,
          travelMode: 'BICYCLING'
        }, function(response, status) {
          if (status === 'OK') {
            bikeTObike.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
          
        directionsService.route({
          origin: bikeSpot2,
          destination: end,
          travelMode: 'WALKING'
        }, function(response, status) {
          if (status === 'OK') {
            bikeTOwork.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });

          codeAddress(start, 'house.png');
          addMarker(carSpot, 'parking.png')
          codeAddress(bikeSpot1, 'bike.png');
          codeAddress(bikeSpot2, 'bike.png');
          codeAddress(end, 'work.png');
      };

function addMarker(latlng,icon) {
        var parkingMarker = new google.maps.Marker({
            map: map,
            icon: icon,
            anchor: new google.maps.Point(0,0),
            position: latlng
        });
}

function codeAddress(address, icon) {
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == 'OK') {
        map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
            map: map,
            icon: icon,
            anchor: new google.maps.Point(0,0),
            position: results[0].geometry.location
        });
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }

function getParams() {
    var idx = document.URL.indexOf('?');
    var params = new Array();
    if (idx != -1) {
        var pairs = document.URL.substring(idx + 1, document.URL.length).split('&');
        for (var i = 0; i < pairs.length; i++) {
            nameVal = pairs[i].split('=');
            params[nameVal[0]] = nameVal[1];
        }
    }
    return params;
}


