const GOOGLE_GEOCODE_URL = 'https://maps.googleapis.com/maps/api/geocode/json?';

function getDataFromGeocode(searchTerm, callback) {
  const query = {
    'address': `${searchTerm}`,
    'key': 'AIzaSyDXPwZNqdJfJyq4uUqixZuWDiL4FigBSVc'
  }
  $.getJSON(GOOGLE_GEOCODE_URL, query, callback);
}

const WUNDERGROUND_URL = 'https://api.wunderground.com/api/2b3643fa128b66c3/forecast/q';

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

function displayWunderGroundData(data) {
  // const results = data.items.map((item, index) => renderResult(item));
  // $('.js-search-results').html(results);
  const results = data.forecast.txt_forecast.forecastday.map((item, index) => renderResult(item));
  $('.js-search-results').html(results);
  
}

function getLatLngData(data) {
  console.log(data.results[0].geometry.location);
  const location = data.results[0].geometry.location;
  getDataFromWunderGroundApi(location, displayWunderGroundData);
}

function watchSubmit() {
  $('.js-search-form').submit(event => {
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find('.js-query');
    const query = queryTarget.val();
    /*// clear out the input*/
    queryTarget.val("");
    getDataFromGeocode(query, getLatLngData);
  });
}

$(watchSubmit);
