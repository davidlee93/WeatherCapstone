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

// function getDataFromDirectionsApi(searchTerm, callback) {
//   const query = {
//     'origin': `${searchTerm}`,
//     'destination: '
//     'key': 'AIzaSyDZ0E2z4VWHcV3YH-Io01lsoORCDsG9jRg'
//   }
//   $.getJSON(GOOGLE_DIRECTIONS_URL, query, callback);
// }

function getDataFromWunderGroundApi(location, callback) {
  console.log("wundergroundapi")
  $.getJSON(`${WUNDERGROUND_URL}/${location.lat},${location.lng}.json`, callback)
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

function getOriginLatLngData(data) {
  console.log(data.results[0].geometry.location);
  const originLocation = data.results[0].geometry.location;
  $('.js-search-results').append(data.results[0].formatted_address); 
  getDataFromWunderGroundApi(originLocation, displayOriginWunderGroundData);
}

function getDestinationLatLngData(data) {
  console.log(data.results[0].geometry.location);
  const destinationLocation = data.results[0].geometry.location;
  $('.js-search-results').append(data.results[0].formatted_address)
  getDataFromWunderGroundApi(destinationLocation, displayDestinationWunderGroundData);
}

// function getDirectionsData(data) {
//   for(let i = 0; i < data.routes.legs[0].steps.length; i++){
//     console.log(data.routes.legs[0].steps[i].html_instructions);
//   }
//   const originLocation = data.results[0].geometry.location;
//   getDataFromWunderGroundApi(location, displayWunderGroundData);
// }


function watchSubmit() {
  $('.js-search-form').submit(event => {
    event.preventDefault();
    const originTarget = $(event.currentTarget).find('.js-origin');
    const destinationTarget = $(event.currentTarget).find('.js-destination');
    const queryOrigin = originTarget.val();
    const queryDestination= destinationTarget.val();
    
    weatherTarget.val("");
    directionsOriginTarget.val("");
    /*// clear out the input*/
    getDataFromGeocodeApi(queryOrigin, getOriginLatLngData);
    getDataFromGeocodeApi(queryDestination, getDestinationLatLngData);

  });
}

$(watchSubmit);
