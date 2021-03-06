require('mapbox.js')
require('es6-promise').polyfill();
require('isomorphic-fetch');
r = require('rethinkdb');

var moment = require('moment');
require('moment-range');
var noUiSlider = require('nouislider');

L.mapbox.accessToken = 'pk.eyJ1IjoicGV0ZXJqYWNvYnNvbiIsImEiOiJjaWdvanNzcWIwMDVrdHBrbmw0ZWhucGk5In0.MCT1z9mph_aJCV8bZX_O_g'
var map = L.mapbox.map('map', 'peterjacobson.o3j3ep1p')
map.setView([-41.112, 172.694], 6)

var pointDataLayer = L.mapbox.featureLayer({
    "type": "FeatureCollection",
    "features": []
  }, {
  pointToLayer: function(feature, latlng) {
    return L.circleMarker(latlng, {
      radius: 10
    })
  }
}).addTo(map)

var earliestDate = Date.parse("2020-12-25");
var latestDate = Date.parse("1600-12-25");

fetch('/datasets/nzfapdc/dropdown')
  .then(function(response) {
    if (response.status >= 400) {
      throw new Error("Bad response from server");
    }
    return response.json();
  })
  .then(function(data) {
    var dropdown = document.getElementById('dropdown');
    dropdown.onchange = function() {
      populateMap(dropdown.options[dropdown.selectedIndex].value);
    };
    var fragment = document.createDocumentFragment();

    data.forEach(function(occurence, index) {
      var opt = document.createElement('option');
      var occurenceLabel = occurence.group + ' (' + occurence.reduction + ')';
      opt.innerHTML = occurenceLabel;
      opt.value = occurence.group;
      fragment.appendChild(opt);
    });

    dropdown.appendChild(fragment);
    populateMap(dropdown.options[dropdown.selectedIndex].value);
  });

function populateMap(occurenceName) {
  console.log(occurenceName);
  fetch('/datasets/nzfapdc/species/'+occurenceName)
    .then(function(response) {
      if (response.status >= 400) {
        throw new Error("Bad response from server");
      }
      return response.json();
    })
    .then(function(data) {
      console.log(data);
      return {
        "type": "FeatureCollection",
        "features": data.map(function(d) {
          var parsedDate = Date.parse(d["Event Date - parsed"]);
          earliestDate = parsedDate < earliestDate ? parsedDate : earliestDate;
          latestDate = parsedDate > latestDate ? parsedDate : latestDate;
          return {
            "type": "Feature",
            "properties": {
              "Name": d["Matched Scientific Name"],
              "Date": moment(parsedDate)
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
      // var geoJson = L.geoJson(data, {
      pointDataLayer.setGeoJSON(data)
      setupSlider();
    });
}

function setupSlider() {
  var months = [];
  var range = moment.range(new Date(earliestDate), new Date(latestDate));
  range.by('months', function(moment) {
    months.push(moment);
  });
  var slider = document.getElementById('slider');
  var currentDate = document.getElementById('current-date');
  if (slider.noUiSlider) slider.noUiSlider.destroy();
  noUiSlider.create(slider, {
    start: 0,
    step: 1,
    connect: "lower",
    range: {
      min: 0,
      max: months.length
    }
  });
  slider.noUiSlider.on('update', function( values, handle ) {
  	console.log(months[+values[handle]]);
    var sliderDate = months[+values[handle]];
    var sliderMonths = (sliderDate.get('year') * 12) + sliderDate.get('month');
    currentDate.innerHTML = 'DATE (' + sliderDate.format('YYYY MMM') + '):';
    pointDataLayer.setFilter(function(d) {
      // return (d.properties.Date.get('month') === sliderDate.get('month')) && (d.properties.Date.get('year') === sliderDate.get('year'));
      var dMonths = (d.properties.Date.get('year') * 12) + d.properties.Date.get('month')
      return Math.abs(sliderMonths - dMonths) <= 24;
      //return true;
    })
  });
}
