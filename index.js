const GOOGLE_GEOCODE_URL = 'https://maps.googleapis.com/maps/api/geocode/json?';

const WUNDERGROUND_URL = 'https://api.wunderground.com/api/2b3643fa128b66c3/forecast/q';

const GOOGLE_DIRECTIONS_URL = 'https://maps.googleapis.com/maps/api/directions/json?';

function getDataFromGeocodeApi(searchTerm, callback) {
  const query = {
    'address': `${searchTerm}`,
    'key': 'AIzaSyDXPwZNqdJfJyq4uUqixZuWDiL4FigBSVc'
  }
  $.getJSON(GOOGLE_GEOCODE_URL, query, callback);
}

function getOriginLatLngData(data) {
  console.log(data.results[0].geometry.location);
  const originLocation = data.results[0].geometry.location;
  getDataFromWunderGroundApi(originLocation, displayOriginWunderGroundData);
}

function getDestinationLatLngData(data) {
  console.log(data.results[0].geometry.location);
  const destinationLocation = data.results[0].geometry.location;
  getDataFromWunderGroundApi(destinationLocation, displayDestinationWunderGroundData);
}

function getDataFromWunderGroundApi(location, callback) {
  console.log("wundergroundapi")
  $.getJSON(`${WUNDERGROUND_URL}/${location.lat},${location.lng}.json`, callback)
}

function displayOriginWunderGroundData(data) {
  // const results = data.items.map((item, index) => renderResult(item));
  // $('.js-search-results').html(results);
  const originResults = data.forecast.txt_forecast.forecastday.map((item, index) => renderResult(item));
  $('.js-search-results').append(originResults); 
}

function displayDestinationWunderGroundData(data) {
  // const results = data.items.map((item, index) => renderResult(item));
  // $('.js-search-results').html(results);
  const destinationResults = data.forecast.txt_forecast.forecastday.map((item, index) => renderResult(item));
  $('.js-search-results').append(destinationResults); 
}

function getDataFromDirectionsApi(queryOrigin, queryDestination, callback) {
  const query = {
    'origin': `${queryOrigin}`,
    'destination': `${queryDestination}`,
    'key': 'AIzaSyDZ0E2z4VWHcV3YH-Io01lsoORCDsG9jRg'
  }
  $.getJSON(GOOGLE_DIRECTIONS_URL, query, callback);
}

function getDirectionsData(data) {
  var directionsList = [];
  for(let i = 0; i < data.routes[0].legs[0].steps.length; i++){
    console.log(data.routes[0].legs[0].steps[i].html_instructions);
    const directionsToLocation = data.routes[0].legs[0].steps[i].html_instructions;
    directionsList.push(directionsToLocation);
  }
  $('.js-search-results').append(directionsList); 
}


function renderResult(result) {
  return `
    <div>
      <p> Day: ${result.title} </p?>
      <p>${result.fcttext}</p>
      <p> Chance of rain: ${result.pop}%
        <a class="js-video-thumbnail" href="${result.icon_url}" target="_blank">
        <img src="${result.icon_url}">
        </a>
      </p>
      <br></br>
    </div>
  `;
}

function initMap() {
  var uluru = {lat: 37.863, lng: -122.224};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: uluru
  });
  var marker = new google.maps.Marker({
    position: uluru,
    map: map
  });
}

function watchSubmit() {
  $('.js-search-form').submit(event => {
    event.preventDefault();
    const originTarget = $(event.currentTarget).find('.js-origin');
    const destinationTarget = $(event.currentTarget).find('.js-destination');
    const queryOrigin = originTarget.val();
    const queryDestination= destinationTarget.val();
    
    originTarget.val("");
    destinationTarget.val("");
    /*// clear out the input*/
    getDataFromGeocodeApi(queryOrigin, getOriginLatLngData);
    getDataFromGeocodeApi(queryDestination, getDestinationLatLngData);
    getDataFromDirectionsApi(queryOrigin, queryDestination, getDirectionsData);
  });
}

$(watchSubmit);
