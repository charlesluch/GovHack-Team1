
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
  
  addCycle(0);
  addRacks();
  addFountains();
  addParks();
}

$(document).ready(function() {
$("#floating-hide").on("click",function(){
                
                $("#floating-legend").toggle()
        if ($("#hideshow").text() == "Show Legend") {
            $("#hideshow").text("Hide Legend");
        }
        else {
            $("#hideshow").text("Show Legend");
        }
            });
});



$("#addcmt").click(function() {
        $(".commentarea").toggle();
        if ($("#addcmt").text() == "Add additional comment") {
            $("#addcmt").text("Remove comment");
        }
        else {
            $("#addcmt").text("Add additional comment");
        }
    });



function calculateAndDisplayRoute(directionsService, homeTOpark, parkTObike, bikeTObike, bikeTOwork) {
          var carSpot;
          var bikeSpot1;
          var bikeSpot2;
      //      var xmlhttp = new XMLHttpRequest();
      //      xmlhttp.onreadystatechange = function() {
      //          if (this.readyState == 4 && this.status == 200) {
      //              var markers = JSON.parse(this.responseText);
      //              var data = markers[0]
      //              var myLatlng = new google.maps.LatLng(data.lat, data.lng);

      //              var marker = new google.maps.Marker({
      //                  position: myLatlng,
      //                  map: themap,
      //                  icon: icons[data.type].icon
      //              });
      //              gmarkers.push(marker);     
      //          }

      //      };
      //      xmlhttp.open("GET", "map_db_pull.php?swLat=", true);
      //      xmlhttp.send();
      //  }
          
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

function getFountain() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "http://ec2-18-220-64-189.us-east-2.compute.amazonaws.com/bubblers", false);
  xhr.send();
  var out = new Array();

  var info = JSON.parse(xhr.responseText);
 
  var i;
  for (i = 0; i < info.length; i++) {
    out[i] = new Array(3);
    out[i][0] = info[i].latitude;
    out[i][1] = info[i].longitude;
    out[i][2] = info[i].park_name;
  }
  return out;


}

function getPark() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "http://ec2-18-220-64-189.us-east-2.compute.amazonaws.com/meters", false);
  xhr.send();
  var out = new Array();
   

  var info = JSON.parse(xhr.responseText);
   
  
  var i;
  for (i = 0; i < info.length; i++) {
    out[i] = new Array(3);
    out[i][0] = info[i].longitude;
    out[i][1] = info[i].latitude;
    out[i][2] = info[i].street;
    //console.log(info[i].street)
  //add name
  }
  return out;


}

function getRack() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "http://ec2-18-220-64-189.us-east-2.compute.amazonaws.com/bikeracks", false);
  xhr.send();
  var out = new Array();

  var info = JSON.parse(xhr.responseText);
  var i;
  for (i = 0; i < info.length; i++) {
    out[i] = new Array(4);
    out[i][0] = info[i].latitude;
    out[i][1] = info[i].longitude;
    out[i][2] = info[i].capacity;
    out[i][3] = info[i].address;
  }
  return out;

}

//returns a 2d array where the inner elements correspond to location, available stands, available bikes and names
function getCycle() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://api.jcdecaux.com/vls/v1/stations?contract=Brisbane&apiKey=ed0615086bd91ad8d6cd08132ff73829b39d82c6", false);
  xhr.send();
  var out = new Array();

  var info = JSON.parse(xhr.responseText);
  var i;
  for (i = 0; i < info.length; i++) {
    out[i] = new Array(4);
    out[i][0] = info[i].position;
    out[i][1] = info[i].available_bike_stands;
    out[i][2] = info[i].available_bikes;
    out[i][3] = info[i].name;
  }
  return out;
}

function addParks() {
  var infoWin = new google.maps.InfoWindow;
  var parks = new Array();
  var marker, i, location;

  parks = getPark();
  //console.log(String(parks.length));
  for (i = 0; i < parks.length; i++) {
  //  console.log(String(i) + String(parks[i][0] + "   " + String(parks[i][1] + "<br>")))
    location = new google.maps.LatLng(parks[i][0],parks[i][1]);

    marker = new google.maps.Marker({
        map: map,
        icon: 'meter.png',
        anchor: new google.maps.Point(0,0),
        position: location
    });
    google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          infoWin.setContent(String(parks[i][2]));
          console.log(String(parks[i][2]));
          infoWin.open(map, marker);
        }
      })(marker, i));

  }
}

function addFountains() {
  var infoWin = new google.maps.InfoWindow;
  var fountains = new Array();
  var marker, i, location;

  fountains = getFountain();
  for (i = 0; i < fountains.length; i++) {
    location = new google.maps.LatLng(fountains[i][0],fountains[i][1]);

    marker = new google.maps.Marker({
        map: map,
        icon: 'bubbler.png',
        anchor: new google.maps.Point(0,0),
        position: location
    });
    google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          infoWin.setContent(String(fountains[i][2]));
          infoWin.open(map, marker);
        }
      })(marker, i));

  }
}

function addRacks() {
  var infoWin = new google.maps.InfoWindow;
  var racks = new Array();
  var marker, i, location;

  racks = getRack();
  for (i = 0; i < racks.length; i++) {
    location = new google.maps.LatLng(racks[i][0],racks[i][1]);

    marker = new google.maps.Marker({
        map: map,
        icon: 'rack.png',
        anchor: new google.maps.Point(0,0),
        position: location
    });
    google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          infoWin.setContent(String(racks[i][3]) + "<br>Capacity: " + String(racks[i][2]));
          infoWin.open(map, marker);
        }
      })(marker, i));

  }
}
//adds the locations of the city cycle locations to the map
//mode adds exclusions of non avilable racks / bikes
// 0 for no exclusion, 1 for unavilable bike exclusion, 1 for unavilable rack exclusion
function addCycle(mode) {
  var bikes = new Array();
  var marker;
  var infoWin = new google.maps.InfoWindow;
  bikes = getCycle();
  var i;

  for (i = 0; i < bikes.length; i++) {
    //if bike exclusion
    if (mode == 1) {
      //and no bikes
        if(bikes[i][2] == 0) {
          //go to next iteration
          continue;
        }
        //if rack exclusion
    } else if (mode == 2) {
        //and no racks
        if (bikes[i][1] == 0) {
          //go to next iteration
          continue;
        }
    }
    //add the markers to the map
    marker = new google.maps.Marker({
        map: map,
        icon: 'bike.png',
        anchor: new google.maps.Point(0,0),
        position: bikes[i][0]
    });
    
    google.maps.event.addListener(marker, 'click', (function(marker, i) {
      return function() {
        infoWin.setContent(String(bikes[i][3]) + "<br>Available Bikes: " + String(bikes[i][2]) + "<br>Aviable racks: " + String(bikes[i][1]));
        infoWin.open(map, marker);
      }
      })(marker, i));
  }
}

function addMarker(latlng,icon) {
        var parkingMarker = new google.maps.Marker({
            map: map,
            icon: icon,
            anchor: new google.maps.Point(0,0),
            position: latlng
        });
}

