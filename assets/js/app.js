/**
 * @license MIT
 * @copyright codewithsadee 2023 All rights reserved
 * @author codewithsadee <mohammadsadee24@gmail.com>
 */

'use strict';

import { fetchData, url,  } from "./api.js";

import * as module from "./module.js";

/**
 * Add event listener on multiple elements
 * @param {NodeList} elements Eelements node array
 * @param {string} eventType Event Type e.g.: "click", "mouseover"
 * @param {Function} callback Callback function
 */

function googleTranslateElementInit() {
  new google.translate.TranslateElement(
{pageLanguage: 'en', includedLanguages: 'en,fr,ak,ha,ee,nzi,gaa'},
'language',

  )

}

googleTranslateElementInit();


const addEventOnElements = function (elements, eventType, callback) {
  for (const element of elements) element.addEventListener(eventType, callback);
}

var svgContent;
/**
 * Toggle search in mobile devices
 */
const searchView = document.querySelector("[data-search-view]");
const searchTogglers = document.querySelectorAll("[data-search-toggler]");

const toggleSearch = () => searchView.classList.toggle("active");
addEventOnElements(searchTogglers, "click", toggleSearch);

/**
 * SEARCH INTEGRATION
 */
const searchField = document.querySelector("[data-search-field]");
const searchResult = document.querySelector("[data-search-result]");

let searchTimeout = null;
const serachTimeoutDuration = 500;

searchField.addEventListener("input", function () {

  searchTimeout ?? clearTimeout(searchTimeout);

  if (!searchField.value) {
    searchResult.classList.remove("active");
    searchResult.innerHTML = "";
    searchField.classList.remove("searching");
  } else {
    searchField.classList.add("searching");
  }

  if (searchField.value) {
    searchTimeout = setTimeout(() => {
      fetchData(url.geo(searchField.value), function (locations) {
        searchField.classList.remove("searching");
        searchResult.classList.add("active");
        searchResult.innerHTML = `
          <ul class="view-list" data-search-list></ul>
        `;

        const /** {NodeList} | [] */ items = [];

        for (const { name, lat, lon, country, state } of locations) {
          const searchItem = document.createElement("li");
          searchItem.classList.add("view-item");

          searchItem.innerHTML = `
            <span class="m-icon">location_on</span>

            <div>
              <p class="item-title">${name}</p>

              <p class="label-2 item-subtitle">${state || ""} ${country}</p>
            </div>

            <a href="#/weather?lat=${lat}&lon=${lon}" class="item-link has-state" aria-label="${name} weather" data-search-toggler></a>
          `;

          searchResult.querySelector("[data-search-list]").appendChild(searchItem);
          items.push(searchItem.querySelector("[data-search-toggler]"));
        }

        addEventOnElements(items, "click", function () {
          toggleSearch();
          searchResult.classList.remove("active");
        })
      });
    }, serachTimeoutDuration);
  }

});


const container = document.querySelector("[data-container]");
const loading = document.querySelector("[data-loading]");
const currentLocationBtn = document.querySelector("[data-current-location-btn]");
const errorContent = document.querySelector("[data-error-content]");

/**
 * Render all weather data in html page
 * 
 * @param {number} lat Latitude
 * @param {number} lon Longitude
 */
export const updateWeather = function (lat, lon) {

  loading.style.display = "grid";
  container.style.overflowY = "hidden";
  container.classList.remove("fade-in");
  errorContent.style.display = "none";

  const currentWeatherSection = document.querySelector("[data-current-weather]");
  const highlightSection = document.querySelector("[data-highlights]");
  const hourlySection = document.querySelector("[data-hourly-forecast]");
  const days14Section = document.querySelector("[data-days14-forecast]");
  const forecastSection = document.querySelector("[ data-7-day-forecast]");
  const forecast7daysSmall = document.querySelector("[ data-day7s-forecast]");
  const forecast14days = document.querySelector("[  data-days14-forecast ]");
  const daysummary = document.querySelector("#daysummary");
 const nightsummary = document.querySelector("#nightsummary");
 const water = document.querySelector("#water");
const pestdisease = document.querySelector("#pestdisease");
const weedrate = document.querySelector("#weedrate");
const farmact = document.querySelector("#farmact");

  farmact.innerHTML = "";
  weedrate.innerHTML = "";
  pestdisease.innerHTML = "";
  currentWeatherSection.innerHTML = "";
  highlightSection.innerHTML = "";
  hourlySection.innerHTML = "";
  days14Section.innerHTML = "";
  forecastSection.innerHTML = "";
  forecast7daysSmall.innerHTML = "";
  nightsummary.innerHTML = "";
  daysummary.innerHTML = "";
   water.innerHTML = "";
  forecast14days.innerHTML = "";

  if (window.location.hash === "#/current-location") {
    currentLocationBtn.setAttribute("disabled", "");
  } else {
    currentLocationBtn.removeAttribute("disabled");
  }

// day or night function
function getDayOrNight() {
  // Get the current date and time
  var currentTime = new Date();
  
  // Extract the current hour from the time
  var currentHour = currentTime.getHours();

  // Define the threshold values for day and night (you can adjust these as needed)
  var dayStart = 6;   // 6:00 AM
  var dayEnd = 18;    // 6:00 PM

  // Check if the current hour is within the day or night range
  if (currentHour >= dayStart && currentHour < dayEnd) {
    return "day";
  } else {
    return "night";
  }
}


const timeOfDay = getDayOrNight();

 


  /**
   * CURRENT WEATHER SECTION
   */
  fetchData(url.currentWeather(lat, lon), function (currentWeather) {
   
    const {
      current: { weather, dt, sunrise, sunset, temp, feels_like, pressure, visibility, humidity },
      timezone
    } = currentWeather
    const [{ description, icon }] = weather;

// console.log(timezone);
// console.log(dt);
    const card = document.createElement("div");
    card.classList.add("card", "card-lg", "current-weather-card");
// Set the background image using inline style
if (timeOfDay == "day") {
  card.style.backgroundImage = 'url("/assets/images/sky-day.jpg")';
} else {
  card.style.backgroundImage = 'url("/assets/images/night-sky.jpg")';
}



console.log(currentWeather);
if (humidity > 60) {
  water.innerHTML = 'Low <sub class="greenn">ooo</sub>';
  pestdisease.innerHTML = 'High <sub class="redd">ooo</sub>';
  weedrate.innerHTML = 'High <sub class="redd">ooo</sub>';
  farmact.innerHTML = 'Normal <sub class="yelloww"> ooo</sub>';

} else if (humidity < 60) {
  water.innerHTML = 'High <sub class="redd">ooo</sub>';
  weedrate.innerHTML = 'Low <sub class="redd">ooo</sub>';
  farmact.innerHTML = 'Normal <sub class="yelloww"> ooo</sub>';
}


card.style.backgroundSize = 'cover'; 


  daysummary.textContent = `The weather is expected to be ${description}, with temperature  reaching an average of ${temp} °C. However, humidity is expected to be ${humidity} % with pressure reaching ${pressure} hPa`;
  nightsummary.textContent =  `During the night period, visibility is expected to hit ${visibility / 1000} km, with the sunsetting at ${module.getTime(sunset, timezone)} `;




    card.innerHTML = `
      <h2 class="title-2 card-title">Now</h2>

      <div class="weapper">
        <p class="heading">${parseInt(temp)}&deg;<sup>c</sup></p>

        <img src="./assets/images/weather_icons/${icon}.svg"  alt="${description}" class=" larger-svg">
       
      </div>

      <p class="body-3">${description}</p>

      <ul class="meta-list">

        <li class="meta-item">
          <span class="m-icon">calendar_today</span>

          <p class="title-3 meta-text">${module.getDate(dt, timezone)}</p>
        </li>

        <li class="meta-item">
          <span class="m-icon">location_on</span>

          <p class="title-3 meta-text" data-location></p>
        </li>

      </ul>
    `;

    fetchData(url.reverseGeo(lat, lon), function ([{ name, country }]) {
      card.querySelector("[data-location]").innerHTML = `${name}, ${country}`
    });

    currentWeatherSection.appendChild(card);

    /**
     * TODAY'S HIGHLIGHTS
     */
    fetchData(url.airPollution(lat, lon), function (airPollution) {
      // console.log(airPollution);
      const [{
        main: { aqi },
        components: { no2, o3, so2, pm2_5 }
      }] = airPollution.list;

      const card = document.createElement("div");
      card.classList.add("card", "card-lg");
      if (timeOfDay == "day") {
        card.style.backgroundImage = 'url("/assets/images/sky-day1.jpg")';
      } else {
        card.style.backgroundImage = 'url("/assets/images/night-sky.jpg")';
      }

      // card.style.backgroundImage = 'url("/assets/images/sky-day.jpg")';
      card.style.backgroundSize = 'cover';
      card.innerHTML = `
        <h2 class="title-2" id="highlights-label">Todays Highlights</h2>

        <div class="highlight-list">

          <div class="card card-sm highlight-card one">

            <h3 class="title-3">Air Quality Index</h3>

            <div class="wrapper">

              <span class="m-icon">air</span>

              <ul class="card-list">

                <li class="card-item">
                  <p class="title-1">${pm2_5.toPrecision(3)}</p>

                  <p class="label-1">PM<sub>2.5</sub></p>
                </li>

                <li class="card-item">
                  <p class="title-1">${so2.toPrecision(3)}</p>

                  <p class="label-1">SO<sub>2</sub></p>
                </li>

                <li class="card-item">
                  <p class="title-1">${no2.toPrecision(3)}</p>

                  <p class="label-1">NO<sub>2</sub></p>
                </li>

                <li class="card-item">
                  <p class="title-1">${o3.toPrecision(3)}</p>

                  <p class="label-1">O<sub>3</sub></p>
                </li>

              </ul>

            </div>

            <span class="badge aqi-${aqi} label-${aqi}" title="${module.aqiText[aqi].message}">
              ${module.aqiText[aqi].level}
            </span>

          </div>

          <div class="card card-sm highlight-card two">

            <h3 class="title-3">Sunrise & Sunset</h3>

            <div class="card-list">

              <div class="card-item">
                <span class="m-icon">clear_day</span>

                <div>
                  <p class="label-1">Sunrise</p>

                  <p class="title-1">${module.getTime(sunrise, timezone)}</p>
                </div>
              </div>

              <div class="card-item">
                <span class="m-icon">clear_night</span>

                <div>
                  <p class="label-1">Sunset</p>

                  <p class="title-1">${module.getTime(sunset, timezone)}</p>
                </div>
              </div>

            </div>

          </div>

          <div class="card card-sm highlight-card three">

            <h3 class="title-3">What It Means </h3>

            <p class="title-3">${module.aqiText[aqi].message}</p>

              </div>

         

          

          <div class="card card-sm highlight-card">

            <h3 class="title-3">Humidity</h3>

            <div class="wrapper">
              <span class="m-icon">humidity_percentage</span>

              <p class="title-1">${humidity}<sub>%</sub></p>
            </div>

          </div>

          <div class="card card-sm highlight-card">

            <h3 class="title-3">Pressure</h3>

            <div class="wrapper">
              <span class="m-icon">airwave</span>

              <p class="title-1">${pressure}<sub>hPa</sub></p>
            </div>

          </div>

          <div class="card card-sm highlight-card">

            <h3 class="title-3">Visibility</h3>

            <div class="wrapper">
              <span class="m-icon">visibility</span>

              <p class="title-1">${visibility / 1000}<sub>km</sub></p>
            </div>

          </div>

          <div class="card card-sm highlight-card">

            <h3 class="title-3">Feels Like</h3>

            <div class="wrapper">
              <span class="m-icon">thermostat</span>

              <p class="title-1">${parseInt(feels_like)}&deg;<sup>c</sup></p>
            </div>

          </div>

        </div>
      `;

      highlightSection.appendChild(card);

    });

  }); 

    /**
     * 24H FORECAST SECTION
     */
    fetchData(url.forecast(lat, lon), function (forecast) {

      const {
        hourly,
        timezone,
        daily
      } = forecast;

      // console.log(forecast);

      hourlySection.innerHTML = `
          <h2 class="title-2">Today at</h2>
          <div class="slider-container">
              <ul class="slider-list" data-temp></ul>
              <ul class="slider-list" data-wind></ul>
          </div>
      `;


      const currentDate = new Date();
      const currentDay = currentDate.getDate();

      for (let i = 0; i < hourly.length; i += 1) {
        const data = hourly[i];

        const {
          dt,
          temp,
          weather,
          wind_deg,
          wind_speed
        } = data;

        const hourlyDate = new Date(dt * 1000);
        const hourlyDay = hourlyDate.getDate();

        if (hourlyDay === currentDay) {
          const [{
            icon,
            description
          }] = weather;

          const tempLi = document.createElement("li");
          tempLi.classList.add("slider-item");
          
          tempLi.innerHTML = `
                  <div class="card card-sm slider-card">
                      <p class="body-3">${module.getHours(dt, timezone)}</p>
                      <img src="./assets/images/weather_icons/${icon}.svg" width="48" height="48" loading="lazy" alt="${description}" class="weather-icon small-svg" title="${description}">
                      <p class="body-3">${parseInt(temp)}&deg;</p>
                  </div>
              `;
          hourlySection.querySelector("[data-temp]").appendChild(tempLi);

          const windLi = document.createElement("li");
          windLi.classList.add("slider-item");

          windLi.innerHTML = `
                  <div class="card card-sm slider-card">
                      <p class="body-3">${module.getHours(dt, timezone)}</p>
                      <img src="./assets/images/weather_icons/weather_sagittarius.svg" width="28" height="28" loading="lazy" alt="direction" class="xsmall-svg" style="transform: rotate(${wind_deg - 180}deg)">
                      <p class="body-3">${parseInt(module.mps_to_kmh(wind_speed))} km/h</p>
                  </div>
              `;
          hourlySection.querySelector("[data-wind]").appendChild(windLi);
        }
      }

      /**
       * 7 DAY FORECAST SECTION
       */
      //  <div class="card card-lg forecast-card">
      //   <ul data-forecast-listsm>  </ul>
      // </div>

      // 7 days small devices
       forecast7daysSmall.innerHTML = `
      <h2 class="title-2 smdays" id="forecast-labelsm">7 Days Forecast</h2>
      <div class="slider-container">
      <ul class="slider-list" data-temp data-forecast-listsm></ul>
      <ul class="slider-list" data-wind></ul>
  </div>

    `;

//7 days big devices 
      forecastSection.innerHTML = `
        <h2 class="title-2 big7days" id="forecast-label">7 Days Forecast</h2>

        <div class="card card-lg forecast-card" >
          <ul data-forecast-list>  </ul>
        </div>
      `;
      forecast14days.innerHTML = `
      <h2 class="title-2 days14" id="forecast-label14">Current Temperature Map</h2>
      `;


//  7 days forecast
      for (let i = 0; i < 7 && i < daily.length; i++) {

        const data = daily[i];

        const {
          temp: { max: temp_max },
          weather,
          dt
        } = data;
        const [{ icon, description }] = weather;
        const date = new Date(dt * 1000);

        const li = document.createElement("li");
        const lism = document.createElement("li");
        li.classList.add("card-item");
        lism.classList.add("card-item");

        li.innerHTML = `
          <div class="icon-wrapper">
            <img src="./assets/images/weather_icons/${icon}.svg" width="36" height="36" alt="${description}"
              class="weather-icon small-svg" title="${description}">

            <span class="span">
              <p class="title-2">${parseInt(temp_max)}&deg;</p>
            </span>
          </div>

          <p class="label-1">${date.getDate()} ${module.monthNames[date.getUTCMonth()]}</p>

          <p class="label-1">${module.weekDayNames[date.getUTCDay()]}</p>
        `;
        lism.innerHTML = `
        <div class="card card-sm slider-card">
        <p class="body-3">${date.getDate()} ${module.monthNames[date.getUTCMonth()]}</p>
        <img src="./assets/images/weather_icons/${icon}.svg" width="48" height="48" loading="lazy" alt="${description}" class="weather-icon small-svg" title="${description}">
        <p class="body-3">${parseInt(temp_max)}&deg;</p>      
        <p class="label-1">${module.weekDayNames[date.getUTCDay()]}</p>
    </div>
        `;

        
        forecastSection.querySelector("[data-forecast-list]").appendChild(li);
         forecast7daysSmall.querySelector("[data-forecast-listsm]").appendChild(lism);
        
      } 

 

        //   toggling the visibility based on device type
        const smallDiv = document.querySelector('.smalldevices');
        const largeDiv = document.querySelector('.largedevices');

        // Hide the largeDiv on small devices
        if (window.matchMedia('(max-width: 767px)').matches) {
          largeDiv.style.display = 'none';
          smallDiv.style.display = 'block';

        }else if (window.matchMedia('(min-width :768px)').matches) {
            largeDiv.style.display = 'block';
            smallDiv.style.display = 'none';
        }
      loading.style.display = "none";
      container.style.overflowY = "overlay";
      container.classList.add("fade-in");
    });

    var modal = document.getElementById("myModal");

   // Get the button that opens the modal
   var btn = document.querySelector("#feedbackBtn");

   // Get the <span> element that closes the modal
   var span = document.getElementsByClassName("close")[0];

   // When the user clicks the button, open the modal 
   btn.onclick = function() {
     modal.style.display = "block";
   }

   // When the user clicks on <span> (x), close the modal
   span.onclick = function() {
     modal.style.display = "none";
   }

   // When the user clicks anywhere outside of the modal, close it
   window.onclick = function(event) {
     if (event.target == modal) {
       modal.style.display = "none";
     }
   }

  //  ==========================================================feedback section========================
  const recordAudio = () =>
  new Promise(async (resolve) => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks = [];
    mediaRecorder.addEventListener("dataavailable", (event) => {
      audioChunks.push(event.data);
    });

    const start = () => mediaRecorder.start();

    const stop = () =>
      new Promise((resolve) => {
        mediaRecorder.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunks);
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          const play = () => audio.play();
          resolve({ audioBlob, audioUrl, play });
        });
        mediaRecorder.stop();
      });
    resolve({ start, stop });
  });

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

var record = true;

const startRecording = async () => {
  const recording = await recordAudio();
  const recorder = document.getElementById("recorder");
  recorder.disabled = true;
  recording.start();
  while (record == true) {
    await sleep(1);
  }
  const audio = await recording.stop();
  await sleep(2000);
  audio.play();
  recorder.disabled = false;
};

document.getElementById("recorder").addEventListener("click", (e) => {
  if (document.getElementById("recorder").classList.contains("recording")) {
    document.getElementById("recorder").classList.remove("recording");
    document.getElementById("recorder").classList.add("download");
    record = false;
    setTimeout(function () {
      document.getElementById("recorder").classList.remove("download");
      document.getElementById("recorder").classList.add("out");
    }, 1000);
  } else if (
    !document.getElementById("recorder").classList.contains("recording") &&
    !document.getElementById("recorder").classList.contains("download")
  ) {
    document.getElementById("recorder").classList.remove("out");
    document.getElementById("recorder").classList.add("recording");
    record = true;
    startRecording();
  }
});

// function setFocus () {
//   document.getElementById('w-input-text').focus();
// }

// temp map
mapboxgl.accessToken = 'pk.eyJ1IjoidGhlbzYiLCJhIjoiY2xmazRpa2VzMDdiZDN0czR5Z2tiMGxheCJ9.GMZxHYFG0rGU8R6133k1kg';
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/streets-v12',
center: [-1.0, 8.7], // starting position [lng, lat]
zoom: 5.5 // starting zoom
}); 


const openWeatherMapLayer = {
  id: 'openweathermap-layer',
  type: 'raster',
  source: {
    type: 'raster',
    tiles: [
      'https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=fd47e14dc779c51029291bd5188d9262',
    ],
    tileSize: 256,
  },
  minzoom: 0,
  maxzoom: 18,
};


// prepmap
mapboxgl.accessToken = 'pk.eyJ1IjoidGhlbzYiLCJhIjoiY2xmazRpa2VzMDdiZDN0czR5Z2tiMGxheCJ9.GMZxHYFG0rGU8R6133k1kg';
const prepmap = new mapboxgl.Map({
container: 'prepmap', // container ID
style: 'mapbox://styles/mapbox/light-v11',
center: [-1.0, 8.7], // starting position [lng, lat]
zoom: 5.5 // starting zoom
}); 

const openWeatherMapLayerPrep = {
  id: 'prepmap-layer',
  type: 'raster',
  source: {
    type: 'raster',
    tiles: [
      'https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=fd47e14dc779c51029291bd5188d9262',
    ],
    tileSize: 256,
  },
  minzoom: 0,
  maxzoom: 18,
};

 


 
  const majorCities = [
    { name: 'Ahafo Region', coordinates: [-2.5350966,6.916885199407648] },
    { name: 'Ashanti Region', coordinates: [-1.6230404,6.698081] },
    { name: 'Bono East Region', coordinates: [-1.0876492,7.803523599391317] },
    { name: 'Bono Region', coordinates: [-2.4735401,7.67617909939243] },
    { name: 'Central Region', coordinates: [-1.2430793,5.107467] },
    { name: 'Eastern Region', coordinates: [-0.3770964,6.44687699942423] },
    { name: 'Greater Accra Region', coordinates: [-0.2012376,5.5571096] },
    { name: 'North East Region', coordinates: [-0.5410794,10.395977299459267] },
    { name: 'Northern Region', coordinates: [-0.39437989999999995,9.66000049942276] },
    { name: 'Oti Region', coordinates: [0.318598,7.86338719939094] },
    { name: 'Savannah Region', coordinates: [-1.7111234,9.140065399405014] },
    { name: 'Upper West Region', coordinates: [-2.0921426,10.366952499457586] },
    { name: 'Volta Region', coordinates: [0.4556055,6.534862399420721] },
    { name: 'Western North Region', coordinates: [-2.8234891,6.227936699433756] },
    { name: 'Western Region', coordinates: [-1.7519316,4.887401] },
    { name: 'WA', coordinates: [-2.5054273,10.0623261] },
    { name: 'Sunyani', coordinates: [-2.3309226,7.3384389] },
    { name: 'Yendi', coordinates: [-0.0035068,9.446647] }
  // Add more cities as needed
  ];
 
// temp map

map.on('load', async() => {
  map.addLayer(openWeatherMapLayer);


  for (const city of majorCities) {
    // Make API request to OpenWeatherMap 
    const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${city.coordinates[0]}&lon=${city.coordinates[1]}&appid=fd47e14dc779c51029291bd5188d9262&units=metric`);
    const data = await response.json();
    const {
      current: { weather, dt, sunrise, sunset, temp, feels_like, pressure, visibility, humidity },
      timezone
    } = data;
    const [{ description, icon }] = weather;

    // Add marker with popup for each city
 
const el = document.createElement('div');
const width = 50;
const height = 50;
el.className = 'marker';
el.style.backgroundImage = `url(./assets/images/weather_icons/${icon}.svg)`;
el.style.width = `${width}px`;
el.style.height = `${height}px`;
// el.setAttribute("viewBox", `0 0 ${width} ${height}`);
 
    new mapboxgl.Marker(el)
      .setLngLat(city.coordinates)
      .setPopup(new mapboxgl.Popup().setHTML(`  
      <div class="card" style="background-color: black; color: white;">
    <ul>
    <li>Location: ${city.name}</li>
    <li>Weather: ${description}</li>
      <li>Feels Like: ${feels_like}°C</li>
      <li>Humidity: ${humidity}<sub>%</sub></li>
      <li>Pressure: ${pressure} <sub>HPa</sub></li>
       <li>Visibility: ${(visibility /1000)}<sub>KM</sub></li>
    </ul>
  </div>`))
      .addTo(map);
  }


  const forecastcontainer = document.querySelector(".forecastcontainer");
  forecastcontainer.innerHTML = "";

  document
  .getElementById('lightPreset')
  .addEventListener('change', async function() {
 // Make API request to OpenWeatherMap 
 const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall/day_summary?${lat}&${lon}&date=${this.value}&appid=fd47e14dc779c51029291bd5188d9262&units=metric`);
 const data = await response.json();

 const {
  temperature,
  wind,
   date, 
   humidity,
   pressure,
} = data;

console.log(data);
//  document.getElementById("datee").value = date;

var modal = document.getElementById("dateforecastModal");

 

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

  modal.style.display = "block";


// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

      const card = document.createElement("div");
      card.classList.add("card", "card-lg");
      // if (timeOfDay == "day") {
      //   card.style.backgroundImage = 'url("/assets/images/sky-day1.jpg")';
      // } else {
      //  'url("/assets/images/night-sky.jpg")';
      // }
      card.style.backgroundColor = '#2d70c1';

      // card.style.backgroundImage = 'url("/assets/images/sky-day.jpg")';
      card.style.backgroundSize = 'cover';
      card.innerHTML = `
        <h2 class="title-2" id="highlights-label">Forecast For ${date}</h2>

        <div class="highlight-list">
          <div class="card card-sm highlight-card">

            <h3 class="title-3">Humidity</h3>

            <div class="wrapper">
              <span class="m-icon">humidity_percentage</span>

              <p class="title-1">${humidity['afternoon']}<sub>%</sub></p>
            </div>

          </div>

          <div class="card card-sm highlight-card">

            <h3 class="title-3">Pressure</h3>

            <div class="wrapper">
              <span class="m-icon">airwave</span>

              <p class="title-1">${pressure['afternoon']}<sub>hPa</sub></p>
            </div>

          </div>

          <div class="card card-sm highlight-card">

            <h3 class="title-3">Wind Speed</h3>

            <div class="wrapper">
              <span class="m-icon">speed</span>

              <p class="title-1">${parseInt(module.mps_to_kmh(wind['max'].speed))}<sub>km</sub></p>
            </div>

          </div>

          <div class="card card-sm highlight-card">

            <h3 class="title-3">Feels Like</h3>

            <div class="wrapper">
              <span class="m-icon">thermostat</span>

              <p class="title-1">${parseInt(temperature.max)}&deg;<sup>c</sup></p>
            </div>

          </div>

        </div>
      `;

      forecastcontainer.appendChild(card);

//  const [{ description, icon }] = weather;

//  // Add marker with popup for each city

// const el = document.createElement('div');
// const width = 50;
// const height = 50;
// el.className = 'marker';
// el.style.backgroundImage = `url(./assets/images/weather_icons/${icon}.svg)`;
// el.style.width = `${width}px`;
// el.style.height = `${height}px`;
// // el.setAttribute("viewBox", `0 0 ${width} ${height}`);

//  new mapboxgl.Marker(el)
//    .setLngLat(city.coordinates)
//    .setPopup(new mapboxgl.Popup().setHTML(`  
//    <div class="card" style="background-color: black; color: white;">
//  <ul>
//  <li>Location: ${city.name}</li>
//  <li>Weather: ${description}</li>
//    <li>Feels Like: ${feels_like}°C</li>
//    <li>Humidity: ${humidity}<sub>%</sub></li>
//    <li>Pressure: ${pressure} <sub>HPa</sub></li>
//     <li>Visibility: ${(visibility /1000)}<sub>KM</sub></li>
//  </ul>
// </div>`))
//    .addTo(map);










  });






});



// prep maap
prepmap.on('load', async() => {
  prepmap.addLayer(openWeatherMapLayerPrep);


});


  // JavaScript to populate options with dates
 
    var select = document.getElementById('lightPreset');
    var today = new Date();

    // Populate options for the next 1 year
    for (var i = 0; i < 365; i++) {
      var date = new Date(today);
      date.setDate(today.getDate() + i);

      var option = document.createElement('option');
      option.value = formatDate(date);
      option.textContent = formatOptionText(date);
      select.appendChild(option);
    }

    // Function to format date as "YYYY-MM-DD"
    function formatDate(date) {
      var year = date.getFullYear();
      var month = ('0' + (date.getMonth() + 1)).slice(-2);
      var day = ('0' + date.getDate()).slice(-2);
      return year + '-' + month + '-' + day;
    }

    // Function to format option text as "3rd Sep 2023"
    function formatOptionText(date) {
      var day = date.getDate();
      var month = date.toLocaleString('en-us', { month: 'short' });
      var year = date.getFullYear();
      return day + getOrdinalSuffix(day) + ' ' + month + ' ' + year;
    }

    // Function to get ordinal suffix for day (st, nd, rd, th)
    function getOrdinalSuffix(day) {
      if (day >= 11 && day <= 13) {
        return 'th';
      }

      switch (day % 10) {
        case 1:
          return 'st';
        case 2:
          return 'nd';
        case 3:
          return 'rd';
        default:
          return 'th';
      }
    }

// submit weather warning details
document.getElementById('weatherForm').addEventListener('submit', function (event) {
  event.preventDefault();
  alert("Submited Successfully")
  console.log('Form submitted with data:', {
      contact: document.getElementById('contact').value,
      email: document.getElementById('email').value,
      options: document.getElementById('options').checked
  });
});





}

export const error404 = () => errorContent.style.display = "flex";