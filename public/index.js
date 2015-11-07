require('mapbox.js')
r = require('rethinkdb');

console.log(process.env.IAIN_MAPBOX_ACCESS_TOKEN);

// L.mapbox.accessToken = 'pk.eyJ1IjoiZW52aW50YWdlIiwiYSI6Inh6U0p2bkEifQ.p6VrrwOc_w0Ij-iTj7Zz8A'
// var map = L.mapbox.map('map', 'envintage.i9eofp14')

L.mapbox.accessToken = 'pk.eyJ1IjoicGV0ZXJqYWNvYnNvbiIsImEiOiJjaWdvanNzcWIwMDVrdHBrbmw0ZWhucGk5In0.MCT1z9mph_aJCV8bZX_O_g'
var map = L.mapbox.map('map', 'peterjacobson.o3j3ep1p')
map.setView([-41.112, 172.694], 6)

var pointDataLayer = L.mapbox.featureLayer().addTo(map)

var sampleGeoJson = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [
          175.78125,
          -38.8225909761771
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [
          175.166015625,
          -39.232253141714885
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [
          176.00097656249997,
          -39.36827914916012
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [
          175.4296875,
          -39.67337039176559
        ]
      }
    }
  ]
}

var geoJson = L.geoJson(sampleGeoJson, {
  pointToLayer: function(feature, latlng) {
    return L.circleMarker(latlng, {
      radius: 5
    })
  }
}).addTo(map)
