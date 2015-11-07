require('mapbox.js')
require('es6-promise').polyfill();
require('isomorphic-fetch');
r = require('rethinkdb');

console.log(process.env.IAIN_MAPBOX_ACCESS_TOKEN);

// L.mapbox.accessToken = 'pk.eyJ1IjoiZW52aW50YWdlIiwiYSI6Inh6U0p2bkEifQ.p6VrrwOc_w0Ij-iTj7Zz8A'
// var map = L.mapbox.map('map', 'envintage.i9eofp14')

L.mapbox.accessToken = 'pk.eyJ1IjoicGV0ZXJqYWNvYnNvbiIsImEiOiJjaWdvanNzcWIwMDVrdHBrbmw0ZWhucGk5In0.MCT1z9mph_aJCV8bZX_O_g'
var map = L.mapbox.map('map', 'peterjacobson.o3j3ep1p')
map.setView([-41.112, 172.694], 6)

var pointDataLayer = L.mapbox.featureLayer().addTo(map)

fetch('/datasets/nzfapdc/Nectria')
  .then(function(response) {
    if (response.status >= 400) {
      throw new Error("Bad response from server");
    }
    return response.json();
  })
  .then(function(data) {
    return {
      "type": "FeatureCollection",
      "features": data.map(function(d) {
        return {
          "type": "Feature",
          "properties": {
            "Name": d["Matched Scientific Name"],
            "Date": d["Event Date - parsed"]
          },
          "geometry": {
            "type": "Point",
            "coordinates": [
              +d["Longitude - processed"],
              +d["Latitude - processed"]
            ]
          }
        }
      })
    }
  }).then(function(data){
    var geoJson = L.geoJson(data, {
      pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, {
          radius: 5
        })
      }
    }).addTo(map)
  });


// var sampleGeoJson = {
//   "type": "FeatureCollection",
//   "features": [
//     {
//       "type": "Feature",
//       "properties": {},
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           175.78125,
//           -38.8225909761771
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {},
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           175.166015625,
//           -39.232253141714885
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {},
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           176.00097656249997,
//           -39.36827914916012
//         ]
//       }
//     },
//     {
//       "type": "Feature",
//       "properties": {},
//       "geometry": {
//         "type": "Point",
//         "coordinates": [
//           175.4296875,
//           -39.67337039176559
//         ]
//       }
//     }
//   ]
// }
