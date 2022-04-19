//data url
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
//query url and perform function once promise is complete
d3.json(queryUrl).then(function(data) {
    createFeatures(data.features);
  });
//functions that set the features of the map
function createFeatures(earthquakeData) {
    //function for pop-ups
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");

    }
    //function for style of markers
    function setStyle(feature) {
      var mag = feature.properties.mag;
      if (mag >= 6.0) {
        return { fillColor:"red",color: "black",weight:0.5, fillOpacity: 0.75 }; 
      } 
      else if (mag >= 4.0) {
        return { fillColor:"orange",color: "black",weight:0.5, fillOpacity: 0.75 };
      } 
      else if (mag >= 3.0) {
        return {  fillColor:"yellow",color: "black",weight:0.5, fillOpacity: 0.75  };
      } 
      else {
        return {  fillColor:"green",color: "black",weight:0.5, fillOpacity: 0.75 };
      }
    };
    //creates markers
    var earthquakes = L.geoJSON(earthquakeData, {
      style:setStyle,
      onEachFeature: onEachFeature,      
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, {
          radius: Math.round(feature.properties.mag) * 3
        })
      }



    });
  
    //creates the map
    createMap(earthquakes);
    
  }
//function to create the map
function createMap(earthquakes){  
    var baseMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });
 
  var myMap = L.map("map", {
    center: [
      40, 0
    ],
    zoom: 3,
    layers: [baseMap, earthquakes]
  });

  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function(map) {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h4>Magnitude</h4>";
    div.innerHTML += '<i style="background: #008000"></i><span>0.0 - 2.9</span><br>';
    div.innerHTML += '<i style="background: #FFFF00"></i><span>3.0 - 3.9 </span><br>';
    div.innerHTML += '<i style="background: #FFA500"></i><span>4.0 - 5.9</span><br>';
    div.innerHTML += '<i style="background: #FF0000"></i><span>6.0+</span><br>';

    
    
  
    return div;
  };
  
  legend.addTo(myMap);
};

