const GOOGLE_GEOCODE_URL = 'https://maps.googleapis.com/maps/api/geocode/json?';

const WUNDERGROUND_URL = 'https://api.wunderground.com/api/2b3643fa128b66c3/forecast/q';

const GOOGLE_DIRECTIONS_URL = 'https://maps.googleapis.com/maps/api/directions/json?';

function getDataFromGeocodeApi(searchTerm, callback) {
  const query = {
    'address': `${searchTerm}`,
    'key': 'AIzaSyDXPwZNqdJfJyq4uUqixZuWDiL4FigBSVc'
  };
  $.getJSON(GOOGLE_GEOCODE_URL, query, callback);
}

function getDestinationLatLngData(data) {
  console.log(data.results[0].geometry.location);
  const destinationLocation = data.results[0].geometry.location;
  getDataFromWunderGroundApi(destinationLocation, displayDestinationWunderGroundData);
}

function getDestinationAddress(data) {
  $('.js-weather-results').html("");
  $('.weatherforecast').html("");
  $('.weatherforecast').html(`<h3>Weather Forecast in: ${data.results[0].formatted_address} </h3>`);
}

function getDataFromWunderGroundApi(location, callback) {
  console.log("wundergroundapi");
  $.getJSON(`${WUNDERGROUND_URL}/${location.lat},${location.lng}.json`, callback);
}

function displayDestinationWunderGroundData(data) {
  const destinationResults = data.forecast.txt_forecast.forecastday.map((item, index) => renderResult(item));
  $('.js-weather-results').append(destinationResults); 
}

function renderResult(result) {
  return `
    <div class="weather-day">
      <p> ${result.title} </p>
      <p>${result.fcttext}</p>
      <a class="weather-icon" href="${result.icon_url}" target="_blank">
      <img src="${result.icon_url}">
      </a>
      <p> Chance of rain: ${result.pop}%</p>
    </div>
  `;
}

function renderRoute(route) {
  const directions = route.steps.map(step => {
    return (
      `<li>${step.instructions}</li>`);
    });
  $("#directions").html(`<ol class="directions"></ol>
    <div class="estimatedTime"></div>
    <div class="distance"></div>`);
  $(".directions").before(`<h3> Directions to ${route.end_address}<h3>`);
  $(".directions").html(directions);
  $(".estimatedTime").html(`<hr><p>Estimated time: ${route.duration.text}</p>`);
  $(".distance").html(`<p>Distance away: ${route.distance.text}</p>`);
}

function initMap(origin, destination) {
  var directionsService = new google.maps.DirectionsService;
  // Optionally create a map
  var directionsDisplay = new google.maps.DirectionsRenderer;
  var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 7,
      center: {lat: 37.872899, lng: -122.25854}
  });
  directionsDisplay.setMap(map);

  directionsService.route({
          origin,
          destination,
          travelMode: 'DRIVING'
  }, function(response, status) {
      if (status === 'OK') {
          // Pass data to the map
          directionsDisplay.setDirections(response);

          // See the data in the console
          console.log(response.routes[0].legs[0].steps[0].instructions);
          renderRoute(response.routes[0].legs[0]);
      } else {
          window.alert('Directions request failed due to ' + status);
      }
  });
}

function removeHiddenClass() {
  $('#mapContainer').removeClass('hidden');
  $('#weatherContainer').removeClass('hidden');
}

function watchSubmit() {
  $('.js-search-form').submit(event => {
    event.preventDefault();
    const originTarget = $(event.currentTarget).find('.js-origin');
    const destinationTarget = $(event.currentTarget).find('.js-destination');
    const queryOrigin = originTarget.val();
    const queryDestination = destinationTarget.val();
    originTarget.val("");
    destinationTarget.val("");
    /*// clear out the input*/
    initMap(queryOrigin, queryDestination);
    removeHiddenClass();
    getDataFromGeocodeApi(queryDestination, getDestinationAddress);
    // to display destination address
    getDataFromGeocodeApi(queryDestination, getDestinationLatLngData);
    // to get latitude and longitude coordinates for weather API
  });
}



$(watchSubmit);
